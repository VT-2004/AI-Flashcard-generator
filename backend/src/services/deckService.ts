import { Deck, IDeck } from "../models/Deck";
import { User } from "../models/User";
import { generateFlashcards } from "./aiService";

interface GenerateDeckParams {
  clerkId: string;
  sourceText: string;
  topic: string;
  cardCount: number;
}

export const generateAndSaveDeck = async (
  params: GenerateDeckParams
): Promise<IDeck> => {
  const { clerkId, sourceText, topic, cardCount } = params;

  // Find user
  const user = await User.findOne({ clerkId });
  if (!user) {
    throw new Error("User not found");
  }

  // Call AI
  const { deck: generated, processingTimeMs, tokensUsed } =
    await generateFlashcards(sourceText, topic, cardCount);

  // Save deck to MongoDB
  const deck = await Deck.create({
    userId: user._id,
    clerkId,
    title: generated.title,
    topic,
    sourceText,
    cards: generated.cards,
    cardCount: generated.cards.length,
    aiModel: "llama-3.1-8b-instant",
    processingTimeMs,
    tokensUsed,
  });

  // Update user stats
  await User.findByIdAndUpdate(user._id, {
    $inc: {
      "stats.totalDecksGenerated": 1,
      "stats.totalCardsGenerated": generated.cards.length,
    },
  });

  return deck;
};

export const getDecksByUser = async (
  clerkId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ decks: IDeck[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;

  const [decks, total] = await Promise.all([
    Deck.find({ clerkId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-sourceText"), // don't send full source text in list view
    Deck.countDocuments({ clerkId }),
  ]);

  return {
    decks,
    total,
    pages: Math.ceil(total / limit),
  };
};

export const getDeckById = async (
  deckId: string,
  clerkId: string
): Promise<IDeck | null> => {
  return await Deck.findOne({ _id: deckId, clerkId });
};

export const deleteDeck = async (
  deckId: string,
  clerkId: string
): Promise<boolean> => {
  const result = await Deck.findOneAndDelete({ _id: deckId, clerkId });
  return !!result;
};

export const incrementStudySession = async (
  deckId: string,
  clerkId: string
): Promise<IDeck | null> => {
  return await Deck.findOneAndUpdate(
    { _id: deckId, clerkId },
    {
      $inc: { studySessions: 1 },
      $set: { lastStudiedAt: new Date() },
    },
    { new: true }
  );
};