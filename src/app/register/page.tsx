"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (password !== confirm) {
      setError("Passwords do not match."); return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Registration failed."); return;
    }

    // Auto sign-in after registration
    const signInRes = await signIn("credentials", { email, password, redirect: false });
    if (signInRes?.ok) {
      router.push("/");
      router.refresh();
    } else {
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  const inputStyle = {
    fontFamily: "var(--font-mono)",
    background: "var(--bg-elevated)",
    color: "var(--text-primary)",
    border: "1px solid var(--border)",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--bg-base)" }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,255,136,0.04) 0%, transparent 70%)",
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
            // create your workspace
          </p>
        </div>

        <div className="card p-6 space-y-4" style={{ border: "1px solid var(--border)" }}>

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
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>name</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your name" required autoComplete="name"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={inputStyle}
                onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent-cyan-glow)")}
                onBlur={(e)  => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required autoComplete="email"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={inputStyle}
                onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent-cyan-glow)")}
                onBlur={(e)  => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters" required autoComplete="new-password"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={inputStyle}
                onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent-cyan-glow)")}
                onBlur={(e)  => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
              />
            </div>

            {/* Confirm */}
            <div className="space-y-1">
              <label className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>confirm password</label>
              <input
                type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••" required autoComplete="new-password"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  ...inputStyle,
                  borderColor: confirm && confirm !== password ? "var(--accent-red)" : "var(--border)",
                }}
                onFocus={(e) => {
                  if (!confirm || confirm === password)
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-cyan-glow)";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    confirm && confirm !== password ? "var(--accent-red)" : "var(--border)";
                }}
              />
              {confirm && confirm !== password && (
                <p className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--accent-red)" }}>
                  Passwords don&apos;t match
                </p>
              )}
            </div>

            {/* Strength indicator */}
            {password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((lvl) => {
                    const strength =
                      password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) ? 4
                      : password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 3
                      : password.length >= 8 ? 2
                      : 1;
                    const colors = ["var(--accent-red)", "var(--accent-amber)", "var(--accent-cyan)", "var(--accent-green)"];
                    return (
                      <div
                        key={lvl}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{
                          background: lvl <= strength ? colors[strength - 1] : "var(--border)",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error / Success */}
            {error && (
              <div
                className="text-xs px-3 py-2 rounded-md animate-fade-in"
                style={{ fontFamily: "var(--font-mono)", color: "var(--accent-red)", background: "var(--accent-red-dim)", border: "1px solid var(--accent-red)" }}
              >
                ⚠ {error}
              </div>
            )}
            {success && (
              <div
                className="text-xs px-3 py-2 rounded-md animate-fade-in"
                style={{ fontFamily: "var(--font-mono)", color: "var(--accent-green)", background: "var(--accent-green-dim)", border: "1px solid var(--accent-green)" }}
              >
                ✓ {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (!!confirm && confirm !== password)}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                fontFamily: "var(--font-mono)",
                background: loading ? "var(--bg-elevated)" : "var(--accent-cyan-dim)",
                color: loading ? "var(--text-muted)" : "var(--accent-cyan)",
                border: loading ? "1px solid var(--border)" : "1px solid var(--accent-cyan-glow)",
                boxShadow: loading ? "none" : "0 0 16px var(--accent-cyan-glow)",
              }}
            >
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-4" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--accent-cyan)" }} className="hover:underline">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
