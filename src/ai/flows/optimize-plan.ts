'use server';

/**
 * @fileOverview AI flow for optimizing a given plan based on new instructions or priorities.
 *
 * - optimizePlan - A function that takes a plan and optimization instructions and returns an optimized plan.
 * - OptimizePlanInput - The input type for the optimizePlan function.
 * - OptimizePlanOutput - The return type for the optimizePlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizePlanInputSchema = z.object({
  originalPlan: z
    .string()
    .describe('The original plan to be optimized, in plain text.'),
  optimizationInstructions: z
    .string()
    .describe(
      'Instructions on how to optimize the plan, including new circumstances, priorities, or goals.'
    ),
});
export type OptimizePlanInput = z.infer<typeof OptimizePlanInputSchema>;

const OptimizePlanOutputSchema = z.object({
  optimizedPlan: z
    .string()
    .describe('The optimized plan, adjusted based on the given instructions.'),
});
export type OptimizePlanOutput = z.infer<typeof OptimizePlanOutputSchema>;

export async function optimizePlan(input: OptimizePlanInput): Promise<OptimizePlanOutput> {
  return optimizePlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizePlanPrompt',
  input: {schema: OptimizePlanInputSchema},
  output: {schema: OptimizePlanOutputSchema},
  prompt: `You are an AI assistant specialized in optimizing plans.

  Given the original plan and the optimization instructions, revise the plan accordingly.
  Maintain the original format and structure of the plan as much as possible, while incorporating the new instructions.

  Original Plan:
  {{originalPlan}}

  Optimization Instructions:
  {{optimizationInstructions}}

  Optimized Plan:
  `,
});

const optimizePlanFlow = ai.defineFlow(
  {
    name: 'optimizePlanFlow',
    inputSchema: OptimizePlanInputSchema,
    outputSchema: OptimizePlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
