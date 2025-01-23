import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Check, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HelpSection() {
  return (
    <div className="space-y-6">
      {/* Download Template Section */}
      <Card className="bg-white shadow-md">
        <CardHeader className="border-b bg-muted/50">
          <CardTitle className="text-lg">Getting Started</CardTitle>
          <CardDescription className="hidden sm:block">
            Download our template and follow the format for best results
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            {/* Template Download Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="space-y-1 flex-1">
                <h4 className="font-medium">Excel Template</h4>
                <p className="text-sm text-muted-foreground">
                  Use this template to format your goals data correctly
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                <a href="/goals-template.xlsx" download>
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </a>
              </Button>
            </div>

            {/* Required Columns Section */}
            <div className="rounded-lg bg-muted/50 p-4">
              <h5 className="font-medium mb-3">Required Columns</h5>
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-sm">
                    <span className="font-medium">Employee Person ID</span>
                    <p className="text-muted-foreground text-xs mt-1">Unique identifier for each employee</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Employee Display Name</span>
                    <p className="text-muted-foreground text-xs mt-1">Full name of the employee</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Job</span>
                    <p className="text-muted-foreground text-xs mt-1">Employee's job role or title</p>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-sm">
                    <span className="font-medium">Goal Name</span>
                    <p className="text-muted-foreground text-xs mt-1">Brief title of the goal</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Deliverable</span>
                    <p className="text-muted-foreground text-xs mt-1">What needs to be achieved</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Target Result</span>
                    <p className="text-muted-foreground text-xs mt-1">Expected outcome with metrics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Make the two-column layout responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Example Evaluation Card */}
        <Card className="bg-white shadow-md">
          <CardHeader className="border-b bg-muted/50">
            <CardTitle className="text-lg">Example Goal Evaluation</CardTitle>
            <CardDescription className="hidden sm:block">
              See how goals are scored using SMART criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Input Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Input Goal</h4>
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <div className="grid gap-2 text-sm">
                    <div><span className="font-medium text-muted-foreground">Job Role:</span> Software Developer</div>
                    <div><span className="font-medium text-muted-foreground">Goal Name:</span> "Implement upgrades to Service Cloud"</div>
                    <div><span className="font-medium text-muted-foreground">Deliverable:</span> "Implement upgrades for stability and scalability."</div>
                    <div><span className="font-medium text-muted-foreground">Target Result:</span> "Upgrades completed and verified by Q4."</div>
                  </div>
                </div>
              </div>

              {/* Evaluation Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">SMART Analysis</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <div>
                      <span className="font-medium">Specific</span>
                      <p className="text-sm text-muted-foreground">Clear and detailed goal name.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <X className="h-5 w-5 text-red-500 shrink-0" />
                    <div>
                      <span className="font-medium">Measurable</span>
                      <p className="text-sm text-muted-foreground">No numerical metric in the target result.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <div>
                      <span className="font-medium">Achievable</span>
                      <p className="text-sm text-muted-foreground">Deliverable is concise and realistic.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <div>
                      <span className="font-medium">Relevant</span>
                      <p className="text-sm text-muted-foreground">Goal aligns with the job role.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <div>
                      <span className="font-medium">Time-bound</span>
                      <p className="text-sm text-muted-foreground">"By Q4" adds a timeline.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Final Results</h4>
                <div className="grid gap-2 rounded-lg bg-muted/50 p-4">
                  <div className="text-sm"><span className="font-medium">Score:</span> 80/100</div>
                  <div className="text-sm"><span className="font-medium">Suggestions:</span> "Add measurable metrics."</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SMART Criteria Card */}
        <Card className="bg-white shadow-md">
          <CardHeader className="border-b bg-muted/50">
            <CardTitle className="text-lg">SMART Criteria Guide</CardTitle>
            <CardDescription>
              Understanding the components of SMART goals
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full space-y-2">
              <AccordionItem value="specific" className="border rounded-lg px-4">
                <AccordionTrigger className="text-sm hover:bg-muted/50 rounded-lg py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">S</span>pecific
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm pb-4 text-muted-foreground">
                  <div className="space-y-2">
                    <p>Goals should be clear, detailed, and unambiguous. Answer these questions:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>What exactly needs to be accomplished?</li>
                      <li>Who is responsible for it?</li>
                      <li>What steps need to be taken?</li>
                      <li>What resources are required?</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="measurable" className="border rounded-lg px-4">
                <AccordionTrigger className="text-sm hover:bg-muted/50 rounded-lg py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">M</span>easurable
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm pb-4 text-muted-foreground">
                  <div className="space-y-2">
                    <p>Goals must have concrete criteria for measuring progress. Include:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Specific numbers or quantities</li>
                      <li>Clear metrics for success</li>
                      <li>Key Performance Indicators (KPIs)</li>
                      <li>Quantifiable targets</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="achievable" className="border rounded-lg px-4">
                <AccordionTrigger className="text-sm hover:bg-muted/50 rounded-lg py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">A</span>chievable
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm pb-4 text-muted-foreground">
                  <div className="space-y-2">
                    <p>Goals should be realistic and attainable. Consider:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Available resources and budget</li>
                      <li>Time constraints</li>
                      <li>Technical feasibility</li>
                      <li>Team capabilities and capacity</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="relevant" className="border rounded-lg px-4">
                <AccordionTrigger className="text-sm hover:bg-muted/50 rounded-lg py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">R</span>elevant
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm pb-4 text-muted-foreground">
                  <div className="space-y-2">
                    <p>Goals should align with broader objectives. Verify:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Alignment with team/department goals</li>
                      <li>Connection to business strategy</li>
                      <li>Timing appropriateness</li>
                      <li>Value to the organization</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="time-bound" className="border rounded-lg px-4">
                <AccordionTrigger className="text-sm hover:bg-muted/50 rounded-lg py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">T</span>ime-bound
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm pb-4 text-muted-foreground">
                  <div className="space-y-2">
                    <p>Goals must have clear deadlines. Include:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Specific completion date</li>
                      <li>Key milestones and deadlines</li>
                      <li>Timeline for deliverables</li>
                      <li>Regular progress check points</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}