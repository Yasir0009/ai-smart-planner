
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
  plan: z.string().describe('The generated plan in Markdown format.'),
});
export type GeneratePlanOutput = z.infer<typeof GeneratePlanOutputSchema>;

export async function generatePlan(input: GeneratePlanInput): Promise<GeneratePlanOutput> {
  return generatePlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlanPrompt',
  input: {schema: GeneratePlanInputSchema},
  output: {schema: GeneratePlanOutputSchema},
  prompt: `You are an AI planning assistant. Generate a plan based on the following information using Markdown formatting.
For {{{planDuration}}} plans, try to structure the output in a way that could be easily read in a table-like format.
Use Markdown headings for titles and sections (#, ##, ###). Use bold for emphasis on time or key activities. Use lists for tasks.

Example for a Daily plan:
## [Day Name or Date, e.g., Monday, October 26th]
### Morning
- **[Time Range e.g., 08:00 - 09:00]**: [Activity] - [Optional: Details/Notes]
- **[Time Range e.g., 09:00 - 10:00]**: [Activity] - [Optional: Details/Notes]
### Afternoon
- **[Time Range e.g., 13:00 - 14:00]**: [Activity] - [Optional: Details/Notes]
### Evening
- **[Time Range e.g., 19:00 - 20:00]**: [Activity] - [Optional: Details/Notes]

Example for a Weekly plan:
## Week of [Start Date]
### Monday
- **Focus:** [Main focus for Monday]
- **Tasks:**
  - [Task 1 description]
  - [Task 2 description]
### Tuesday
- **Focus:** [Main focus for Tuesday]
- **Tasks:**
  - [Task 1 description]
  - [Task 2 description]
... and so on for other days.

Ensure the output is clean, well-structured Markdown.

Planning Topic: {{{planningTopic}}}
Tasks:
{{#each tasks}}
- {{{this}}}
{{/each}}
Available Time: {{{availableTime}}}
Plan Duration: {{{planDuration}}}
Custom Goals: {{{customGoals}}}

Generate a detailed and actionable plan as Markdown.`,
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
