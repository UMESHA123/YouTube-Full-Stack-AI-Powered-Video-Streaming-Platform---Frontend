import z from "zod/v3";

export const PromptResponse = z.object({
  answer: z.string(),              // Short answer
  keywords: z.array(z.string()),   // Array of keywords
});

export const PromptGeneratorSchema = z.object({
  title: z.string(),
  summary: z.string(),
  keywords: z.array(z.string()),
});