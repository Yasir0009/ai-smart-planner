'use server';

/**
 * @fileOverview Generates a personalized plan based on user inputs.
 *
 * - generatePlan - A function that generates a plan based on user inputs.
 * - GeneratePlanInput - The input type for the generatePlan function.
 * - GeneratePlanOutput - The return type for the generatePlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePlanInputSchema = z.object({
  planningTopic: z.string().describe('The topic of the plan (e.g., Study, Fitness, Work, Life Tasks).'),
  tasks: z.array(z.string()).describe('An array of specific tasks to include in the plan.'),
  availableTime: z.string().describe('The amount of time available each day (e.g., 2 hours).'),
  planDuration: z.enum(['Daily', 'Weekly', 'Monthly', 'Yearly']).describe('The duration of the plan.'),
  customGoals: z.string().optional().describe('Any custom goals or tasks to consider (optional).'),
});
export type GeneratePlanInput = z.infer<typeof GeneratePlanInputSchema>;

const GeneratePlanOutputSchema = z.object({
  plan: z.string().describe('The generated plan.'),
});
export type GeneratePlanOutput = z.infer<typeof GeneratePlanOutputSchema>;

export async function generatePlan(input: GeneratePlanInput): Promise<GeneratePlanOutput> {
  return generatePlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlanPrompt',
  input: {schema: GeneratePlanInputSchema},
  output: {schema: GeneratePlanOutputSchema},
  prompt: `You are an AI planning assistant. Generate a plan based on the following information:\n\nPlanning Topic: {{{planningTopic}}}\nTasks: {{#each tasks}}{{{this}}}\n{{/each}}Available Time: {{{availableTime}}}\nPlan Duration: {{{planDuration}}}\nCustom Goals: {{{customGoals}}}\n\nGenerate a detailed and actionable plan.`,
});

const generatePlanFlow = ai.defineFlow(
  {
    name: 'generatePlanFlow',
    inputSchema: GeneratePlanInputSchema,
    outputSchema: GeneratePlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
