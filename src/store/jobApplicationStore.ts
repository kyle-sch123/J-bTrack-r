// store/jobApplicationStore.ts
import { useEffect } from "react";
import { create } from "zustand";
import { authedFetch } from "@/lib/authedFetch";

// Shared shape for a job application. `jobNumber` is assigned by the backend,
// so it's absent on entries the client has just created.
export interface JobApplication {
  Id: string; // MongoDB _id (capitalized in response)
  jobNumber?: number;
  userId: string;
  jobTitle: string;
  company: string;
  status: string;
  applicationDate: string;
  notes: string;
  autoStatusUpdated: boolean;
  // AI-powered fields — PascalCase because the backend model added these
  // without the lowercase-first convention the base fields use above.
  InterviewDate?: string | null;
  InterviewType?: string | null;
  InterviewLocation?: string | null;
  // Set by the backend once an interview date is synced to Google Calendar;
  // null if the user hasn't granted Calendar access or there's no interview.
  CalendarEventId?: string | null;
}

interface JobApplicationState {
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
  // Timestamp (ms) of the last successful fetch — lets views show a "synced
  // Xm ago" indicator instead of a bare manual-refresh button.
  lastUpdated: number | null;
  // Re-fetches the authenticated user's applications and updates the shared
  // list. Both the dashboard and the entry list read from here, so calling
  // this after a create/update/delete refreshes every view at once.
  fetchApplications: () => Promise<void>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// The dashboard and the list both mount together and fetch on mount; share a
// single in-flight request between concurrent callers instead of firing two.
let inFlight: Promise<void> | null = null;

export const useJobApplicationStore = create<JobApplicationState>((set) => ({
  applications: [],
  loading: true,
  error: null,
  lastUpdated: null,
  fetchApplications: () => {
    if (inFlight) return inFlight;

    set({ loading: true, error: null });

    inFlight = (async () => {
      try {
        // The backend scopes results to the authenticated user via the JWT.
        const response = await authedFetch(`${API_BASE_URL}/jobapplications`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch job applications: ${response.status}`
          );
        }

        const data: JobApplication[] = await response.json();

        // Newest first — both the dashboard and the list expect this ordering.
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.applicationDate).getTime() -
            new Date(a.applicationDate).getTime()
        );

        set({ applications: sorted, loading: false, lastUpdated: Date.now() });
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : "An error occurred",
          loading: false,
        });
      } finally {
        inFlight = null;
      }
    })();

    return inFlight;
  },
}));

// Fields the Interviews page can set — everything else on the application is
// carried over unchanged via the spread in `scheduleInterview` below.
export interface InterviewFields {
  InterviewDate: string | null;
  InterviewType: string | null;
  InterviewLocation: string | null;
}

// Schedules, reschedules, or clears (InterviewDate: null) an application's
// interview. The backend syncs the change to Google Calendar (if connected)
// and returns the authoritative CalendarEventId, which fetchApplications()
// below then pulls into the shared list for every view.
export async function scheduleInterview(
  app: JobApplication,
  fields: InterviewFields
): Promise<JobApplication> {
  const payload = { ...app, ...fields };

  const response = await authedFetch(`${API_BASE_URL}/jobapplication/${app.Id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update interview details");
  }

  const updated: JobApplication = await response.json();
  await useJobApplicationStore.getState().fetchApplications();
  return updated;
}

// Background sync: the backend's email pipeline can file new entries (or the
// review queue can be approved) without any action on this page, so we can't
// rely on a manual refresh to surface them. Poll on an interval, and refetch
// immediately when the tab regains focus/visibility, so every subscribed view
// picks up changes on its own.
const POLL_INTERVAL_MS = 30_000;

let pollTimer: ReturnType<typeof setInterval> | null = null;
let activeSubscribers = 0;

const refetch = () => useJobApplicationStore.getState().fetchApplications();

function startPolling() {
  if (pollTimer) return;
  pollTimer = setInterval(refetch, POLL_INTERVAL_MS);
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

// Call from any component that renders the shared application list, gated on
// `enabled` (e.g. auth ready + user signed in). Multiple callers share a
// single interval/listener set; polling stops once the last one unmounts or
// disables.
export function useAutoRefreshApplications(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    activeSubscribers += 1;
    startPolling();

    const onVisible = () => {
      if (document.visibilityState === "visible") refetch();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      activeSubscribers -= 1;
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      if (activeSubscribers <= 0) stopPolling();
    };
  }, [enabled]);
}
