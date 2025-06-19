# **App Name**: PlanWise AI

## Core Features:

- Input Capture: Allow users to input planning parameters: planning topic, time available per day, duration, and goals.
- Dynamic Prompt Generation: Dynamically generate a prompt for the OpenAI API based on user inputs, tailoring the request for optimal planning results.
- AI Plan Generation: Use the OpenAI GPT-3.5 Turbo API as a tool, via a fetch request, to process the prompt and return a structured daily, weekly, monthly, or yearly plan.
- Plan Presentation: Display the AI-generated plan in a readable and organized format, such as a list or calendar view.
- Loading Animation: Provide a visual loading indicator while fetching the plan from the OpenAI API.
- Copy to Clipboard: Enable users to copy the generated plan to their clipboard.
- Form Reset: Option to reset the input form, clearing all fields for a fresh start.

## Style Guidelines:

- Primary color: Deep sky blue (#41A3D1) for a clear, open, intellectual feel.
- Background color: Very light blue (#EBF4FA).
- Accent color: Lavender (#B583B4) to draw attention to important interactive elements, as a color shift away from blue that's neither too jarring, nor too similar.
- Headline font: 'Space Grotesk' sans-serif, for a clean modern look. Body text: 'Inter' sans-serif.
- Use a set of consistent and minimalist icons for different planning aspects.
- A clean, intuitive layout that is easy to navigate, focusing on user input and AI plan display.
- Subtle animations on data loading to improve user experience.