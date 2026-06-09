import Groq from "groq-sdk";
import { env } from "../config/env";
import { buildFlashcardPrompt } from "../prompts/flashcardPrompt";

const client = new Groq({
  apiKey: env.GROQ_API_KEY,
});

export interface GeneratedCard {
  front: string;
  back: string;
  order: number;
}

export interface GeneratedDeck {
  title: string;
  cards: GeneratedCard[];
}

export const generateFlashcards = async (
  sourceText: string,
  topic: string,
  cardCount: number
): Promise<{
  deck: GeneratedDeck;
  processingTimeMs: number;
  tokensUsed: number;
}> => {
  const startTime = Date.now();

  const prompt = buildFlashcardPrompt(sourceText, topic, cardCount);

  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",   // free, fast, great for JSON
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const processingTimeMs = Date.now() - startTime;
  const rawText = response.choices[0]?.message?.content?.trim() ?? "";

  if (!rawText) {
    throw new Error("Empty response from AI");
  }

  // Strip code fences if model adds them
  let parsed: GeneratedDeck;
  try {
    const clean = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    parsed = JSON.parse(clean);
  } catch (err) {
    throw new Error(`Failed to parse AI response as JSON: ${rawText}`);
  }

  if (!parsed.title || !Array.isArray(parsed.cards)) {
    throw new Error("AI response missing required fields: title, cards");
  }

  const tokensUsed = response.usage?.total_tokens ?? 0;

  return {
    deck: parsed,
    processingTimeMs,
    tokensUsed,
  };
};