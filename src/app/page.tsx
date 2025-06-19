"use client";

import React, { useState } from 'react';
import { PlanForm } from '@/components/plan-form';
import { PlanDisplay } from '@/components/plan-display';
import { LoadingSpinner } from '@/components/loading-spinner';
import { ThemeToggle } from '@/components/theme-toggle';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { generatePlan, type GeneratePlanInput } from '@/ai/flows/generate-plan';
import { Button } from '@/components/ui/button'; // For potential future use, like a global reset
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const [plan, setPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: GeneratePlanInput) => {
    setIsLoading(true);
    setError(null);
    setPlan(null);
    try {
      const result = await generatePlan(data);
      setPlan(result.plan);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormReset = () => {
    setPlan(null);
    setError(null);
    // The form itself handles resetting its fields via the PlanForm's reset function
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8">
      <header className="w-full max-w-3xl flex justify-between items-center mb-8">
        <div className="flex items-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary mr-2">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
            <path d="M12.5 7H11V12.5L16.25 15.32L17 14.05L12.5 11.5V7Z" fill="currentColor"/>
          </svg>
          <h1 className="font-headline text-3xl md:text-4xl font-bold">
            PlanWise <span className="text-primary">AI</span>
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="w-full max-w-3xl">
        <PlanForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        
        {isLoading && (
          <div className="mt-8">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-8">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Generating Plan</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {plan && !isLoading && (
          <PlanDisplay planText={plan} />
        )}
        
        {!isLoading && !plan && !error && (
          <Card className="w-full mt-8 shadow-lg bg-card border-dashed border-2">
            <CardContent className="p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground lucide lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
              <h2 className="text-xl font-semibold mb-2 font-headline">Ready to Plan?</h2>
              <p className="text-muted-foreground">
                Fill out the form above to generate your personalized plan with the power of AI.
                Let's organize your tasks and goals efficiently!
              </p>
            </CardContent>
          </Card>
        )}
      </main>
      <footer className="w-full max-w-3xl mt-12 py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} PlanWise AI. All rights reserved.</p>
        <p className="mt-1">Powered by GenAI and Next.js</p>
      </footer>
    </div>
  );
}
