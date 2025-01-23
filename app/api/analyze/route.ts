import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import OpenAI from 'openai';

interface Goal {
  personId: string;
  employeeDisplayName: string;
  job: string;
  goalName: string;
  deliverable: string;
  targetResult: string;
  score: number;
  suggestions: string;
}

interface Employee {
  personId: string;
  employeeDisplayName: string;
  job: string;
  totalGoals: number;
  totalScore: number;
}

interface EmployeeStats extends Omit<Employee, 'totalScore'> {
  averageScore: number;
}

interface AnalysisEmployee {
  personId: string;
  employeeDisplayName: string;
  job: string;
  totalGoals: number;
  averageScore: number;
}

interface AnalysisResponse {
  goals: Goal[];
  employees: AnalysisEmployee[];
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const BATCH_SIZE = 5; // Process 5 goals at a time

export async function POST(request: NextRequest) {
  try {
    // Check API Key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        error: 'Configuration Error',
        message: 'OpenAI API key is not configured'
      }, { status: 500 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file');

    // Type check for File
    if (!file || !(file instanceof File)) {
      return NextResponse.json({
        error: 'Invalid File',
        message: 'No file provided or invalid file type'
      }, { status: 400 });
    }

    // Read and parse the Excel file
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);

      // Log data for debugging
      console.log('Parsed data:', data);

      if (!data || !Array.isArray(data) || data.length === 0) {
        return NextResponse.json({
          error: 'Empty File',
          message: 'The Excel file is empty or contains no valid data.'
        }, { status: 400 });
      }

      // Log the data structure to help with debugging
      console.log('Excel data structure:', Object.keys(data[0] || {}));

      // Process data in batches
      const batches = [];
      for (let i = 0; i < data.length; i += BATCH_SIZE) {
        batches.push(data.slice(i, i + BATCH_SIZE));
      }

      let allGoals: Goal[] = [];
      let employeeStats = new Map<string, Employee>();

      // Process each batch
      for (const batch of batches) {
        const prompt = `You are a JSON-generating API that analyzes employee goals based on SMART criteria.

Analyze these employee goals and return ONLY a JSON object with this exact structure:
{
  "goals": [
    {
      "personId": "Employee Person ID",
      "employeeDisplayName": "Employee Display Name",
      "job": "Employee Job Title",
      "goalName": "Goal Name",
      "deliverable": "Goal Deliverable",
      "targetResult": "Target Result",
      "score": 85,
      "suggestions": "Suggestions for improvement"
    }
  ],
  "employees": [
    {
      "personId": "Employee Person ID",
      "employeeDisplayName": "Employee Display Name",
      "job": "Job Title",
      "totalGoals": 5,
      "averageScore": 87.5
    }
  ]
}

Rules:
1. Extract all employee and goal information from the input data
2. Score each goal (0-100) based on SMART criteria
3. Provide brief improvement suggestions
4. Calculate employee statistics
5. Return ONLY valid JSON
6. Preserve all original data fields from input

Input data:
${JSON.stringify(batch, null, 2)}`;

        const completion = await openai.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "gpt-3.5-turbo",
          temperature: 0.3,
          max_tokens: 1000,
        });

        try {
          const analysis = JSON.parse(completion.choices[0].message.content || '{}') as AnalysisResponse;

          // Validate and merge batch results
          if (analysis.goals && Array.isArray(analysis.goals)) {
            allGoals = [...allGoals, ...analysis.goals];
          }

          if (analysis.employees && Array.isArray(analysis.employees)) {
            analysis.employees.forEach((emp: AnalysisEmployee) => {
              if (!employeeStats.has(emp.personId)) {
                employeeStats.set(emp.personId, {
                  personId: emp.personId,
                  employeeDisplayName: emp.employeeDisplayName,
                  job: emp.job,
                  totalGoals: 0,
                  totalScore: 0
                });
              }
              const stats = employeeStats.get(emp.personId)!;
              stats.totalGoals += emp.totalGoals;
              stats.totalScore += (emp.averageScore * emp.totalGoals);
            });
          }
        } catch (parseError) {
          console.error('Batch processing error:', parseError);
          continue;
        }
      }

      // Calculate final employee statistics
      const finalEmployeeStats: EmployeeStats[] = Array.from(employeeStats.values()).map(emp => ({
        personId: emp.personId,
        employeeDisplayName: emp.employeeDisplayName,
        job: emp.job,
        totalGoals: emp.totalGoals,
        averageScore: Math.round((emp.totalScore / emp.totalGoals) * 10) / 10
      }));

      return NextResponse.json({
        goals: allGoals,
        employees: finalEmployeeStats
      });

    } catch (parseError) {
      console.error('Excel parsing error:', parseError);
      return NextResponse.json({
        error: 'Parse Error',
        message: 'Failed to parse Excel file. Please check the file format.'
      }, { status: 400 });
    }

  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json({
      error: 'Server Error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    }, { status: 500 });
  }
}