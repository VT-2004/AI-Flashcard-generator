import { Request, Response, NextFunction } from "express";
import { createClerkClient } from "@clerk/backend";
import { env } from "../config/env";
import { sendError } from "../utils/responseHelper";

const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      sendError(res, "Unauthorized — no token provided", 401);
      return;
    }

    const token = authHeader.split(" ")[1];

    // v3 API — verifyToken is a standalone import, not on the client
    const { verifyToken } = await import("@clerk/backend");
    const payload = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
    });

    req.userId = payload.sub;
    next();
  } catch (error) {
    sendError(res, "Unauthorized — invalid token", 401);
  }
};