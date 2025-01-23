"use client";

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, Loader2, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ResultsDisplay } from './results-display';

const loadingMessages = [
  "Analyzing goal specificity...",
  "Measuring goal metrics...",
  "Checking achievability...",
  "Evaluating relevance...",
  "Verifying time constraints...",
  "Calculating SMART scores...",
];

export function FileUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [error, setError] = useState<string | null>(null);

  // Loading message animation
  useEffect(() => {
    if (!isLoading) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[currentIndex]);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, [isLoading]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError(null); // Clear any previous errors

    // Validate file extension
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Response:', response.status, data);

      if (!response.ok) {
        setError(data.message || 'Failed to analyze file');
        setResults(null);
        return;
      }

      setResults(data);
      setError(null);
      toast.success('File analyzed successfully!');

    } catch (error) {
      console.error('Error:', error);
      setError('Network error. Please check your connection and try again.');
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

      {results && <ResultsDisplay results={results} />}
    </div>
  );
}