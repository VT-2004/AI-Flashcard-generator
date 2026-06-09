import { User, IUser } from "../models/User";

interface SyncUserParams {
  clerkId: string;
  email: string;
  username: string;
  avatarUrl: string;
}

// Creates user if first login, updates info if returning user
export const syncUser = async (params: SyncUserParams): Promise<IUser> => {
  const { clerkId, email, username, avatarUrl } = params;

  const user = await User.findOneAndUpdate(
    { clerkId },
    {
      $set: { email, username, avatarUrl },
      $setOnInsert: {
        stats: { totalDecksGenerated: 0, totalCardsGenerated: 0 },
        preferences: { defaultCardCount: 10 },
      },
    },
    {
      upsert: true,        // create if doesn't exist
      new: true,           // return the updated document
      runValidators: true,
    }
  );

  return user;
};

export const getUserByClerkId = async (
  clerkId: string
): Promise<IUser | null> => {
  return await User.findOne({ clerkId });
};