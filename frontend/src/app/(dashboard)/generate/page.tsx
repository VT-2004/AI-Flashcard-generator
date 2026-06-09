"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGenerate } from "@/hooks/useGenerate";
import { IDeck, ICard } from "@/types/deck";

const CARD_COUNT_OPTIONS = [5, 10, 15, 20];

export default function GeneratePage() {
  const router = useRouter();
  const { generate, loading, error } = useGenerate();
  const [sourceText, setSourceText] = useState("");
  const [topic, setTopic] = useState("");
  const [cardCount, setCardCount] = useState(10);
  const [generatedDeck, setGeneratedDeck] = useState<IDeck | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const handleGenerate = async () => {
    if (!sourceText.trim() || !topic.trim()) return;
    const deck = await generate({ sourceText, topic, cardCount });
    if (deck) {
      setGeneratedDeck(deck);
      setFlippedCards(new Set());
    }
  };

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Generate Flashcards
        </h1>
        <p className="text-slate-500 mt-1">
          Paste any text and AI will create flashcards for you
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        {/* Topic */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Topic
          </label>
          <input
            type="text"
            placeholder="e.g. React Hooks, World War 2, Photosynthesis"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Source text */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Source Text
            </label>
            <span className={`text-xs font-medium ${sourceText.length > 4500 ? "text-red-500" : "text-slate-400"}`}>
              {sourceText.length}/5000
            </span>
          </div>
          <textarea
            placeholder="Paste your notes, textbook content, article, or any text here..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            maxLength={5000}
            rows={8}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Card count */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Number of Cards
          </label>
          <div className="flex gap-2">
            {CARD_COUNT_OPTIONS.map((count) => (
              <button
                key={count}
                onClick={() => setCardCount(count)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  cardCount === count
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !sourceText.trim() || !topic.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-indigo-200 disabled:shadow-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Generating flashcards...
            </span>
          ) : (
            "Generate Flashcards ✨"
          )}
        </button>
      </div>

      {/* Generated cards */}
      {generatedDeck && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {generatedDeck.title}
              </h2>
              <p className="text-slate-400 text-sm mt-0.5">
                {generatedDeck.cards.length} cards — click any card to flip
              </p>
            </div>
            <button
              onClick={() => router.push(`/decks/${generatedDeck._id}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Study deck →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedDeck.cards.map((card: ICard, index: number) => (
              <div
                key={card._id ?? index}
                onClick={() => toggleFlip(index)}
                className="cursor-pointer"
                style={{ perspective: "1000px", minHeight: "160px" }}
              >
                <div
                  className="relative w-full h-full transition-transform duration-500"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: flippedCards.has(index)
                      ? "rotateY(180deg)"
                      : "rotateY(0deg)",
                    minHeight: "160px",
                  }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-300 hover:shadow-sm transition-all"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <span className="text-xs text-indigo-500 font-semibold uppercase tracking-wider">
                      Question {index + 1}
                    </span>
                    <p className="text-slate-900 font-medium text-sm leading-relaxed">
                      {card.front}
                    </p>
                    <span className="text-xs text-slate-300">
                      Click to reveal →
                    </span>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 flex flex-col justify-between"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <span className="text-xs text-indigo-200 font-semibold uppercase tracking-wider">
                      Answer
                    </span>
                    <p className="text-white text-sm leading-relaxed font-medium">
                      {card.back}
                    </p>
                    <span className="text-xs text-indigo-300">
                      Click to flip back
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}