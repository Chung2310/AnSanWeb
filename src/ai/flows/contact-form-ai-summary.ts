'use server';

/**
 * @fileOverview Summarizes contact form submissions using AI to provide admins with quick insights.
 *
 * - summarizeContactForm - A function that summarizes the contact form message.
 * - ContactFormInput - The input type for the summarizeContactForm function.
 * - ContactFormOutput - The return type for the summarizeContactForm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContactFormInputSchema = z.object({
  name: z.string().describe('The name of the person submitting the contact form.'),
  email: z.string().email().describe('The email address of the person submitting the contact form.'),
  message: z.string().describe('The message from the contact form.'),
});
export type ContactFormInput = z.infer<typeof ContactFormInputSchema>;

const ContactFormOutputSchema = z.object({
  summary: z.string().describe('A short summary of the contact form message.'),
});
export type ContactFormOutput = z.infer<typeof ContactFormOutputSchema>;

export async function summarizeContactForm(input: ContactFormInput): Promise<ContactFormOutput> {
  return summarizeContactFormFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contactFormSummaryPrompt',
  input: {schema: ContactFormInputSchema},
  output: {schema: ContactFormOutputSchema},
  prompt: `You are an AI assistant specializing in summarizing contact form submissions.

  Given the following information from a contact form, create a concise summary of the message.

  Name: {{{name}}}
  Email: {{{email}}}
  Message: {{{message}}}
  \nSummary: `,
});

const summarizeContactFormFlow = ai.defineFlow(
  {
    name: 'summarizeContactFormFlow',
    inputSchema: ContactFormInputSchema,
    outputSchema: ContactFormOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
