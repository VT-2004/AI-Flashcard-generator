import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import router from "./routes/index";

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", router);

// Global error handler — must be last
app.use(errorHandler);

// Start
const start = async (): Promise<void> => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  });
};

start();