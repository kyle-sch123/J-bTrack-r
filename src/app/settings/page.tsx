"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authedFetch } from "@/lib/authedFetch";
import Navbar from "@/sections/navbar";
import Footer from "@/sections/footer";

interface GmailStatusResponse {
  connected: boolean;
  email?: string;
  connectedAt?: string;
  lastSyncAt?: string;
  lastSyncStatus?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SettingsPage() {
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

      const token = await user?.getIdToken();

      const response = await fetch(`${API_BASE_URL}/auth/gmail/status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to get Gmail status");

      const data = await response.json();
      setStatus(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Connect Gmail — gets the redirect URL from API
  const handleConnect = async () => {
    try {
      setActionLoading(true);
      setError(null);

      const token = await user?.getIdToken();

      const response = await authedFetch(`${API_BASE_URL}/auth/gmail/connect`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to initiate Gmail connection");

      const { authUrl } = await response.json();

      window.location.href = authUrl; // Redirect to Google OAuth screen
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Disconnect Gmail
  const handleDisconnect = async () => {
    try {
      setActionLoading(true);
      setError(null);

      const token = await user?.getIdToken();

      const response = await fetch(`${API_BASE_URL}/auth/gmail/disconnect`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to disconnect Gmail");

      await fetchStatus();
      setSuccessMsg("Your Gmail account was disconnected.");
    } catch (err: any) {
      setError(err.message);
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
    return <p className="p-6">Loading settings...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>

        {successMsg && (
          <p className="mb-4 text-green-600 font-medium">{successMsg}</p>
        )}
        {error && <p className="mb-4 text-red-600 font-medium">{error}</p>}

        {/* Gmail Connection Card */}
        <div className="border rounded-lg p-6 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-3">Gmail Integration</h2>

          {!status?.connected ? (
            <>
              <p className="mb-4 text-gray-700">
                Connect your Gmail account to automatically sync job application
                confirmation emails.
              </p>
              <button
                onClick={handleConnect}
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {actionLoading ? "Connecting..." : "Connect Gmail"}
              </button>
            </>
          ) : (
            <>
              <p className="mb-2">
                <span className="font-medium">Connected Email:</span>{" "}
                {status.email}
              </p>
              <p className="mb-2">
                <span className="font-medium">Connected At:</span>{" "}
                {new Date(status.connectedAt!).toLocaleString()}
              </p>
              <p className="mb-4">
                <span className="font-medium">Last Sync:</span>{" "}
                {status.lastSyncAt
                  ? new Date(status.lastSyncAt).toLocaleString()
                  : "Never"}
              </p>

              <button
                onClick={handleDisconnect}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? "Disconnecting..." : "Disconnect Gmail"}
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
