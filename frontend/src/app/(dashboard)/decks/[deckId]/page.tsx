"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/api";
import { IDeck, ICard } from "@/types/deck";

export default function StudyDeckPage() {
  const { deckId } = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const [deck, setDeck] = useState<IDeck | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const token = await getToken();
        await api.patch(`/api/decks/${deckId}/study`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const res = await api.get(`/api/decks/${deckId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeck(res.data.data.deck);
      } catch {
        router.push("/decks");
      } finally {
        setLoading(false);
      }
    };
    fetchDeck();
  }, [deckId]);

  const handleNext = () => {
    if (!deck) return;
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex + 1 >= deck.cards.length) {
        setCompleted(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 150);
  };

  const handlePrev = () => {
    if (currentIndex === 0) return;
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => prev - 1), 150);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading deck...</p>
        </div>
      </div>
    );
  }

  if (!deck) return null;

  if (completed) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-5">
        <div className="text-7xl">🎉</div>
        <h2 className="text-3xl font-bold text-slate-900">Deck Complete!</h2>
        <p className="text-slate-500">
          You studied all{" "}
          <span className="font-semibold text-slate-700">
            {deck.cards.length} cards
          </span>{" "}
          in{" "}
          <span className="font-semibold text-indigo-600">{deck.title}</span>
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setIsFlipped(false);
              setCompleted(false);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Study again
          </button>
          <button
            onClick={() => router.push("/decks")}
            className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Back to decks
          </button>
        </div>
      </div>
    );
  }

  const currentCard: ICard = deck.cards[currentIndex];
  const progress = ((currentIndex + 1) / deck.cards.length) * 100;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{deck.title}</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Card {currentIndex + 1} of {deck.cards.length}
          </p>
        </div>
        <button
          onClick={() => router.push("/decks")}
          className="text-sm text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Progress */}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card */}
      <div
        className="cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setIsFlipped((p) => !p)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "300px",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white border-2 border-slate-200 hover:border-indigo-300 rounded-2xl p-8 flex flex-col justify-between transition-colors"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-xs text-indigo-500 font-semibold uppercase tracking-wider">
              Question
            </span>
            <p className="text-slate-900 text-xl font-semibold text-center leading-relaxed">
              {currentCard.front}
            </p>
            <p className="text-xs text-slate-300 text-center">
              Click to reveal answer
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-8 flex flex-col justify-between"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="text-xs text-indigo-200 font-semibold uppercase tracking-wider">
              Answer
            </span>
            <p className="text-white text-xl font-semibold text-center leading-relaxed">
              {currentCard.back}
            </p>
            <p className="text-xs text-indigo-300 text-center">
              Click to see question
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex-1 bg-white border border-slate-200 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-semibold py-3 rounded-xl transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {currentIndex + 1 === deck.cards.length ? "Finish 🎉" : "Next →"}
        </button>
      </div>
    </div>
  );
}