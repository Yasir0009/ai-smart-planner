"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardCopy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlanDisplayProps {
  planText: string;
}

export function PlanDisplay({ planText }: PlanDisplayProps) {
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(planText)
      .then(() => {
        toast({
          title: "Copied to clipboard!",
          description: "The plan has been copied to your clipboard.",
        });
      })
      .catch(err => {
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Could not copy the plan to clipboard.",
        });
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <Card className="w-full mt-8 shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Your AI-Generated Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4 whitespace-pre-wrap bg-muted/20">
          {planText}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-end pt-4">
        <Button onClick={handleCopyToClipboard} variant="outline">
          <ClipboardCopy className="mr-2 h-4 w-4" /> Copy Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
