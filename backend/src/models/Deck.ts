import mongoose, { Document, Schema } from "mongoose";

export interface ICard {
  _id?: mongoose.Types.ObjectId;
  front: string;
  back: string;
  order: number;
}

export interface IDeck extends Document {
  userId: mongoose.Types.ObjectId;
  clerkId: string;
  title: string;
  topic: string;
  sourceText: string;
  cards: ICard[];
  cardCount: number;
  studySessions: number;
  lastStudiedAt: Date | null;
  aiModel: string;
  processingTimeMs: number;
  tokensUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema = new Schema<ICard>({
  front: { type: String, required: true },
  back: { type: String, required: true },
  order: { type: Number, required: true },
});

const DeckSchema = new Schema<IDeck>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clerkId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    sourceText: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    cards: [CardSchema],
    cardCount: {
      type: Number,
      default: 0,
    },
    studySessions: {
      type: Number,
      default: 0,
    },
    lastStudiedAt: {
      type: Date,
      default: null,
    },
    aiModel: {
      type: String,
      default: "llama-3.1-8b-instant",
    },
    processingTimeMs: {
      type: Number,
      default: 0,
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast user history queries
DeckSchema.index({ clerkId: 1, createdAt: -1 });

export const Deck = mongoose.model<IDeck>("Deck", DeckSchema);