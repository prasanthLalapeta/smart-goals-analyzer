import { FileUpload } from '@/components/file-upload';
import { HelpSection } from '@/components/help-section';
import { Brain, Target, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-8">
      {/* Header Section with gradient background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 mb-8">
        <div className="absolute inset-0 bg-grid-black/[0.02] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="container mx-auto relative">
          <div className="text-center space-y-6">
            {/* Title Section */}
            <div className="space-y-4">
              <div className="inline-block rounded-full bg-white/80 backdrop-blur-sm border px-3 py-1 text-sm text-muted-foreground shadow-sm">
                🎯 Powered by AI
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="p-2 rounded-2xl bg-white/50 backdrop-blur-sm shadow-sm">
                  <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
                <h1 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                  SMART Goals Analyzer
                </h1>
              </div>
            </div>

            {/* Description Section */}
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Transform your employee goals with our AI-powered SMART analysis system.
                Upload your Excel file and get instant, detailed feedback on every goal.
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">Instant Analysis</span>
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">AI-Powered Insights</span>
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">Detailed Feedback</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto space-y-6 sm:space-y-8">
        <div className="space-y-6">
          <FileUpload />
        </div>

        <div className="mt-8">
          <HelpSection />
        </div>
      </div>
    </main>
  );
}