import { Router } from "express";
import { syncUserController, getMeController } from "../controllers/userController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// All user routes require auth
router.post("/sync", requireAuth, syncUserController);
router.get("/me", requireAuth, getMeController);

export default router;