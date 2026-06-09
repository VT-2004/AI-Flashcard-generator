export interface IUser {
  _id: string;
  clerkId: string;
  email: string;
  username: string;
  avatarUrl: string;
  stats: {
    totalDecksGenerated: number;
    totalCardsGenerated: number;
  };
  preferences: {
    defaultCardCount: number;
  };
  createdAt: string;
}