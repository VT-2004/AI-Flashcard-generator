import { Router } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import decksRouter from "./decks";

const router = Router();

router.use("/health", healthRouter);
router.use("/users", usersRouter);
router.use("/decks", decksRouter);

export default router;