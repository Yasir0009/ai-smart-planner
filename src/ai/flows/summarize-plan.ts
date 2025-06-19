'use server';

/**
 * @fileOverview Summarizes a generated plan.
 *
 * - summarizePlan - A function that summarizes a plan.
 * - SummarizePlanInput - The input type for the summarizePlan function.
 * - SummarizePlanOutput - The return type for the summarizePlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePlanInputSchema = z.object({
  plan: z.string().describe('The plan to summarize.'),
});
export type SummarizePlanInput = z.infer<typeof SummarizePlanInputSchema>;

const SummarizePlanOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the plan.'),
});
export type SummarizePlanOutput = z.infer<typeof SummarizePlanOutputSchema>;

export async function summarizePlan(input: SummarizePlanInput): Promise<SummarizePlanOutput> {
  return summarizePlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePlanPrompt',
  input: {schema: SummarizePlanInputSchema},
  output: {schema: SummarizePlanOutputSchema},
  prompt: `Summarize the following plan in a concise manner:\n\n{{{plan}}}`, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  }
});

const summarizePlanFlow = ai.defineFlow(
  {
    name: 'summarizePlanFlow',
    inputSchema: SummarizePlanInputSchema,
    outputSchema: SummarizePlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
