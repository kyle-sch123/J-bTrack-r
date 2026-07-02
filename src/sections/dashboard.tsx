"use client";

import React, { useEffect, useMemo, useReducer } from "react";
import { Calendar, Clock, XCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import StatusBadge from "@/components/statusBadge";
import SunMark from "@/components/SunMark";
import {
  useJobApplicationStore,
  useAutoRefreshApplications,
  type JobApplication,
} from "@/store/jobApplicationStore";

interface DashboardMetrics {
  totalApplications: number;
  statusCounts: Record<string, number>;
  recentApplications: JobApplication[];
  applicationsThisWeek: number;
  applicationsThisMonth: number;
  averageResponseTime: number;
}

// Warm status hues for the overview bars
const statusTone = (status: string): { dot: string; bar: string } => {
  switch (status.toLowerCase()) {
    case "applied":
      return { dot: "text-dusk", bar: "bg-dusk" };
    case "interview scheduled":
      return { dot: "text-marigold", bar: "bg-marigold" };
    case "interview completed":
      return { dot: "text-sage", bar: "bg-sage" };
    case "accepted":
    case "offer":
      return { dot: "text-moss", bar: "bg-moss" };
    case "rejected":
      return { dot: "text-rose", bar: "bg-rose" };
    default:
      return { dot: "text-ink-faint", bar: "bg-ink-faint" };
  }
};

const calculateMetrics = (
  jobApplications: JobApplication[]
): DashboardMetrics => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Use camelCase field names
  const statusCounts = jobApplications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const applicationsThisWeek = jobApplications.filter(
    (app) => new Date(app.applicationDate) >= oneWeekAgo
  ).length;

  const applicationsThisMonth = jobApplications.filter(
    (app) => new Date(app.applicationDate) >= oneMonthAgo
  ).length;

  const recentApplications = [...jobApplications]
    .sort(
      (a, b) =>
        new Date(b.applicationDate).getTime() -
        new Date(a.applicationDate).getTime()
    )
    .slice(0, 2);

  // Calculate average response time (simplified - days since application)
  const averageResponseTime =
    jobApplications.length > 0
      ? Math.round(
          jobApplications.reduce((sum, app) => {
            const daysSinceApplication =
              (now.getTime() - new Date(app.applicationDate).getTime()) /
              (1000 * 60 * 60 * 24);
            return sum + daysSinceApplication;
          }, 0) / jobApplications.length
        )
      : 0;

  return {
    totalApplications: jobApplications.length,
    statusCounts,
    recentApplications,
    applicationsThisWeek,
    applicationsThisMonth,
    averageResponseTime,
  };
};

