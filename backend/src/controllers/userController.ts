import { Request, Response } from "express";
import { syncUser, getUserByClerkId } from "../services/userService";
import { sendSuccess, sendError } from "../utils/responseHelper";

// POST /api/users/sync
// Called once when user logs in for the first time from frontend
export const syncUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, username, avatarUrl } = req.body;
    const clerkId = req.userId!;

    if (!email || !username) {
      sendError(res, "email and username are required", 400);
      return;
    }

    const user = await syncUser({
      clerkId,
      email,
      username: username || email.split("@")[0],
      avatarUrl: avatarUrl || "",
    });

    sendSuccess(res, { user }, 201);
  } catch (error) {
    sendError(res, "Failed to sync user", 500);
  }
};

// GET /api/users/me
// Returns current user profile + stats
export const getMeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const clerkId = req.userId!;

    const user = await getUserByClerkId(clerkId);

    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    sendSuccess(res, { user });
  } catch (error) {
    sendError(res, "Failed to fetch user", 500);
  }
};