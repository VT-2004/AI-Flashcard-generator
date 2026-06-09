"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/api";
import { IDeck } from "@/types/deck";

interface GenerateParams {
  sourceText: string;
  topic: string;
  cardCount: number;
}

interface UseGenerateReturn {
  generate: (params: GenerateParams) => Promise<IDeck | null>;
  loading: boolean;
  error: string | null;
}

export const useGenerate = (): UseGenerateReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  const generate = async (params: GenerateParams): Promise<IDeck | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = await auth.getToken();

      const response = await api.post("/api/decks/generate", params, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data.deck as IDeck;
    } catch (err: unknown) {
      const message =
        (err as any)?.response?.data?.error ?? "Failed to generate flashcards";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error };
};