// Main Dashboard Component
const JobApplicationDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  // Shared store: a create/update/delete in the entry list refreshes this list
  // too, so the dashboard reflects new applications without a page reload.
  const { applications, loading, error, fetchApplications, lastUpdated } =
    useJobApplicationStore();

  useEffect(() => {
    // Wait for auth to be ready and user to exist
    if (!authLoading && user) {
      fetchApplications();
    }
  }, [authLoading, user]);

  // Keep the ledger current without a manual refresh — polls in the
  // background and refetches immediately when this tab regains focus.
  useAutoRefreshApplications(!authLoading && !!user);

  // Ticks the "synced Xm ago" label forward between polls, since a fetch
  // succeeding is the only other thing that would otherwise trigger a render.
  const [, forceTick] = useReducer((n: number) => n + 1, 0);
  useEffect(() => {
    const id = setInterval(forceTick, 15_000);
    return () => clearInterval(id);
  }, []);

  const metrics = useMemo(() => calculateMetrics(applications), [applications]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const syncedLabel = (() => {
    if (!lastUpdated) return null;
    const seconds = Math.max(0, Math.round((Date.now() - lastUpdated) / 1000));
    if (seconds < 10) return "Synced just now";
    if (seconds < 60) return `Synced ${seconds}s ago`;
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `Synced ${minutes}m ago`;
    const hours = Math.round(minutes / 60);
    return `Synced ${hours}h ago`;
  })();

  // Only blank the screen on the very first load; background refetches (e.g.
  // after filing an entry) keep the existing ledger visible.
  if (loading && applications.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-paper">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <span className="block h-16 w-16 animate-spin rounded-full border-2 border-dashed border-clay [animation-duration:2.5s]" />
            <SunMark className="absolute top-1/2 left-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-clay" />
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
            Opening your ledger...
          </p>
        </div>
      </div>
    );
  }

  if (error && applications.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-paper p-6">
        <div className="w-full max-w-md rounded-2xl border border-rose/30 bg-card p-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-rose/10">
            <XCircle className="h-7 w-7 text-rose" strokeWidth={1.75} />
          </div>
          <h3 className="mb-2 font-display text-2xl text-ink">
            Something went sideways.
          </h3>
          <p className="mb-6 text-ink-soft">{error}</p>
          <button
            onClick={fetchApplications}
            className="rounded-full bg-clay px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-clay-deep"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      label: "Total applications",
      tag: "All time",
      value: metrics.totalApplications,
      sub: null,
      dot: "bg-clay",
    },
    {
      label: "This week",
      tag: "7 days",
      value: metrics.applicationsThisWeek,
      sub: `${metrics.applicationsThisMonth} this month`,
      dot: "bg-marigold",
    },
    {
      label: "Response rate",
      tag: "Ratio",
      value:
        metrics.totalApplications === 0
          ? "—"
          : `${Math.round(
              (((metrics.statusCounts["Interview Scheduled"] || 0) +
                (metrics.statusCounts["Accepted"] || 0)) /
                metrics.totalApplications) *
                100
            )}%`,
      sub: null,
      dot: "bg-moss",
    },
    {
      label: "Days pending",
      tag: "Average",
      value: metrics.averageResponseTime,
      sub: null,
      dot: "bg-dusk",
    },
  ];

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <SunMark className="h-5 w-5 text-clay" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                Your ledger
              </span>
            </div>
            <h1 className="font-display text-4xl tracking-[-0.01em] text-ink lg:text-5xl">
              The hunt, <em className="text-clay">at a glance</em>.
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="mt-1.5 flex items-center justify-end gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint/80">
                <span className="relative flex h-1.5 w-1.5">
                  {!loading && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moss/60" />
                  )}
                  <span
                    className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                      loading ? "bg-marigold" : "bg-moss"
                    }`}
                  />
                </span>
                {loading ? "Syncing..." : syncedLabel ?? "Awaiting first sync"}
              </span>
            </div>

            <button
              onClick={fetchApplications}
              disabled={loading}
              title="Refresh the ledger"
              aria-label="Refresh the ledger"
              className="group grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-card text-ink-soft transition-colors duration-300 hover:border-clay/50 hover:text-clay disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  loading
                    ? "animate-spin"
                    : "transition-transform duration-500 group-hover:rotate-180"
                }`}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-line bg-card p-6 transition-colors duration-300 hover:border-clay/40"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                  <span className={`block h-1.5 w-1.5 rounded-full ${card.dot}`} />
                  {card.label}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">
                  {card.tag}
                </span>
              </div>
              <p className="font-display text-5xl text-ink">{card.value}</p>
              {card.sub && (
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                  {card.sub}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Status overview & recent applications */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Status overview */}
          <div className="rounded-2xl border border-line bg-card p-6 lg:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-dashed border-line pb-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                Status mix
              </span>
              <Clock className="h-4 w-4 text-ink-faint" strokeWidth={1.75} />
            </div>

            <div className="space-y-6">
              {Object.entries(metrics.statusCounts).map(([status, count]) => {
                const percentage = Math.round(
                  (count / metrics.totalApplications) * 100
                );
                const tone = statusTone(status);

                return (
                  <div key={status}>
                    <div className="mb-2 flex items-baseline justify-between gap-4">
                      <span
                        className={`flex items-center gap-2.5 text-sm font-semibold text-ink`}
                      >
                        <span className={tone.dot}>
                          <span className="block h-2 w-2 rounded-full bg-current" />
                        </span>
                        {status}
                      </span>
                      <span className="font-mono text-xs text-ink-soft">
                        {count} · {percentage}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${tone.bar}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent applications */}
          <div className="rounded-2xl border border-line bg-card p-6 lg:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-dashed border-line pb-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                Latest entries
              </span>
              <Calendar className="h-4 w-4 text-ink-faint" strokeWidth={1.75} />
            </div>

            {metrics.recentApplications.length === 0 ? (
              <p className="text-sm leading-relaxed text-ink-soft">
                No entries yet — your first application will appear here.
              </p>
            ) : (
              <div className="space-y-5">
                {metrics.recentApplications.map((app) => (
                  <div
                    key={app.Id}
                    className="rounded-xl border border-line bg-paper p-5 transition-colors duration-300 hover:border-clay/40"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="truncate font-display text-xl text-ink">
                          {app.jobTitle}
                        </h4>
                        <p className="text-sm text-ink-soft">{app.company}</p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                      Filed {formatDate(app.applicationDate)}
                    </p>
                    {app.notes && (
                      <p className="mt-3 border-l-2 border-clay/40 pl-3 text-sm text-ink-soft italic">
                        {app.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationDashboard;
