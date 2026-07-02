"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { authedFetch } from "@/lib/authedFetch";
import Navbar from "@/sections/navbar";
import Footer from "@/sections/footer";
import SunMark from "@/components/SunMark";
import {
  useJobApplicationStore,
  useAutoRefreshApplications,
  scheduleInterview,
  type JobApplication,
} from "@/store/jobApplicationStore";
import {
  CalendarClock,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  ChevronRight,
  MapPin,
  Phone,
  Video,
  Building2,
  X as XIcon,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const INTERVIEW_TYPES: { value: string; label: string; icon: typeof Phone }[] = [
  { value: "video", label: "Video", icon: Video },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "onsite", label: "Onsite", icon: MapPin },
];

const typeIcon = (type?: string | null) =>
  INTERVIEW_TYPES.find((t) => t.value === type)?.icon ?? CalendarClock;

const typeLabel = (type?: string | null) =>
  INTERVIEW_TYPES.find((t) => t.value === type)?.label ?? "Interview";

const inputClass =
  "w-full rounded-xl border border-line bg-paper py-3 px-4 text-sm font-medium text-ink placeholder-ink-faint transition-colors hover:border-ink-faint focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/15 disabled:opacity-60";

// datetime-local wants "YYYY-MM-DDTHH:mm" in the browser's local time, with no
// timezone suffix — build/parse it by hand rather than slicing an ISO string.
const toDatetimeLocalValue = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export default function InterviewsPage() {
  const { user, loading: authLoading } = useAuth();
  const { applications, loading, error: fetchError } = useJobApplicationStore();

  useAutoRefreshApplications(!authLoading && !!user);

  const [hasCalendarScope, setHasCalendarScope] = useState<boolean | null>(null);
  const [connectLoading, setConnectLoading] = useState(false);

  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [selectedAppId, setSelectedAppId] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formType, setFormType] = useState("video");
  const [formLocation, setFormLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [showPast, setShowPast] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;

    (async () => {
      try {
        const response = await authedFetch(`${API_BASE_URL}/auth/gmail/status`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        setHasCalendarScope(Boolean(data.hasCalendarScope));
      } catch {
        setHasCalendarScope(false);
      }
    })();
  }, [authLoading, user]);

  const unscheduledApps = applications.filter((a) => !a.InterviewDate);
  const scheduledApps = applications.filter((a) => a.InterviewDate);
  const now = Date.now();
  const upcoming = scheduledApps
    .filter((a) => new Date(a.InterviewDate!).getTime() >= now)
    .sort(
      (a, b) =>
        new Date(a.InterviewDate!).getTime() - new Date(b.InterviewDate!).getTime()
    );
  const past = scheduledApps
    .filter((a) => new Date(a.InterviewDate!).getTime() < now)
    .sort(
      (a, b) =>
        new Date(b.InterviewDate!).getTime() - new Date(a.InterviewDate!).getTime()
    );

  const resetForm = () => {
    setEditingApp(null);
    setSelectedAppId("");
    setFormDate("");
    setFormType("video");
    setFormLocation("");
    setFormError(null);
  };

  const startEdit = (app: JobApplication) => {
    setEditingApp(app);
    setSelectedAppId(app.Id);
    setFormDate(app.InterviewDate ? toDatetimeLocalValue(app.InterviewDate) : "");
    setFormType(app.InterviewType || "video");
    setFormLocation(app.InterviewLocation || "");
    setFormError(null);
  };

  const handleConnect = async () => {
    try {
      setConnectLoading(true);
      const response = await authedFetch(`${API_BASE_URL}/auth/gmail/connect`);
      if (!response.ok) throw new Error();
      const { authUrl } = await response.json();
      window.location.href = authUrl;
    } catch {
      setFormError("Failed to start the Google Calendar connection.");
      setConnectLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const targetApp =
      editingApp ?? applications.find((a) => a.Id === selectedAppId);

    if (!targetApp) {
      setFormError("Choose an application to schedule.");
      return;
    }
    if (!formDate) {
      setFormError("Pick a date and time.");
      return;
    }

    try {
      setSaving(true);
      await scheduleInterview(targetApp, {
        InterviewDate: new Date(formDate).toISOString(),
        InterviewType: formType,
        InterviewLocation: formLocation.trim() || null,
      });
      setSuccess(editingApp ? "Interview updated." : "Interview scheduled.");
      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to save the interview."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async (app: JobApplication) => {
    if (
      !confirm(
        "Remove this interview? Its synced calendar event will be deleted too."
      )
    ) {
      return;
    }

    try {
      setActioningId(app.Id);
      await scheduleInterview(app, {
        InterviewDate: null,
        InterviewType: null,
        InterviewLocation: null,
      });
      if (editingApp?.Id === app.Id) resetForm();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to remove the interview."
      );
    } finally {
      setActioningId(null);
    }
  };

  if (authLoading) {
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
              Loading your interviews...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center bg-paper p-6">
          <div className="w-full max-w-md rounded-2xl border border-line bg-card p-8 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-clay-wash">
              <AlertCircle className="h-7 w-7 text-clay" strokeWidth={1.75} />
            </div>
            <h3 className="mb-2 font-display text-2xl text-ink">
              Please sign in.
            </h3>
            <p className="text-ink-soft">
              Sign in to schedule and track your upcoming interviews.
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
        <div className="mx-auto max-w-5xl px-4 pt-12 pb-20 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 border-b border-line pb-8">
            <div className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              <span>Dashboard</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-clay">Interviews</span>
            </div>
            <h1 className="font-display text-4xl tracking-[-0.01em] text-ink sm:text-5xl">
              Interviews.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Schedule interviews and watch what&apos;s coming up next — synced
              quietly to your calendar.
            </p>
          </div>

          {/* Toasts */}
          {success && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-moss/30 bg-moss/10 p-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-moss" strokeWidth={2} />
              <p className="text-sm font-semibold text-moss">{success}</p>
              <button
                onClick={() => setSuccess(null)}
                className="ml-auto text-moss/70 transition-colors hover:text-moss"
                aria-label="Dismiss"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          )}

          {(formError || fetchError) && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose/30 bg-rose/10 p-4">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose" strokeWidth={2} />
              <p className="text-sm font-semibold text-rose">
                {formError || fetchError}
              </p>
              <button
                onClick={() => setFormError(null)}
                className="ml-auto text-rose/70 transition-colors hover:text-rose"
                aria-label="Dismiss"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Calendar connect banner */}
          {hasCalendarScope === false && (
            <div className="mb-8 flex flex-col items-start gap-4 rounded-2xl border border-marigold/30 bg-marigold/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <CalendarClock
                  className="mt-0.5 h-5 w-5 shrink-0 text-marigold"
                  strokeWidth={1.75}
                />
                <div>
                  <p className="font-semibold text-ink">
                    Google Calendar isn&apos;t connected yet.
                  </p>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    Interviews still save here either way — connect to also add
                    them to your calendar. You&apos;ll be sent to Google, then
                    back to Settings.
                  </p>
                </div>
              </div>
              <button
                onClick={handleConnect}
                disabled={connectLoading}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-clay disabled:cursor-not-allowed disabled:opacity-50"
              >
                {connectLoading ? "Connecting..." : "Connect Calendar"}
              </button>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
            {/* Schedule / edit form */}
            <div className="h-fit rounded-2xl border border-line bg-card p-6 lg:sticky lg:top-24">
              <div className="mb-5 flex items-center justify-between gap-3 border-b border-dashed border-line pb-4">
                <div className="flex items-center gap-2.5">
                  <CalendarPlus className="h-4 w-4 text-clay" strokeWidth={2} />
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                    {editingApp ? "Reschedule" : "Schedule"}
                  </span>
                </div>
                {editingApp && (
                  <button
                    onClick={resetForm}
                    className="grid h-7 w-7 place-items-center rounded-full text-ink-soft transition-colors hover:bg-paper hover:text-ink"
                    aria-label="Cancel edit"
                    title="Cancel edit"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {editingApp ? (
                  <div className="rounded-xl border border-line bg-paper p-4">
                    <p className="font-display text-lg text-ink">
                      {editingApp.jobTitle}
                    </p>
                    <p className="text-sm text-ink-soft">{editingApp.company}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                      Application
                    </label>
                    <select
                      value={selectedAppId}
                      onChange={(e) => setSelectedAppId(e.target.value)}
                      className={`${inputClass} cursor-pointer`}
                      disabled={saving}
                    >
                      <option value="">
                        {unscheduledApps.length === 0
                          ? "No applications available"
                          : "Choose an application..."}
                      </option>
                      {unscheduledApps.map((app) => (
                        <option key={app.Id} value={app.Id}>
                          {app.jobTitle} — {app.company}
                        </option>
                      ))}
                    </select>
                    {applications.length === 0 && (
                      <p className="text-xs text-ink-faint">
                        No applications yet — file one from the dashboard first.
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                    Date &amp; time
                  </label>
                  <input
                    type="datetime-local"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className={inputClass}
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                    Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {INTERVIEW_TYPES.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormType(value)}
                        disabled={saving}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-semibold transition-colors ${
                          formType === value
                            ? "border-clay bg-clay-wash text-clay"
                            : "border-line text-ink-soft hover:border-ink-faint"
                        }`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                    Location{" "}
                    <span className="normal-case tracking-normal text-ink-faint">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Meeting link or address"
                    className={inputClass}
                    disabled={saving}
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-clay px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-clay-deep disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
                      Saving...
                    </>
                  ) : editingApp ? (
                    "Save changes"
                  ) : (
                    "Schedule interview"
                  )}
                </button>
              </form>
            </div>

            {/* Upcoming / past */}
            <div className="space-y-8">
              <section>
                <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                  Upcoming ({upcoming.length})
                </h2>

                {loading && applications.length === 0 ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-line bg-card p-6 text-sm text-ink-soft">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-dashed border-clay" />
                    Loading interviews...
                  </div>
                ) : upcoming.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-line bg-card p-8 text-center">
                    <SunMark className="mx-auto mb-4 h-8 w-8 text-clay" />
                    <p className="text-ink-soft">
                      Nothing on the calendar yet — schedule one from the panel.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {upcoming.map((app) => (
                      <InterviewRow
                        key={app.Id}
                        app={app}
                        hasCalendarScope={hasCalendarScope}
                        actioning={actioningId === app.Id}
                        onEdit={() => startEdit(app)}
                        onClear={() => handleClear(app)}
                      />
                    ))}
                  </ul>
                )}
              </section>

              {past.length > 0 && (
                <section>
                  <button
                    onClick={() => setShowPast((v) => !v)}
                    className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft transition-colors hover:text-clay"
                  >
                    <ChevronRight
                      className={`h-3.5 w-3.5 transition-transform ${
                        showPast ? "rotate-90" : ""
                      }`}
                    />
                    Past ({past.length})
                  </button>

                  {showPast && (
                    <ul className="space-y-3">
                      {past.map((app) => (
                        <InterviewRow
                          key={app.Id}
                          app={app}
                          hasCalendarScope={hasCalendarScope}
                          actioning={actioningId === app.Id}
                          onEdit={() => startEdit(app)}
                          onClear={() => handleClear(app)}
                          muted
                        />
                      ))}
                    </ul>
                  )}
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function InterviewRow({
  app,
  hasCalendarScope,
  actioning,
  onEdit,
  onClear,
  muted = false,
}: {
  app: JobApplication;
  hasCalendarScope: boolean | null;
  actioning: boolean;
  onEdit: () => void;
  onClear: () => void;
  muted?: boolean;
}) {
  const Icon = typeIcon(app.InterviewType);

  return (
    <li
      className={`flex flex-col gap-4 rounded-2xl border border-line bg-card p-5 sm:flex-row sm:items-center sm:justify-between ${
        muted ? "opacity-70" : ""
      }`}
    >
      <div className="flex min-w-0 items-start gap-3.5">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-clay-wash text-clay">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-lg text-ink">
            {app.jobTitle}
          </p>
          <p className="flex items-center gap-1.5 text-sm text-ink-soft">
            <Building2 className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            <span className="truncate">{app.company}</span>
          </p>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            {formatDateTime(app.InterviewDate!)} · {typeLabel(app.InterviewType)}
          </p>
          {app.InterviewLocation && (
            <p className="mt-1 truncate text-xs text-ink-soft">
              {app.InterviewLocation}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
        {hasCalendarScope && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] ${
              app.CalendarEventId
                ? "border-moss/40 bg-moss/10 text-moss"
                : "border-line bg-paper text-ink-faint"
            }`}
            title={
              app.CalendarEventId
                ? "Synced to Google Calendar"
                : "Not yet synced to Calendar"
            }
          >
            {app.CalendarEventId ? (
              <CalendarCheck className="h-3 w-3" />
            ) : (
              <CalendarX className="h-3 w-3" />
            )}
            {app.CalendarEventId ? "Synced" : "Not synced"}
          </span>
        )}
        <button
          onClick={onEdit}
          disabled={actioning}
          className="rounded-full border border-line px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-clay/50 hover:text-clay disabled:cursor-not-allowed disabled:opacity-50"
        >
          Edit
        </button>
        <button
          onClick={onClear}
          disabled={actioning}
          className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition-colors hover:bg-rose/10 hover:text-rose disabled:cursor-not-allowed disabled:opacity-50"
          title="Remove interview"
          aria-label="Remove interview"
        >
          {actioning ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose/40 border-t-rose" />
          ) : (
            <XIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </li>
  );
}
