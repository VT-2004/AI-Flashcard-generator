import { Router } from "express";
import {
  generateDeckController,
  getDecksController,
  getDeckController,
  deleteDeckController,
  studyDeckController,
} from "../controllers/deckController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// All deck routes are protected
router.post("/generate", requireAuth, generateDeckController);
router.get("/", requireAuth, getDecksController);
router.get("/:deckId", requireAuth, getDeckController);
router.delete("/:deckId", requireAuth, deleteDeckController);
router.patch("/:deckId/study", requireAuth, studyDeckController);

export default router;