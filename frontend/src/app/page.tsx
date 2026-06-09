import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">F</span>
          </div>
          <span className="text-xl font-bold text-slate-900">FlashAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
          Powered by Groq AI
        </div>
        <h1 className="text-6xl font-extrabold text-slate-900 leading-tight mb-6">
          Turn any text into
          <span className="text-indigo-600"> smart flashcards</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Paste your notes, textbook pages, or any content — FlashAI generates
          study-ready flashcards in seconds. Study smarter, retain more.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-indigo-200"
          >
            Start for free →
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-4 rounded-xl text-lg border border-slate-200 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "⚡",
              color: "bg-amber-50 border-amber-200",
              iconBg: "bg-amber-100",
              title: "Instant generation",
              desc: "Paste any text and get flashcards in under 3 seconds.",
            },
            {
              icon: "🧠",
              color: "bg-indigo-50 border-indigo-200",
              iconBg: "bg-indigo-100",
              title: "Smart questions",
              desc: "AI crafts questions that test real understanding, not just recall.",
            },
            {
              icon: "📊",
              color: "bg-violet-50 border-violet-200",
              iconBg: "bg-violet-100",
              title: "Track progress",
              desc: "See your study sessions, decks created, and cards mastered.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className={`${f.color} border rounded-2xl p-6`}
            >
              <div className={`${f.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}