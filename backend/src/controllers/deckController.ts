import { Request, Response } from "express";
import {
  generateAndSaveDeck,
  getDecksByUser,
  getDeckById,
  deleteDeck,
  incrementStudySession,
} from "../services/deckService";
import { sendSuccess, sendError } from "../utils/responseHelper";

// POST /api/decks/generate
export const generateDeckController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sourceText, topic, cardCount } = req.body;
    const clerkId = req.userId!;

    if (!sourceText || !topic) {
      sendError(res, "sourceText and topic are required", 400);
      return;
    }

    if (sourceText.length > 5000) {
      sendError(res, "sourceText must be under 5000 characters", 400);
      return;
    }

    const count = Math.min(Math.max(parseInt(cardCount) || 10, 3), 20);

    const deck = await generateAndSaveDeck({
      clerkId,
      sourceText,
      topic,
      cardCount: count,
    });

    sendSuccess(res, { deck }, 201);
  } catch (error) {
    console.error("generateDeckController error:", error);
    sendError(res, "Failed to generate deck", 500);
  }
};

// GET /api/decks
export const getDecksController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const clerkId = req.userId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getDecksByUser(clerkId, page, limit);

    sendSuccess(res, result);
  } catch (error) {
    sendError(res, "Failed to fetch decks", 500);
  }
};

// GET /api/decks/:deckId
export const getDeckController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deckId = req.params.deckId as string;
    const clerkId = req.userId!;

    const deck = await getDeckById(deckId, clerkId);

    if (!deck) {
      sendError(res, "Deck not found", 404);
      return;
    }

    sendSuccess(res, { deck });
  } catch (error) {
    sendError(res, "Failed to fetch deck", 500);
  }
};

// DELETE /api/decks/:deckId
export const deleteDeckController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deckId = req.params.deckId as string;
    const clerkId = req.userId!;

    const deleted = await deleteDeck(deckId, clerkId);

    if (!deleted) {
      sendError(res, "Deck not found", 404);
      return;
    }

    sendSuccess(res, { message: "Deck deleted successfully" });
  } catch (error) {
    sendError(res, "Failed to delete deck", 500);
  }
};

// PATCH /api/decks/:deckId/study
export const studyDeckController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deckId = req.params.deckId as string;
    const clerkId = req.userId!;

    const deck = await incrementStudySession(deckId, clerkId);

    if (!deck) {
      sendError(res, "Deck not found", 404);
      return;
    }

    sendSuccess(res, { deck });
  } catch (error) {
    sendError(res, "Failed to update study session", 500);
  }
};