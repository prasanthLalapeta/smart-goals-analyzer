import { NextRequest } from 'next/server';
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
const BATCH_SIZE = 5;
const MAX_GOALS = 50;

const loadingMessages = [
  "Analyzing goal specificity",
  "Measuring goal metrics",
  "Checking achievability",
  "Evaluating relevance",
  "Verifying time constraints",
  "Calculating SMART scores"
];

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const sendMessage = async (message: any) => {
    await writer.write(encoder.encode(JSON.stringify(message) + '\n'));
  };

  const processData = async () => {
    try {
      // Check API Key
      if (!process.env.OPENAI_API_KEY) {
        await sendMessage({
          type: 'error',
          message: 'OpenAI API key is not configured'
        });
        return;
      }

      // Parse form data
      const formData = await request.formData();
      const file = formData.get('file');

      if (!file || !(file instanceof File)) {
        await sendMessage({
          type: 'error',
          message: 'No file provided or invalid file type'
        });
        return;
      }

      // Read and parse Excel
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);

      if (!data || !Array.isArray(data) || data.length === 0) {
        await sendMessage({
          type: 'error',
          message: 'The Excel file is empty or contains no valid data.'
        });
        return;
      }

      // Process in batches
      const batches = [];
      for (let i = 0; i < data.length; i += BATCH_SIZE) {
        batches.push(data.slice(i, i + BATCH_SIZE));
      }

      await sendMessage({
        type: 'status',
        message: `Starting analysis of ${data.length} goals in ${batches.length} batches...`
      });

      let allGoals: Goal[] = [];
      let employeeStats = new Map<string, Employee>();

      // Process each batch
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const batchNumber = i + 1;

        await sendMessage({
          type: 'status',
          message: `Analyzing batch ${batchNumber} of ${batches.length}: ${loadingMessages[i % loadingMessages.length]}`
        });

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

        const analysis = JSON.parse(completion.choices[0].message.content || '{}') as AnalysisResponse;

        if (analysis.goals) {
          allGoals = [...allGoals, ...analysis.goals];
          await sendMessage({
            type: 'partial',
            data: { goals: analysis.goals }
          });
        }

        if (analysis.employees) {
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
      }

      // Calculate final stats
      const finalEmployeeStats = Array.from(employeeStats.values()).map(emp => ({
        personId: emp.personId,
        employeeDisplayName: emp.employeeDisplayName,
        job: emp.job,
        totalGoals: emp.totalGoals,
        averageScore: Math.round((emp.totalScore / emp.totalGoals) * 10) / 10
      }));

      // Send final results
      await sendMessage({
        type: 'complete',
        data: {
          goals: allGoals,
          employees: finalEmployeeStats
        }
      });

    } catch (error) {
      console.error('Error:', error);
      await sendMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      await writer.close();
    }
  };

  // Start processing
  processData();

  // Return the readable stream
  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}