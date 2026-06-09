export const buildFlashcardPrompt = (
  sourceText: string,
  topic: string,
  cardCount: number
): string => `
You are an expert educator and flashcard creator.

The user has provided text on the topic: "${topic}".
Your job is to generate exactly ${cardCount} high-quality flashcards from it.

Rules:
- Each "front" must be a clear, specific question
- Each "back" must be a concise, accurate answer (1-3 sentences max)
- Cover the most important concepts — no filler cards
- Questions should test understanding, not just memorization
- Do not number the cards or add any extra commentary

You MUST respond with ONLY a valid JSON object in this exact shape:
{
  "title": "<a short descriptive title for this deck, max 6 words>",
  "cards": [
    { "front": "question here", "back": "answer here", "order": 1 },
    { "front": "question here", "back": "answer here", "order": 2 }
  ]
}

Do not include markdown, code fences, or any text outside the JSON object.

Here is the source text:
"""
${sourceText}
"""
`;