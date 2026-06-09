import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    stats: {
      totalDecksGenerated: { type: Number, default: 0 },
      totalCardsGenerated: { type: Number, default: 0 },
    },
    preferences: {
      defaultCardCount: { type: Number, default: 10 },
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);