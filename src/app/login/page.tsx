"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email, password, redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-sm relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
            style={{
              background: "var(--accent-cyan-dim)",
              border: "1px solid var(--accent-cyan-glow)",
            }}
          >
            <span
              className="text-sm font-bold"
              style={{ fontFamily: "var(--font-mono)", color: "var(--accent-cyan)" }}
            >
              DB
            </span>
          </div>
          <h1
            className="text-2xl font-extrabold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            DevBoard<span style={{ color: "var(--accent-cyan)" }}>.</span>
          </h1>
          <p
            className="text-xs mt-1"
            style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
          >
            // sign in to your workspace
          </p>
        </div>

        {/* Card */}
        <div
          className="card p-6 space-y-4"
          style={{ border: "1px solid var(--border)" }}
        >

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg text-sm transition-all duration-200"
            style={{
              fontFamily: "var(--font-mono)",
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              opacity: googleLoading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => !googleLoading && ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent-cyan-glow)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
          >
            {/* Google SVG */}
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
              or
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label
                className="text-xs"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
              >
                email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                }}
                onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent-cyan-glow)")}
                onBlur={(e)  => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
              />
            </div>

            <div className="space-y-1">
              <label
                className="text-xs"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
              >
                password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                }}
                onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent-cyan-glow)")}
                onBlur={(e)  => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="text-xs px-3 py-2 rounded-md animate-fade-in"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--accent-red)",
                  background: "var(--accent-red-dim)",
                  border: "1px solid var(--accent-red)",
                }}
              >
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                fontFamily: "var(--font-mono)",
                background: loading ? "var(--bg-elevated)" : "var(--accent-cyan-dim)",
                color: loading ? "var(--text-muted)" : "var(--accent-cyan)",
                border: loading ? "1px solid var(--border)" : "1px solid var(--accent-cyan-glow)",
                boxShadow: loading ? "none" : "0 0 16px var(--accent-cyan-glow)",
              }}
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>
        </div>

        {/* Register link */}
        <p
          className="text-center text-xs mt-4"
          style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
        >
          No account?{" "}
          <Link
            href="/register"
            style={{ color: "var(--accent-cyan)" }}
            className="hover:underline"
          >
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}
