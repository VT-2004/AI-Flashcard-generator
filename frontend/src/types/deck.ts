export interface ICard {
  _id: string;
  front: string;
  back: string;
  order: number;
}

export interface IDeck {
  _id: string;
  title: string;
  topic: string;
  sourceText?: string;
  cards: ICard[];
  cardCount: number;
  studySessions: number;
  lastStudiedAt: string | null;
  aiModel: string;
  processingTimeMs: number;
  tokensUsed: number;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateRequest {
  sourceText: string;
  topic: string;
  cardCount: number;
}

export interface DecksResponse {
  decks: IDeck[];
  total: number;
  pages: number;
}