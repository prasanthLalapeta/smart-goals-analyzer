export interface Goal {
    personId: string;
    employeeDisplayName: string;
    job: string;
    goalName: string;
    deliverable: string;
    targetResult: string;
    score: number;
    suggestions: string;
}

export interface Employee {
    personId: string;
    employeeDisplayName: string;
    job: string;
    totalGoals: number;
    averageScore: number;
}

export interface EmployeeWithScore extends Omit<Employee, 'averageScore'> {
    totalScore: number;
} 