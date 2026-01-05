'use server';

/**
 * @fileOverview AI-powered newsletter content generation for personalized wine recommendations.
 *
 * This file defines a Genkit flow to generate personalized newsletter content based on user preferences
 * and past browsing history. It includes wine recommendations and engaging content to encourage
 * users to explore the wine catalog further.
 *
 * - generatePersonalizedNewsletterContent - A function that generates personalized newsletter content.
 * - PersonalizedNewsletterInput - The input type for the generatePersonalizedNewsletterContent function.
 * - PersonalizedNewsletterOutput - The return type for the generatePersonalizedNewsletterContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedNewsletterInputSchema = z.object({
  userPreferences: z
    .string()
    .describe("A description of the user's wine preferences, past purchases and browsing history."),
  availableWines: z.string().describe('A description of the available wines in the catalog.'),
  includeWineRecommendation: z
    .boolean()
    .describe(
      'A boolean value that determines whether or not to include a personalized wine recommendation.'
    ),
});
export type PersonalizedNewsletterInput = z.infer<typeof PersonalizedNewsletterInputSchema>;

const PersonalizedNewsletterOutputSchema = z.object({
  subject: z.string().describe('The subject line of the personalized newsletter.'),
  content: z.string().describe('The personalized content of the newsletter, including wine recommendations.'),
});
export type PersonalizedNewsletterOutput = z.infer<typeof PersonalizedNewsletterOutputSchema>;

export async function generatePersonalizedNewsletterContent(
  input: PersonalizedNewsletterInput
): Promise<PersonalizedNewsletterOutput> {
  return personalizedNewsletterContentFlow(input);
}

const recommendWine = ai.defineTool({
  name: 'recommendWine',
  description: 'Recommends a wine based on user preferences and available wines.',
  inputSchema: z.object({
    userPreferences: z
      .string()
      .describe("A description of the user's wine preferences, past purchases, and browsing history."),
    availableWines: z.string().describe('A description of the available wines in the catalog.'),
  }),
  outputSchema: z.string().describe('A personalized wine recommendation.'),
},
async input => {
  // This can call any typescript function.
  // Return the recommended wine...
  return `Based on your preferences, we recommend trying our exquisite  ${input.availableWines.substring(0, 20)}!`;
});

const prompt = ai.definePrompt({
  name: 'personalizedNewsletterPrompt',
  input: {schema: PersonalizedNewsletterInputSchema},
  output: {schema: PersonalizedNewsletterOutputSchema},
  tools: [recommendWine],
  prompt: `You are an expert marketing copywriter specializing in personalized newsletters for a premium wine company.

You will generate a compelling subject line and newsletter content based on the user's preferences and the available wines.

{{#if includeWineRecommendation}}
  {{#tool recommendWine}}
  {"userPreferences": "{{{userPreferences}}}", "availableWines": "{{{availableWines}}}"}
  {{/tool}}
{{/if}}

User Preferences: {{{userPreferences}}}
Available Wines: {{{availableWines}}}

Subject: (A short, attention-grabbing subject line)
Content: (Engaging newsletter content with personalized wine recommendations)`,
});

const personalizedNewsletterContentFlow = ai.defineFlow(
  {
    name: 'personalizedNewsletterContentFlow',
    inputSchema: PersonalizedNewsletterInputSchema,
    outputSchema: PersonalizedNewsletterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

