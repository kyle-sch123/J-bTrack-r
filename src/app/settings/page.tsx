"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authedFetch } from "@/lib/authedFetch";
import Navbar from "@/sections/navbar";
import Footer from "@/sections/footer";
import SunMark from "@/components/SunMark";
import {
  Mail,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Shield,
  Clock,
  Unplug,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

interface GmailStatusResponse {
  connected: boolean;
  email?: string;
  connectedAt?: string;
  lastSyncAt?: string;
  lastSyncStatus?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// useSearchParams() must live under a Suspense boundary or Next.js fails the
// production build when prerendering this page.
export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsPageContent />
    </Suspense>
  );
}

function SettingsPageContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<GmailStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handle Gmail callback messages
  useEffect(() => {
    const gmailStatus = searchParams.get("gmail");

    if (gmailStatus === "connected") {
      setSuccessMsg("Your Gmail account has been successfully connected.");
    } else if (gmailStatus === "error") {
      setError("Failed to connect Gmail. Please try again.");
    }
  }, [searchParams]);

  // Fetch Gmail connection status
  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authedFetch(`${API_BASE_URL}/auth/gmail/status`);

      if (!response.ok) throw new Error("Failed to get Gmail status");

      const data = await response.json();
      setStatus(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Connect Gmail — gets the redirect URL from API
  const handleConnect = async () => {
    try {
      setActionLoading(true);
      setError(null);

      const response = await authedFetch(`${API_BASE_URL}/auth/gmail/connect`);

      if (!response.ok) throw new Error("Failed to initiate Gmail connection");

      const { authUrl } = await response.json();

      window.location.href = authUrl; // Redirect to Google OAuth screen
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Disconnect Gmail
  const handleDisconnect = async () => {
    try {
      setActionLoading(true);
      setError(null);

      const response = await authedFetch(`${API_BASE_URL}/auth/gmail/disconnect`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to disconnect Gmail");

      await fetchStatus();
      setSuccessMsg("Your Gmail account was disconnected.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Wait for Firebase to finish restoring user session
  useEffect(() => {
    if (!authLoading && user) {
      fetchStatus();
    }
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center bg-paper">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <span className="block h-16 w-16 animate-spin rounded-full border-2 border-dashed border-clay [animation-duration:2.5s]" />
              <SunMark className="absolute top-1/2 left-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-clay" />
            </div>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              Loading your settings...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-paper">
        {/* Header */}
        <div className="mx-auto max-w-4xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            <span>Dashboard</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-clay">Settings</span>
          </div>
          <h1 className="font-display text-4xl tracking-[-0.01em] text-ink sm:text-5xl">
            Settings.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Manage your account and integrations — quietly, like everything
            else here.
          </p>
        </div>

        {/* Main content */}
        <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
          {/* Toasts */}
          {successMsg && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-moss/30 bg-moss/10 p-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-moss" strokeWidth={2} />
              <p className="text-sm font-semibold text-moss">{successMsg}</p>
              <button
                onClick={() => setSuccessMsg(null)}
                className="ml-auto text-moss/70 transition-colors hover:text-moss"
                aria-label="Dismiss"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose/30 bg-rose/10 p-4">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose" strokeWidth={2} />
              <p className="text-sm font-semibold text-rose">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-rose/70 transition-colors hover:text-rose"
                aria-label="Dismiss"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Gmail integration card */}
          <div className="overflow-hidden rounded-2xl border border-line bg-card">
            {/* Card header */}
            <div className="border-b border-dashed border-line px-6 py-6 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-clay-wash text-clay">
                  <Mail className="h-5.5 w-5.5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-2xl text-ink">
                      Gmail integration
                    </h2>
                    {status?.connected ? (
                      <span className="inline-flex items-center gap-1.5 rounded border border-moss/40 bg-moss/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-moss">
                        <span className="block h-1.5 w-1.5 animate-pulse rounded-full bg-moss" />
                        Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded border border-line bg-ink/5 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-faint">
                        <span className="block h-1.5 w-1.5 rounded-full bg-ink-faint" />
                        Not connected
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">
                    Automatically sync job application emails from your inbox.
                  </p>
                </div>
              </div>
            </div>

            {/* Card body */}
            <div className="px-6 py-8 sm:px-8">
              {!status?.connected ? (
                /* Disconnected state */
                <div className="space-y-8">
                  {/* Benefits */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      {
                        icon: Sparkles,
                        title: "Auto-detect",
                        desc: "Find job emails automatically",
                      },
                      {
                        icon: RefreshCw,
                        title: "Stay synced",
                        desc: "Status updates as they arrive",
                      },
                      {
                        icon: Shield,
                        title: "Secure",
                        desc: "Read-only access to email",
                      },
                    ].map((b) => (
                      <div
                        key={b.title}
                        className="rounded-xl border border-line bg-paper p-4"
                      >
                        <b.icon
                          className="mb-3 h-4.5 w-4.5 text-clay"
                          strokeWidth={1.75}
                        />
                        <h4 className="text-sm font-bold text-ink">{b.title}</h4>
                        <p className="mt-0.5 text-xs text-ink-soft">{b.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Connect button */}
                  <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <button
                      onClick={handleConnect}
                      disabled={actionLoading}
                      className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-clay px-7 py-3.5 text-sm font-semibold text-paper shadow-[0_12px_24px_-12px_rgba(184,69,31,0.6)] transition-colors hover:bg-clay-deep disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      {actionLoading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4" strokeWidth={2} />
                          Connect Gmail account
                        </>
                      )}
                    </button>
                    <p className="text-center text-sm text-ink-soft sm:text-left">
                      We&apos;ll redirect you to Google to authorize access.
                    </p>
                  </div>
                </div>
              ) : (
                /* Connected state */
                <div className="space-y-6">
                  {/* Connection info */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-line bg-paper p-5">
                      <div className="mb-3 flex items-center gap-2.5">
                        <Mail className="h-4 w-4 text-ink-faint" strokeWidth={1.75} />
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                          Connected email
                        </span>
                      </div>
                      <p className="truncate font-display text-lg text-ink">
                        {status.email}
                      </p>
                    </div>

                    <div className="rounded-xl border border-line bg-paper p-5">
                      <div className="mb-3 flex items-center gap-2.5">
                        <Clock className="h-4 w-4 text-ink-faint" strokeWidth={1.75} />
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                          Connected since
                        </span>
                      </div>
                      <p className="font-display text-lg text-ink">
                        {new Date(status.connectedAt!).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Last sync */}
                  <div className="rounded-xl border border-moss/30 bg-moss/10 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <RefreshCw className="h-4.5 w-4.5 text-moss" strokeWidth={1.75} />
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                            Last sync
                          </p>
                          <p className="mt-0.5 font-display text-lg text-ink">
                            {status.lastSyncAt
                              ? new Date(status.lastSyncAt).toLocaleString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                  },
                                )
                              : "Never synced"}
                          </p>
                        </div>
                      </div>
                      {status.lastSyncStatus && (
                        <span className="inline-flex items-center gap-1.5 rounded border border-moss/40 bg-card px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-moss">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {status.lastSyncStatus}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Disconnect */}
                  <div className="border-t border-dashed border-line pt-6">
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <h4 className="font-bold text-ink">Disconnect Gmail</h4>
                        <p className="mt-0.5 text-sm text-ink-soft">
                          Remove access to your Gmail account. Your existing
                          data will be preserved.
                        </p>
                      </div>
                      <button
                        onClick={handleDisconnect}
                        disabled={actionLoading}
                        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-rose/40 px-5 py-2.5 text-sm font-semibold text-rose transition-colors hover:bg-rose/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {actionLoading ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-rose/40 border-t-rose" />
                            Disconnecting...
                          </>
                        ) : (
                          <>
                            <Unplug className="h-4 w-4" strokeWidth={1.75} />
                            Disconnect
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Placeholder for future settings */}
          <div className="mt-8 rounded-2xl border border-dashed border-line p-6">
            <div className="flex items-center gap-3 text-ink-faint">
              <SunMark className="h-4.5 w-4.5" />
              <p className="font-mono text-[11px] uppercase tracking-[0.2em]">
                More settings, in time...
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
