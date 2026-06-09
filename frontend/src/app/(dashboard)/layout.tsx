"use client";

import { useEffect } from "react";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user) return;
      try {
        const token = await getToken();
        await api.post(
          "/api/users/sync",
          {
            email: user.emailAddresses[0]?.emailAddress ?? "",
            username:
              user.username ??
              user.firstName ??
              user.emailAddresses[0]?.emailAddress?.split("@")[0],
            avatarUrl: user.imageUrl ?? "",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch {}
    };
    syncUser();
  }, [isLoaded, user]);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/generate", label: "Generate" },
    { href: "/decks", label: "My Decks" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-0 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">F</span>
              </div>
              <span className="text-lg font-bold text-slate-900">FlashAI</span>
            </Link>
            <nav className="hidden md:flex items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-5 text-sm font-medium border-b-2 transition-colors ${
                    pathname === link.href
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <UserButton />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}