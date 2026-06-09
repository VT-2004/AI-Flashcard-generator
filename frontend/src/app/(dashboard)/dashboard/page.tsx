"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import api from "@/lib/api";
import { IDeck } from "@/types/deck";

export default function DashboardPage() {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [decks, setDecks] = useState<IDeck[]>([]);
  const [stats, setStats] = useState({
    totalDecks: 0,
    totalCards: 0,
    totalSessions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const res = await api.get("/api/decks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedDecks: IDeck[] = res.data.data.decks;
        setDecks(fetchedDecks.slice(0, 3));
        setStats({
          totalDecks: res.data.data.total,
          totalCards: fetchedDecks.reduce((sum, d) => sum + d.cardCount, 0),
          totalSessions: fetchedDecks.reduce((sum, d) => sum + d.studySessions, 0),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {isLoaded ? user?.firstName ?? "there" : "there"} 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Here's what's happening with your study sessions.
        </p>
      </div>

      {/* CTA banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Generate new flashcards
          </h2>
          <p className="text-indigo-200 text-sm mt-1">
            Paste any text and let AI create your next study deck
          </p>
        </div>
        <Link
          href="/generate"
          className="bg-white text-indigo-600 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-colors shrink-0"
        >
          Start generating →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Decks", value: stats.totalDecks, icon: "🗂️", color: "bg-blue-50 border-blue-100" },
          { label: "Total Cards", value: stats.totalCards, icon: "🃏", color: "bg-violet-50 border-violet-100" },
          { label: "Study Sessions", value: stats.totalSessions, icon: "📚", color: "bg-amber-50 border-amber-100" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.color} border rounded-2xl p-5`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">
                {stat.label}
              </span>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className="text-4xl font-bold text-slate-900">
              {loading ? "—" : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent decks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Recent Decks
          </h2>
          <Link
            href="/decks"
            className="text-sm text-indigo-600 font-medium hover:underline"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-100 animate-pulse rounded-2xl h-32"
              />
            ))}
          </div>
        ) : decks.length === 0 ? (
          <div className="text-center bg-white border border-dashed border-slate-300 rounded-2xl py-16">
            <p className="text-4xl mb-3">🃏</p>
            <p className="text-slate-600 font-medium">No decks yet</p>
            <p className="text-slate-400 text-sm mt-1">
              Generate your first flashcard deck to get started
            </p>
            <Link
              href="/generate"
              className="inline-block mt-4 bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Generate now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {decks.map((deck) => (
              <div
                key={deck._id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-indigo-200 transition-all"
              >
                <div className="mb-3">
                  <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2">
                    {deck.title}
                  </h3>
                  <p className="text-xs text-indigo-600 font-medium mt-1">
                    {deck.topic}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <span>{deck.cardCount} cards</span>
                  <span>·</span>
                  <span>{deck.studySessions} sessions</span>
                </div>
                <Link
                  href={`/decks/${deck._id}`}
                  className="block w-full text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold py-2 rounded-lg transition-colors"
                >
                  Study →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}