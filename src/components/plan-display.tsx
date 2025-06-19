
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

  const applyStrongFormatting = (line: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    const regex = /(\*\*(.*?)\*\*|__(.*?)__)/g;
    let match;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }
      const strongText = match[2] || match[3]; // match[2] for **text**, match[3] for __text__
      parts.push(<strong key={`strong-${parts.length}-${match.index}`}>{strongText}</strong>);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }
    return parts;
  };

  const parsePlanText = (text: string): JSX.Element[] => {
    const lines = text.split('\\n');
    const elements: JSX.Element[] = [];
    let inList = false;
    let listItems: JSX.Element[] = [];

    const processList = () => {
      if (inList && listItems.length > 0) {
        elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-6 my-2 space-y-1">{listItems}</ul>);
      }
      listItems = [];
      inList = false;
    };

    lines.forEach((line, index) => {
      const key = `line-${index}`;

      if (line.startsWith('# ')) {
        processList();
        elements.push(<h1 key={key} className="font-headline text-2xl font-bold mt-6 mb-3">{applyStrongFormatting(line.substring(2))}</h1>);
      } else if (line.startsWith('## ')) {
        processList();
        elements.push(<h2 key={key} className="font-headline text-xl font-semibold mt-4 mb-2">{applyStrongFormatting(line.substring(3))}</h2>);
      } else if (line.startsWith('### ')) {
        processList();
        elements.push(<h3 key={key} className="font-headline text-lg font-semibold mt-3 mb-1">{applyStrongFormatting(line.substring(4))}</h3>);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) {
          inList = true;
        }
        const listItemContent = line.substring(line.startsWith('- ') ? 2 : line.startsWith('* ') ? 2 : 0);
        listItems.push(<li key={`${key}-li`}>{applyStrongFormatting(listItemContent)}</li>);
      } else if (line.trim() === '') {
        processList();
        elements.push(<div key={key} className="h-2" />); 
      } else {
        processList();
        elements.push(<p key={key} className="my-1">{applyStrongFormatting(line)}</p>);
      }
    });

    processList(); // Process any remaining list items
    return elements;
  };

  const formattedPlan = parsePlanText(planText);

  return (
    <Card className="w-full mt-8 shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Your AI-Generated Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted/20">
          <div className="prose dark:prose-invert max-w-none">
             {formattedPlan.length > 0 ? formattedPlan : <p>{planText}</p>}
          </div>
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
