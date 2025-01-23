"use client";

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Goal {
  name: string;
  score: number;
  suggestions: string;
  personId: string;
  employeeDisplayName: string;
  goalName: string;
  job: string;
  deliverable: string;
  targetResult: string;
}

interface Employee {
  personId: string;
  employeeDisplayName: string;
  job: string;
  totalGoals: number;
  averageScore: number;
}

interface ResultsDisplayProps {
  results: {
    goals: Goal[];
    employees: Employee[];
  };
}

const getScoreColor = (score: number) => {
  if (score >= 90) return "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20";
  if (score >= 70) return "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20";
  if (score >= 50) return "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20";
  return "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20";
};

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState('goals');

  const downloadExcel = (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="goals">Evaluated Goals</TabsTrigger>
            <TabsTrigger value="employees">Employee Scores</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="goals">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold">Goal Evaluation Results</h3>
                <Button
                  onClick={() => downloadExcel(results.goals, 'goal-evaluation')}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Excel
                </Button>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Person ID</TableHead>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Job</TableHead>
                      <TableHead>Goal Name</TableHead>
                      <TableHead>Deliverable</TableHead>
                      <TableHead>Target Result</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead>Suggestions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.goals.map((goal, index) => (
                      <TableRow key={index}>
                        <TableCell>{goal.personId}</TableCell>
                        <TableCell>{goal.employeeDisplayName}</TableCell>
                        <TableCell>{goal.job}</TableCell>
                        <TableCell>{goal.goalName}</TableCell>
                        <TableCell>{goal.deliverable}</TableCell>
                        <TableCell>{goal.targetResult}</TableCell>
                        <TableCell className="text-right">
                          <span className={`inline-flex items-center justify-center min-w-[3rem] px-2.5 py-1 rounded-full text-sm font-medium ${getScoreColor(goal.score)}`}>
                            {goal.score}
                          </span>
                        </TableCell>
                        <TableCell>{goal.suggestions}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="employees">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold">Employee Score Summary</h3>
                <Button
                  onClick={() => downloadExcel(results.employees, 'employee-scores')}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Excel
                </Button>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Person ID</TableHead>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Job</TableHead>
                      <TableHead className="text-right">Total Goals</TableHead>
                      <TableHead className="text-right">Average Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.employees.map((employee, index) => (
                      <TableRow key={index}>
                        <TableCell>{employee.personId}</TableCell>
                        <TableCell>{employee.employeeDisplayName}</TableCell>
                        <TableCell>{employee.job}</TableCell>
                        <TableCell className="text-right">{employee.totalGoals}</TableCell>
                        <TableCell className="text-right">
                          <span className={`inline-flex items-center justify-center min-w-[3rem] px-2.5 py-1 rounded-full text-sm font-medium ${getScoreColor(employee.averageScore)}`}>
                            {employee.averageScore.toFixed(1)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Card>
  );
}