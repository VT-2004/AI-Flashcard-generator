"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import api from "@/lib/api";
import { IDeck } from "@/types/deck";

export default function DecksPage() {
  const { getToken } = useAuth();
  const [decks, setDecks] = useState<IDeck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const token = await getToken();
        const res = await api.get("/api/decks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDecks(res.data.data.decks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDecks();
  }, []);

  const handleDelete = async (deckId: string) => {
    try {
      const token = await getToken();
      await api.delete(`/api/decks/${deckId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDecks((prev) => prev.filter((d) => d._id !== deckId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Decks</h1>
          <p className="text-slate-500 mt-1">
            {loading ? "Loading..." : `${decks.length} deck${decks.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <Link
          href="/generate"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          + New Deck
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-100 animate-pulse rounded-2xl h-44" />
          ))}
        </div>
      ) : decks.length === 0 ? (
        <div className="text-center bg-white border border-dashed border-slate-300 rounded-2xl py-20">
          <p className="text-5xl mb-4">🗂️</p>
          <p className="text-slate-700 font-semibold text-lg">No decks yet</p>
          <p className="text-slate-400 text-sm mt-2">
            Generate your first flashcard deck to get started
          </p>
          <Link
            href="/generate"
            className="inline-block mt-5 bg-indigo-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Generate now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => (
            <div
              key={deck._id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-indigo-200 transition-all flex flex-col"
            >
              {/* Top */}
              <div className="flex-1 mb-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-slate-900 text-sm leading-tight pr-2">
                    {deck.title}
                  </h3>
                  <span className="shrink-0 bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {deck.cardCount} cards
                  </span>
                </div>
                <p className="text-xs text-indigo-600 font-medium mt-1">
                  {deck.topic}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                <span>📚 {deck.studySessions} sessions</span>
                <span>🗓 {new Date(deck.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/decks/${deck._id}`}
                  className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Study →
                </Link>
                <button
                  onClick={() => handleDelete(deck._id)}
                  className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}