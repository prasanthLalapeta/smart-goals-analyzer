"use client";

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, Loader2, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ResultsDisplay } from './results-display';

interface StreamMessage {
  type: 'status' | 'error' | 'partial' | 'complete';
  message?: string;
  data?: {
    goals?: Goal[];
    employees?: Employee[];
  };
}

export function FileUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<null | {
    goals: Goal[];
    employees: Employee[];
    isComplete: boolean;
  }>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Starting analysis...');
  const [error, setError] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError(null);

    // Validate file extension
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setIsLoading(true);
    setResults(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.body) {
        throw new Error('No response stream available');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let goals: Goal[] = [];
      let employees: Employee[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const message = JSON.parse(line) as StreamMessage;

            switch (message.type) {
              case 'status':
                if (message.message) {
                  setLoadingMessage(message.message);
                }
                break;

              case 'error':
                throw new Error(message.message);

              case 'partial':
                if (message.data?.goals) {
                  goals = [...goals, ...message.data.goals];
                  setResults(prev => ({
                    goals,
                    employees: prev?.employees || [],
                    isComplete: false
                  }));
                }
                break;

              case 'complete':
                if (message.data) {
                  setResults({
                    goals: message.data.goals || [],
                    employees: message.data.employees || [],
                    isComplete: true
                  });
                  toast.success('Analysis complete!');
                }
                break;
            }
          } catch (parseError) {
            console.error('Error parsing stream:', parseError);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during analysis');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

  return (
    <div className="space-y-6 max-w-full overflow-x-auto">
      {error && (
        <Alert variant="destructive">
          <div className="flex w-full items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex-1">
              {error}
            </AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setError(null)}
              className="h-6 w-6 shrink-0"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      )}

      <Card className="p-4 sm:p-6">
        <div
          {...getRootProps()}
          className={`
            relative overflow-hidden
            border-2 border-dashed rounded-xl p-4 sm:p-8 text-center cursor-pointer
            transition-all duration-300 ease-in-out
            ${isDragActive
              ? 'border-primary bg-primary/5 scale-[0.99] shadow-lg'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }
            ${isLoading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <div className="absolute inset-0 bg-grid-black/[0.02] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

          <input {...getInputProps()} />
          <div className="relative flex flex-col items-center gap-4">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <div className="flex flex-col items-center gap-1">
                  <p className="text-lg font-medium text-primary">
                    {loadingMessage}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Please wait while we analyze your goals
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-full bg-primary/10 p-3 transition-transform duration-300 group-hover:scale-110">
                  <Upload className={`h-6 w-6 ${isDragActive ? 'text-primary animate-bounce' : 'text-primary/80'}`} />
                </div>
                <div className="space-y-2">
                  <p className={`text-lg font-medium transition-colors duration-300 ${isDragActive ? 'text-primary' : ''}`}>
                    {isDragActive ? 'Drop the file here' : 'Drag & drop your Excel file here'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or click to select a file
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Accepts .xlsx and .xls files</span>
                </div>

                {isDragActive && (
                  <div className="absolute inset-4 border-2 border-primary/20 rounded-lg animate-pulse" />
                )}
              </>
            )}
          </div>
        </div>
      </Card>

      {results && (
        <ResultsDisplay
          results={results}
          showEmployees={results.isComplete}
        />
      )}
    </div>
  );
}