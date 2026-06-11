"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, XCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import StatusBadge from "@/components/statusBadge";
import SunMark from "@/components/SunMark";
import { authedFetch } from "@/lib/authedFetch";

interface JobApplication {
  Id: string; // MongoDB _id (capitalized in response)
  jobNumber: number; // camelCase to match backend
  userId: string; // camelCase to match backend
  jobTitle: string; // camelCase to match backend
  company: string; // camelCase to match backend
  status: string; // camelCase to match backend
  applicationDate: string; // camelCase to match backend
  notes: string; // camelCase to match backend
  autoStatusUpdated: boolean; // camelCase to match backend
}

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

// Main Dashboard Component
const JobApplicationDashboard: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    // Wait for auth to be ready and user to exist
    if (!authLoading && user) {
      fetchJobApplications();
    }
  }, [authLoading, user]);

  const fetchJobApplications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // The backend scopes results to the authenticated user via the JWT.
      const response = await authedFetch(`${API_BASE_URL}/jobapplications`);

      if (!response.ok) {
        throw new Error(`Failed to fetch job applications: ${response.status}`);
      }

      const data: JobApplication[] = await response.json();

      setApplications(data);
      setMetrics(calculateMetrics(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching job applications:", err);
    } finally {
      setLoading(false);
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

    const recentApplications = jobApplications
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
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

  if (error) {
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
            onClick={fetchJobApplications}
            className="rounded-full bg-clay px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-clay-deep"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

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
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
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

        {/* Refresh */}
        <div className="flex justify-center pt-2">
          <button
            onClick={fetchJobApplications}
            disabled={loading}
            className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-card px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft transition-colors duration-300 hover:border-clay/50 hover:text-clay disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                loading
                  ? "animate-spin"
                  : "transition-transform duration-500 group-hover:rotate-180"
              }`}
              strokeWidth={2}
            />
            Refresh the ledger
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationDashboard;
