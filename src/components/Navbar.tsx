"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import Image from "next/image";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  session: Session | null;
}

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: "⬡" },
  { id: "kanban",    label: "Kanban",    icon: "⊞" },
  { id: "notes",     label: "Notes",     icon: "⌘" },
];

export default function Navbar({ activeTab, setActiveTab, session }: NavbarProps) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
      setDate(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-md text-xs font-bold"
              style={{ background: "var(--accent-cyan-dim)", color: "var(--accent-cyan)", border: "1px solid var(--accent-cyan-glow)", fontFamily: "var(--font-mono)" }}
            >
              DB
            </div>
            <span className="text-sm font-bold tracking-widest uppercase hidden sm:block" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "0.15em" }}>
              DevBoard
            </span>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2 text-xs rounded-md transition-all duration-200"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: activeTab === tab.id ? "var(--accent-cyan-dim)" : "transparent",
                  color: activeTab === tab.id ? "var(--accent-cyan)" : "var(--text-secondary)",
                  border: activeTab === tab.id ? "1px solid var(--accent-cyan-glow)" : "1px solid transparent",
                  fontWeight: activeTab === tab.id ? "600" : "400",
                }}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Clock */}
            <div className="hidden md:flex items-center gap-2 text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
              <span style={{ color: "var(--text-secondary)" }}>{date}</span>
              <span className="font-semibold" style={{ color: "var(--accent-cyan)", minWidth: "70px", display: "inline-block" }}>{time}</span>
            </div>

            {/* Status dot */}
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-green)", boxShadow: "0 0 6px var(--accent-green)" }} />
            </div>

            {/* User menu */}
            {session?.user && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all"
                  style={{ background: menuOpen ? "var(--bg-elevated)" : "transparent", border: "1px solid transparent" }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
                  onMouseLeave={(e) => { if (!menuOpen) (e.currentTarget as HTMLElement).style.borderColor = "transparent"; }}
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? "User"}
                      width={26}
                      height={26}
                      className="rounded-full"
                    />
                  ) : (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: "var(--accent-cyan-dim)", color: "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}
                    >
                      {session.user.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  )}
                  <span className="text-xs hidden sm:inline max-w-24 truncate" style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                    {session.user.name}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>▾</span>
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 w-52 rounded-lg py-1 z-50 animate-fade-in"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
                  >
                    <div className="px-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                      <p className="text-xs font-semibold truncate" style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
                        {session.user.name}
                      </p>
                      <p className="text-xs truncate" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                        {session.user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full text-left px-3 py-2 text-xs transition-colors"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--accent-red)" }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "var(--accent-red-dim)"}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
                    >
                      Sign out →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
