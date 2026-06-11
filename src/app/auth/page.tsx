"use client";

import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import SunMark from "@/components/SunMark";

const inputClass =
  "w-full rounded-xl border border-line bg-card px-4 py-3.5 text-sm font-medium text-ink placeholder-ink-faint transition-colors hover:border-ink-faint focus:border-clay focus:outline-none";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

// Espresso brand rail shown on large screens
function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col">
      {/* sunrise arcs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center"
      >
        <svg width="720" height="420" viewBox="0 0 720 420" fill="none">
          {[400, 320, 240, 165].map((r, i) => (
            <circle
              key={r}
              cx="360"
              cy="500"
              r={r}
              stroke="var(--clay)"
              strokeOpacity={0.18 + i * 0.06}
              strokeWidth="1.5"
            />
          ))}
          <circle cx="360" cy="500" r="100" fill="var(--clay)" fillOpacity="0.25" />
        </svg>
      </div>

      <div className="relative flex h-full flex-col p-12">
        <Link href="/" className="group inline-flex items-center gap-3">
          <SunMark className="h-8 w-8 text-clay transition-transform duration-500 group-hover:-translate-y-0.5" />
          <span className="font-display text-2xl tracking-tight text-paper">
            Job <span className="italic">Trackr</span>
          </span>
        </Link>

        <div className="mt-auto mb-16 max-w-md">
          <h2 className="font-display text-4xl leading-[1.1] text-paper xl:text-5xl">
            A warmer way to mind the <em className="text-clay-wash">job hunt</em>.
          </h2>
          <p className="mt-6 leading-relaxed text-paper/60">
            Your inbox already knows where you stand. Job Trackr just keeps the
            ledger — quietly, honestly, for free.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40">
            <span>Free forever</span>
            <span>Read-only Gmail</span>
            <span>No credit card</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const { setAuth, clearAuth } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Update Zustand store
        setAuth(user.uid, user.email);

        // Redirect to dashboard or home
        router.push("/dashboard");
      } else {
        // User is signed out
        clearAuth();
      }
    });

    return () => unsubscribe();
  }, [setAuth, clearAuth, router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isLogin && password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // Auth state observer will handle the rest
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      // Auth state observer will handle the rest
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (showResetPassword) {
    return (
      <div className="grid min-h-screen bg-paper lg:grid-cols-2">
        <BrandPanel />

        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-10 inline-flex items-center gap-2.5 lg:hidden">
              <SunMark className="h-7 w-7 text-clay" />
              <span className="font-display text-xl tracking-tight text-ink">
                Job <span className="italic">Trackr</span>
              </span>
            </Link>

            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              Account recovery
            </span>
            <h1 className="mt-3 mb-3 font-display text-4xl tracking-[-0.01em] text-ink">
              Reset your password.
            </h1>
            <p className="mb-8 leading-relaxed text-ink-soft">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>

            {resetSent ? (
              <div className="rounded-2xl border border-moss/30 bg-moss/10 p-4">
                <p className="text-sm font-semibold text-moss">
                  Password reset email sent! Check your inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                {error && (
                  <div className="rounded-2xl border border-rose/30 bg-rose/10 p-4">
                    <p className="text-sm font-semibold text-rose">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="reset-email"
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft"
                  >
                    Email address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-clay py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-clay-deep disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setShowResetPassword(false);
                setResetSent(false);
                setError("");
              }}
              className="mt-6 w-full text-center text-sm font-semibold text-clay transition-colors hover:text-clay-deep"
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-2">
      <BrandPanel />

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex items-center gap-2.5 lg:hidden">
            <SunMark className="h-7 w-7 text-clay" />
            <span className="font-display text-xl tracking-tight text-ink">
              Job <span className="italic">Trackr</span>
            </span>
          </Link>

          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
            {isLogin ? "Welcome back" : "New ledger"}
          </span>
          <h1 className="mt-3 mb-8 font-display text-4xl tracking-[-0.01em] text-ink">
            {isLogin ? (
              <>
                Pick up where you <em className="text-clay">left off</em>.
              </>
            ) : (
              <>
                Start your <em className="text-clay">ledger</em>.
              </>
            )}
          </h1>

          {error && (
            <div className="mb-6 rounded-2xl border border-rose/30 bg-rose/10 p-4">
              <p className="text-sm font-semibold text-rose">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="Email address"
            />
            <div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className={inputClass}
                placeholder={isLogin ? "Password" : "Choose a password"}
              />
              {!isLogin && (
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                  At least 6 characters
                </p>
              )}
            </div>
            {!isLogin && (
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className={inputClass}
                placeholder="Re-enter password"
              />
            )}

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetPassword(true);
                    setError("");
                  }}
                  className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint transition-colors hover:text-clay"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-clay py-3.5 text-sm font-semibold text-paper shadow-[0_12px_24px_-12px_rgba(184,69,31,0.6)] transition-colors hover:bg-clay-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Please wait..." : isLogin ? "Continue" : "Sign up"}
            </button>

            <p className="pt-2 text-center text-sm text-ink-soft">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setConfirmPassword("");
                }}
                className="font-semibold text-clay transition-colors hover:text-clay-deep"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="flex-1 border-t border-dashed border-line" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              or
            </span>
            <div className="flex-1 border-t border-dashed border-line" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-line bg-card py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink-faint disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
