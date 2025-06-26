// src/ai/flows/zakat-qa.ts
'use server';
/**
 * @fileOverview An AI-powered question and answer system for Zakat inquiries.
 *
 * - answerZakatQuestion - A function that answers user questions about Zakat, using a LLM and external information when necessary.
 * - AnswerZakatQuestionInput - The input type for the answerZakatQuestion function.
 * - AnswerZakatQuestionOutput - The return type for the answerZakatQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerZakatQuestionInputSchema = z.object({
  question: z.string().describe('The user question about Zakat.'),
});
export type AnswerZakatQuestionInput = z.infer<typeof AnswerZakatQuestionInputSchema>;

const AnswerZakatQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question about Zakat.'),
});
export type AnswerZakatQuestionOutput = z.infer<typeof AnswerZakatQuestionOutputSchema>;

export async function answerZakatQuestion(input: AnswerZakatQuestionInput): Promise<AnswerZakatQuestionOutput> {
  return answerZakatQuestionFlow(input);
}

const answerZakatQuestionPrompt = ai.definePrompt({
  name: 'answerZakatQuestionPrompt',
  input: {schema: AnswerZakatQuestionInputSchema},
  output: {schema: AnswerZakatQuestionOutputSchema},
  prompt: `You are a knowledgeable expert on Zakat, an Islamic financial obligation.

  A user has asked the following question about Zakat:
  {{question}}

  Answer the question accurately, leveraging your understanding of Islamic jurisprudence. If necessary to provide a complete and accurate answer, incorporate external trusted information.
  Ensure rulings align with reliable relevant madhab scholars. Include disclaimer that this is not Fatwa but educational aid. Recommend consulting a scholar for complex cases. Be culturally sensitive in language and design.
  `,
});

const answerZakatQuestionFlow = ai.defineFlow(
  {
    name: 'answerZakatQuestionFlow',
    inputSchema: AnswerZakatQuestionInputSchema,
    outputSchema: AnswerZakatQuestionOutputSchema,
  },
  async input => {
    const {output} = await answerZakatQuestionPrompt(input);
    return output!;
  }
);
