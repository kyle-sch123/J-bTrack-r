"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authedFetch } from "@/lib/authedFetch";
import Navbar from "@/sections/navbar";
import Footer from "@/sections/footer";
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
  Loader2,
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
        <div className="min-h-screen bg-gradient-to-b from-[#fcf8f5] to-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f78433] to-[#ff6b35] animate-pulse" />
              <Loader2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
            </div>
            <p className="text-gray-500 font-medium">
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
      <div className="min-h-screen bg-gradient-to-b from-[#fcf8f5] via-white to-[#fcf8f5]">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 -left-48 w-96 h-96 bg-gradient-to-tr from-orange-100/50 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span>Dashboard</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#f78433] font-medium">Settings</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
              Settings
            </h1>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl">
              Manage your account preferences and integrations to get the most
              out of Job Trackr.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Toast Notifications */}
          {successMsg && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl animate-in slide-in-from-top-2 duration-300">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-emerald-800 font-medium">{successMsg}</p>
              <button
                onClick={() => setSuccessMsg(null)}
                className="ml-auto text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl animate-in slide-in-from-top-2 duration-300">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-red-800 font-medium">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Gmail Integration Card */}
          <div className="relative group">
            {/* Card glow effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f78433] to-[#ff6b35] rounded-3xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />

            <div className="relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Card Header */}
              <div className="relative px-6 sm:px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#f78433] to-[#ff6b35] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200/50">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Gmail Integration
                      </h2>
                      {status?.connected ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          Connected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-sm font-semibold rounded-full">
                          <span className="w-2 h-2 bg-gray-400 rounded-full" />
                          Not connected
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-gray-500">
                      Automatically sync job application emails from your inbox
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 sm:px-8 py-8">
                {!status?.connected ? (
                  /* Disconnected State */
                  <div className="space-y-8">
                    {/* Benefits Grid */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="flex items-start gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                        <div className="flex-shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <Sparkles className="w-5 h-5 text-[#f78433]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">
                            Auto-detect
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Find job emails automatically
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                        <div className="flex-shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <RefreshCw className="w-5 h-5 text-[#f78433]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">
                            Stay synced
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Real-time status updates
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                        <div className="flex-shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <Shield className="w-5 h-5 text-[#f78433]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">
                            Secure
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Read-only access to emails
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Connect Button */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <button
                        onClick={handleConnect}
                        disabled={actionLoading}
                        className="relative w-full sm:w-auto group/btn overflow-hidden px-8 py-4 bg-gradient-to-r from-[#f78433] to-[#ff6b35] text-white font-semibold rounded-2xl shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {actionLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            <>
                              <Mail className="w-5 h-5" />
                              Connect Gmail Account
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b35] to-[#f78433] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                      </button>
                      <p className="text-sm text-gray-500 text-center sm:text-left">
                        We&apos;ll redirect you to Google to authorize access
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Connected State */
                  <div className="space-y-6">
                    {/* Connection Info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <Mail className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Connected Email
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900 truncate">
                          {status.email}
                        </p>
                      </div>

                      <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <Clock className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Connected Since
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
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

                    {/* Last Sync Status */}
                    <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <RefreshCw className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Last Sync
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
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
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-emerald-700 text-sm font-medium rounded-full shadow-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            {status.lastSyncStatus}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Disconnect Section */}
                    <div className="pt-6 border-t border-gray-100">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Disconnect Gmail
                          </h4>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Remove access to your Gmail account. Your existing
                            data will be preserved.
                          </p>
                        </div>
                        <button
                          onClick={handleDisconnect}
                          disabled={actionLoading}
                          className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-red-600 font-semibold rounded-xl border-2 border-red-200 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {actionLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Disconnecting...
                            </>
                          ) : (
                            <>
                              <Unplug className="w-4 h-4" />
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
          </div>

          {/* Additional Settings Placeholder */}
          <div className="mt-8 p-6 bg-white/60 backdrop-blur rounded-2xl border border-dashed border-gray-200">
            <div className="flex items-center gap-3 text-gray-400">
              <Sparkles className="w-5 h-5" />
              <p className="text-sm font-medium">
                More settings coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
