
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
  plan: z.string().describe('The generated plan, using emojis for structure and emphasis, Markdown lists for tasks, and a tips section.'),
});
export type GeneratePlanOutput = z.infer<typeof GeneratePlanOutputSchema>;

export async function generatePlan(input: GeneratePlanInput): Promise<GeneratePlanOutput> {
  return generatePlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlanPrompt',
  input: {schema: GeneratePlanInputSchema},
  output: {schema: GeneratePlanOutputSchema},
  prompt: `You are an AI planning assistant. Generate a plan based on the following information.
VERY IMPORTANT:
- Do NOT use Markdown headings like #, ##, ###.
- Instead, use emojis to denote structure:
  - For the main plan title (if any), start the line with 📜 followed by a space.
  - For major sections (like days of the week or main time blocks), start the line with 📅 followed by a space.
  - For sub-sections (like Morning, Afternoon, Evening), start the line with ☀️ (Morning), 🌤️ (Afternoon), or 🌙 (Evening) followed by a space.
  - For a 'Tips for Success' section, if generated, start its title with 💡 followed by a space. List individual tips also using Markdown lists with a hyphen and a space ('- ').
- Do NOT use Markdown bold like **text**.
- Instead, to emphasize time or key activities, use the ⏰ emoji before the time/activity.
- Use Markdown lists with a hyphen and a space ('- ') for individual tasks and tips.

Example for a Daily plan:
📅 Monday, October 26th
☀️ Morning
- ⏰ 08:00 - 09:00: Breakfast and prepare for the day
- ⏰ 09:00 - 10:00: Deep work session 1
🌤️ Afternoon
- ⏰ 13:00 - 14:00: Lunch break
- ⏰ 14:00 - 15:00: Meetings
🌙 Evening
- ⏰ 19:00 - 20:00: Dinner
- ⏰ 20:00 - 21:00: Relax and unwind

Example for a Weekly plan:
📜 Week of [Start Date]
📅 Monday
- ⏰ Focus: Complete project proposal
- Tasks:
  - Finalize introduction
  - Gather supporting data
📅 Tuesday
- ⏰ Focus: Client meetings
- Tasks:
  - Prepare meeting agenda
  - Follow up on action items

Ensure the output is clean and well-structured, following these emoji and list guidelines.

Planning Topic: {{{planningTopic}}}
Tasks:
{{#each tasks}}
- {{{this}}}
{{/each}}
Available Time: {{{availableTime}}}
Plan Duration: {{{planDuration}}}
Custom Goals: {{{customGoals}}}

Generate a detailed and actionable plan.
After generating the core plan, include a 'Tips for Success' section. This section should start with '💡 Tips for Success' and contain 2-3 actionable tips relevant to the plan, formatted as a Markdown list.`,
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
