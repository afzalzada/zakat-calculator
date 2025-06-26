// src/ai/flows/zakat-calculation.ts
'use server';
/**
 * @fileOverview Zakat liability calculation flow. This flow is kept for potential future use or for very complex cases, but the primary calculation logic has been moved to the client-side for better performance and offline access.
 *
 * - calculateZakatForAsset - A function that initiates the Zakat calculation process for a single asset.
 * - CalculateZakatForAssetInput - The input type for the calculateZakatForAsset function.
 * - CalculateZakatForAssetOutput - The return type for the calculateZakatForAsset function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const assetTypes = [
  'Gold',
  'Silver',
  'Cash & Savings',
  'Investments',
  'Business Assets',
  'Livestock',
  'Agriculture',
  'Rikaz (Treasure)',
] as const;

const CalculateZakatForAssetInputSchema = z.object({
  assetType: z.enum(assetTypes).describe('The type of asset for Zakat calculation.'),
  value: z
    .number()
    .describe(
      'The monetary value or count of the asset (e.g., value of gold, number of sheep).'
    ),
  notes: z
    .string()
    .optional()
    .describe(
      'Optional user-provided notes for more context, e.g., "rain-irrigated land" for agriculture or "40 sheep" for livestock.'
    ),
  madhab: z
    .enum(['Hanafi', 'Maliki', 'Shafi’i', 'Hanbali'])
    .describe('The Madhab to follow for Zakat calculation rules.'),
  hawlMet: z.boolean().describe('Whether the Hawl (one lunar year of possession) has been completed.'),
});
export type CalculateZakatForAssetInput = z.infer<typeof CalculateZakatForAssetInputSchema>;

const CalculateZakatForAssetOutputSchema = z.object({
  zakatLiability: z.number().describe('The total Zakat liability calculated for the given asset.'),
  explanation: z
    .string()
    .describe(
      'A detailed explanation of how the Zakat liability was calculated, including the Nisab, Zakat rate, and any specific rules for the asset type and Madhab.'
    ),
});
export type CalculateZakatForAssetOutput = z.infer<typeof CalculateZakatForAssetOutputSchema>;

export async function calculateZakatForAsset(
  input: CalculateZakatForAssetInput
): Promise<CalculateZakatForAssetOutput> {
  return calculateZakatForAssetFlow(input);
}

const calculateZakatForAssetPrompt = ai.definePrompt({
  name: 'calculateZakatForAssetPrompt',
  input: {schema: CalculateZakatForAssetInputSchema},
  output: {schema: CalculateZakatForAssetOutputSchema},
  prompt: `You are an expert in Islamic finance, specializing in Zakat calculation according to different Madhabs.
  The user has provided some information and requires a detailed explanation or calculation for a complex case that couldn't be handled on the client-side.

  - Asset Type: {{{assetType}}}
  - Value / Count: {{{value}}}
  - Madhab: {{{madhab}}}
  - User claims Hawl (1 Year) is met: {{{hawlMet}}}
  {{#if notes}}
  - Additional Notes: {{{notes}}}
  {{/if}}

  Your task is to provide a clear explanation based on the provided data. The primary calculation is now done on the client. Use this flow to handle edge cases or provide deeper fiqhi explanations based on the notes.

  For example, if the user asks a question in the notes like "My business assets include intellectual property, how is that valued?", you should provide an answer.

  Focus on the details provided in the 'notes' field to give a comprehensive answer.

  Return a zakatLiability of 0 and use the 'explanation' field to provide your detailed answer.
  `,
});

const calculateZakatForAssetFlow = ai.defineFlow(
  {
    name: 'calculateZakatForAssetFlow',
    inputSchema: CalculateZakatForAssetInputSchema,
    outputSchema: CalculateZakatForAssetOutputSchema,
  },
  async input => {
    // This flow is now a fallback for complex cases.
    // The main logic is on the client.
    const {output} = await calculateZakatForAssetPrompt(input);
    return output!;
  }
);
