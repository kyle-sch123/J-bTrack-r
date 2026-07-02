"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Filter,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Briefcase,
  Building2,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import StatusBadge from "@/components/statusBadge";
import SunMark from "@/components/SunMark";
import { authedFetch } from "@/lib/authedFetch";
import ReviewQueue from "@/components/ReviewQueue";
import {
  useJobApplicationStore,
  useAutoRefreshApplications,
  type JobApplication,
} from "@/store/jobApplicationStore";

// Type definitions
interface FormData {
  JobTitle: string;
  Company: string;
  Status: string;
  ApplicationDate: string;
  Notes: string;
}

// Status options
const STATUS_OPTIONS = [
  "Applied",
  "Interview Scheduled",
  "Interview Completed",
  "Rejected",
  "Accepted",
  "Withdrawn",
  "On Hold",
];

// Entry counts a user can page through at once.
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Stable ids per field — wire labels to inputs, errors to inputs, and let us
// focus the first invalid field on submit.
const FIELD_IDS: Record<keyof FormData, string> = {
  JobTitle: "field-job-title",
  Company: "field-company",
  Status: "field-status",
  ApplicationDate: "field-date",
  Notes: "field-notes",
};

const makeEmptyForm = (): FormData => ({
  JobTitle: "",
  Company: "",
  Status: "Applied",
  ApplicationDate: new Date().toISOString().split("T")[0],
  Notes: "",
});

const inputClass = (hasError?: boolean, hasIcon?: boolean) =>
  [
    "w-full rounded-xl border bg-paper py-3 text-sm font-medium text-ink placeholder-ink-faint transition-colors focus:outline-none focus:ring-2 disabled:opacity-60",
    hasIcon ? "pl-11 pr-4" : "px-4",
    hasError
      ? "border-rose/60 bg-rose/5 focus:border-rose focus:ring-rose/15"
      : "border-line hover:border-ink-faint focus:border-clay focus:ring-clay/15",
  ].join(" ");

// Form Modal Component
const JobApplicationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: JobApplication | null;
  loading: boolean;
}> = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [formData, setFormData] = useState<FormData>(makeEmptyForm);
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  const firstFieldRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const keepEditingRef = useRef<HTMLButtonElement>(null);
  // Snapshot of the form as it opened, used to detect unsaved changes.
  const initialRef = useRef<FormData>(makeEmptyForm());

  const isEdit = !!initialData;

  // Reset the form whenever the modal opens or the target entry changes.
  useEffect(() => {
    const next: FormData = initialData
      ? {
          JobTitle: initialData.jobTitle,
          Company: initialData.company,
          Status: initialData.status,
          ApplicationDate: initialData.applicationDate.split("T")[0],
          Notes: initialData.notes,
        }
      : makeEmptyForm();
    setFormData(next);
    initialRef.current = next;
    setTouched({});
    setSubmitted(false);
    setShowDiscardConfirm(false);
  }, [initialData, isOpen]);

  // On open: lock background scroll, animate in, focus the first field, and
  // restore focus to whatever opened the modal once it closes.
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const raf = requestAnimationFrame(() => {
      setMounted(true);
      firstFieldRef.current?.focus();
    });

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      setMounted(false);
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  // Send focus to the safe default when the discard prompt appears.
  useEffect(() => {
    if (showDiscardConfirm) keepEditingRef.current?.focus();
  }, [showDiscardConfirm]);

  const errors = useMemo<Partial<FormData>>(() => {
    const e: Partial<FormData> = {};
    if (!formData.JobTitle.trim()) e.JobTitle = "Job title is required";
    if (!formData.Company.trim()) e.Company = "Company name is required";
    if (!formData.ApplicationDate)
      e.ApplicationDate = "Application date is required";
    return e;
  }, [formData]);

  const isDirty = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(initialRef.current),
    [formData]
  );

  // Reveal a field's error only after it's been touched or a submit attempted.
  const showError = (field: keyof FormData) =>
    Boolean((touched[field] || submitted) && errors[field]);

  const handleChange = (field: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleBlur = (field: keyof FormData) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const firstInvalid = (
      ["JobTitle", "Company", "ApplicationDate"] as (keyof FormData)[]
    ).find((f) => errors[f]);

    if (firstInvalid) {
      document.getElementById(FIELD_IDS[firstInvalid])?.focus();
      return;
    }

    onSubmit(formData);
  };

  // Guard against losing edits: prompt before closing a dirty form.
  const attemptClose = () => {
    if (loading) return;
    if (isDirty) {
      setShowDiscardConfirm(true);
      return;
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (showDiscardConfirm) setShowDiscardConfirm(false);
      else attemptClose();
      return;
    }

    if (e.key !== "Tab" || !dialogRef.current) return;

    // Keep Tab focus inside the dialog.
    const focusables = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null);

    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement;

    if (
      e.shiftKey &&
      (active === first || !dialogRef.current.contains(active))
    ) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) attemptClose();
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-modal-title"
        className={`relative flex max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-card shadow-[0_48px_96px_-32px_rgba(50,38,26,0.5)] transition-all duration-200 motion-reduce:transition-none ${
          mounted
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-[0.98] opacity-0"
        }`}
      >
        {/* Decorative rail */}
        <aside className="relative hidden w-2/5 shrink-0 overflow-hidden border-r border-line bg-clay-wash md:block">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center"
          >
            <svg width="420" height="260" viewBox="0 0 420 260" fill="none">
              {[240, 190, 140, 95].map((r, i) => (
                <circle
                  key={r}
                  cx="210"
                  cy="300"
                  r={r}
                  stroke="var(--clay)"
                  strokeOpacity={0.18 + i * 0.07}
                  strokeWidth="1.5"
                />
              ))}
              <circle
                cx="210"
                cy="300"
                r="56"
                fill="var(--clay)"
                fillOpacity="0.3"
              />
            </svg>
          </div>

          <div className="relative flex h-full flex-col p-8">
            <SunMark className="h-8 w-8 text-clay" />
            <p className="mt-10 font-display text-3xl leading-snug text-ink">
              {isEdit ? (
                <>
                  Keeping the record <em className="text-clay">straight</em>.
                </>
              ) : (
                <>
                  Every entry is a <em className="text-clay">step</em> forward.
                </>
              )}
            </p>
            <p className="mt-auto font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
              {isEdit ? "Amending the ledger" : "A fresh page"}
            </p>
          </div>
        </aside>

        {/* Form pane — made inert behind the discard prompt so focus stays put */}
        <div
          className="flex min-h-0 w-full flex-col md:w-3/5"
          inert={showDiscardConfirm || undefined}
        >
          {/* Header */}
          <div className="flex shrink-0 items-start justify-between border-b border-dashed border-line p-6 pb-5">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-clay">
                {isEdit ? "Edit entry" : "New entry"}
              </span>
              <h2
                id="job-modal-title"
                className="mt-1.5 font-display text-2xl text-ink"
              >
                {isEdit ? "Update this application" : "Log an application"}
              </h2>
            </div>
            <button
              type="button"
              onClick={attemptClose}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-paper hover:text-ink disabled:opacity-50"
              disabled={loading}
              aria-label="Close"
            >
              <X className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            {/* Fields (scrollable) */}
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
              {/* Job Title */}
              <div className="space-y-2">
                <label
                  htmlFor={FIELD_IDS.JobTitle}
                  className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft"
                >
                  Job title
                  <span aria-hidden className="text-clay">
                    *
                  </span>
                </label>
                <div className="relative">
                  <Briefcase
                    className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-faint"
                    strokeWidth={1.75}
                  />
                  <input
                    id={FIELD_IDS.JobTitle}
                    ref={firstFieldRef}
                    type="text"
                    value={formData.JobTitle}
                    onChange={(e) => handleChange("JobTitle", e.target.value)}
                    onBlur={() => handleBlur("JobTitle")}
                    className={inputClass(showError("JobTitle"), true)}
                    placeholder="e.g., Senior Product Designer"
                    disabled={loading}
                    aria-invalid={showError("JobTitle") || undefined}
                    aria-describedby={
                      showError("JobTitle")
                        ? `${FIELD_IDS.JobTitle}-error`
                        : undefined
                    }
                  />
                </div>
                {showError("JobTitle") && (
                  <p
                    id={`${FIELD_IDS.JobTitle}-error`}
                    role="alert"
                    className="flex items-center gap-1.5 text-xs font-medium text-rose"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {errors.JobTitle}
                  </p>
                )}
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label
                  htmlFor={FIELD_IDS.Company}
                  className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft"
                >
                  Company
                  <span aria-hidden className="text-clay">
                    *
                  </span>
                </label>
                <div className="relative">
                  <Building2
                    className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-faint"
                    strokeWidth={1.75}
                  />
                  <input
                    id={FIELD_IDS.Company}
                    type="text"
                    value={formData.Company}
                    onChange={(e) => handleChange("Company", e.target.value)}
                    onBlur={() => handleBlur("Company")}
                    className={inputClass(showError("Company"), true)}
                    placeholder="e.g., Fernwood & Co."
                    disabled={loading}
                    aria-invalid={showError("Company") || undefined}
                    aria-describedby={
                      showError("Company")
                        ? `${FIELD_IDS.Company}-error`
                        : undefined
                    }
                  />
                </div>
                {showError("Company") && (
                  <p
                    id={`${FIELD_IDS.Company}-error`}
                    role="alert"
                    className="flex items-center gap-1.5 text-xs font-medium text-rose"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {errors.Company}
                  </p>
                )}
              </div>

              {/* Status & Date row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor={FIELD_IDS.Status}
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft"
                    >
                      Status
                    </label>
                    <StatusBadge status={formData.Status} />
                  </div>
                  <div className="relative">
                    <Tag
                      className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-faint"
                      strokeWidth={1.75}
                    />
                    <select
                      id={FIELD_IDS.Status}
                      value={formData.Status}
                      onChange={(e) => handleChange("Status", e.target.value)}
                      className={`${inputClass(
                        false,
                        true
                      )} cursor-pointer appearance-none pr-10`}
                      disabled={loading}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-ink-faint"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor={FIELD_IDS.ApplicationDate}
                    className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft"
                  >
                    Date applied
                    <span aria-hidden className="text-clay">
                      *
                    </span>
                  </label>
                  <div className="relative">
                    <Calendar
                      className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-faint"
                      strokeWidth={1.75}
                    />
                    <input
                      id={FIELD_IDS.ApplicationDate}
                      type="date"
                      value={formData.ApplicationDate}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        handleChange("ApplicationDate", e.target.value)
                      }
                      onBlur={() => handleBlur("ApplicationDate")}
                      className={inputClass(
                        showError("ApplicationDate"),
                        true
                      )}
                      disabled={loading}
                      aria-invalid={showError("ApplicationDate") || undefined}
                      aria-describedby={
                        showError("ApplicationDate")
                          ? `${FIELD_IDS.ApplicationDate}-error`
                          : undefined
                      }
                    />
                  </div>
                  {showError("ApplicationDate") && (
                    <p
                      id={`${FIELD_IDS.ApplicationDate}-error`}
                      role="alert"
                      className="flex items-center gap-1.5 text-xs font-medium text-rose"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {errors.ApplicationDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <label
                    htmlFor={FIELD_IDS.Notes}
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft"
                  >
                    Notes{" "}
                    <span className="normal-case tracking-normal text-ink-faint">
                      (optional)
                    </span>
                  </label>
                  <span className="font-mono text-[10px] text-ink-faint">
                    {formData.Notes.length}
                  </span>
                </div>
                <textarea
                  id={FIELD_IDS.Notes}
                  value={formData.Notes}
                  onChange={(e) => handleChange("Notes", e.target.value)}
                  rows={3}
                  className={`${inputClass()} resize-none`}
                  placeholder="Important details, contacts, or reminders..."
                  disabled={loading}
                />
              </div>
            </div>

            {/* Footer actions (always visible) */}
            <div className="shrink-0 border-t border-dashed border-line p-5">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={attemptClose}
                  className="flex-1 rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-ink-faint hover:text-ink disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-clay px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-clay-deep disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" strokeWidth={2} />
                      {isEdit ? "Update entry" : "File entry"}
                    </>
                  )}
                </button>
              </div>
              <p className="mt-3 hidden items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint sm:flex">
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-line bg-paper px-1.5 py-0.5 normal-case">
                    Enter
                  </kbd>
                  to save
                </span>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-line bg-paper px-1.5 py-0.5 normal-case">
                    Esc
                  </kbd>
                  to close
                </span>
              </p>
            </div>
          </form>
        </div>

        {/* Discard confirmation */}
        {showDiscardConfirm && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-card/95 p-6 backdrop-blur-sm">
            <div className="w-full max-w-sm text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-marigold/15">
                <AlertTriangle
                  className="h-7 w-7 text-marigold"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="mb-2 font-display text-2xl text-ink">
                Discard this entry?
              </h3>
              <p className="mb-6 text-sm text-ink-soft">
                You have unsaved changes — they&apos;ll be lost if you leave now.
              </p>
              <div className="flex gap-3">
                <button
                  ref={keepEditingRef}
                  type="button"
                  onClick={() => setShowDiscardConfirm(false)}
                  className="flex-1 rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-ink-faint hover:text-ink"
                >
                  Keep editing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDiscardConfirm(false);
                    onClose();
                  }}
                  className="flex-1 rounded-full bg-rose px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-rose/90"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Job Application Form Component
const JobApplicationForm: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  // Shared store: filing an entry here refreshes the dashboard too, since both
  // read from the same list. `error` here is the fetch error from the store.
  const {
    applications,
    loading,
    error: fetchError,
    fetchApplications,
  } = useJobApplicationStore();
  const [filteredApplications, setFilteredApplications] = useState<
    JobApplication[]
  >([]);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<JobApplication | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination — keeps a large ledger from turning the page into one endless
  // vertical scroll; entries per page is user-selectable.
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Wait for auth to be ready, then fetch applications
  useEffect(() => {
    if (!authLoading && user) {
      fetchApplications();
    }
  }, [authLoading, user]);

  // Keep this list current without a manual refresh — polls in the
  // background and refetches immediately when this tab regains focus.
  useAutoRefreshApplications(!authLoading && !!user);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  // Jump back to page 1 whenever the filtered set or page size changes, so a
  // narrower search never leaves the view stranded on an out-of-range page.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, pageSize]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplications.length / pageSize)
  );
  const currentPageClamped = Math.min(currentPage, totalPages);
  const pageStart = (currentPageClamped - 1) * pageSize;
  const paginatedApplications = filteredApplications.slice(
    pageStart,
    pageStart + pageSize
  );

  // POST HTTP METHOD
  const createApplication = async (formData: FormData) => {
    if (!user) return;

    try {
      setFormLoading(true);
      setError(null);

      const newApplication = {
        userId: user.uid,
        jobTitle: formData.JobTitle,
        company: formData.Company,
        status: formData.Status,
        applicationDate: new Date(formData.ApplicationDate).toISOString(),
        notes: formData.Notes,
        autoStatusUpdated: false,
      };

      const response = await authedFetch(`${API_BASE_URL}/jobapplications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newApplication),
      });

      if (!response.ok) {
        throw new Error("Failed to create job application");
      }

      setSuccess("Entry filed in your ledger.");
      setIsModalOpen(false);
      await fetchApplications();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create application"
      );
    } finally {
      setFormLoading(false);
    }
  };

  const updateApplication = async (formData: FormData) => {
    if (!editingApplication || !user) return;

    try {
      setFormLoading(true);
      setError(null);

      // Backend binds camelCase keys (PropertyNamingPolicy = null, case-sensitive).
      // These overrides must be camelCase or the spread's original values win and
      // the user's edits are silently dropped.
      const updatedApplication = {
        ...editingApplication,
        jobTitle: formData.JobTitle,
        company: formData.Company,
        status: formData.Status,
        applicationDate: new Date(formData.ApplicationDate).toISOString(),
        notes: formData.Notes,
      };

      const response = await authedFetch(
        `${API_BASE_URL}/jobapplication/${editingApplication.Id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedApplication),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update job application");
      }

      setSuccess("Entry updated.");
      setIsModalOpen(false);
      setEditingApplication(null);
      await fetchApplications();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update application"
      );
    } finally {
      setFormLoading(false);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job application?")) {
      return;
    }

    try {
      setError(null);

      const response = await authedFetch(
        `${API_BASE_URL}/jobapplication/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete job application");
      }

      setSuccess("Entry removed from your ledger.");
      await fetchApplications();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete application"
      );
    }
  };

  const handleFormSubmit = (formData: FormData) => {
    if (editingApplication) {
      updateApplication(formData);
    } else {
      createApplication(formData);
    }
  };

  const openEditModal = (application: JobApplication) => {
    setEditingApplication(application);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingApplication(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingApplication(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Show loading while auth initializes
  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-paper">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <span className="block h-16 w-16 animate-spin rounded-full border-2 border-dashed border-clay [animation-duration:2.5s]" />
            <SunMark className="absolute top-1/2 left-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-clay" />
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  // Show message if no user
  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-paper p-6">
        <div className="w-full max-w-md rounded-2xl border border-line bg-card p-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-clay-wash">
            <AlertCircle className="h-7 w-7 text-clay" strokeWidth={1.75} />
          </div>
          <h3 className="mb-2 font-display text-2xl text-ink">
            Please sign in.
          </h3>
          <p className="text-ink-soft">
            You need to be signed in to view and manage your job applications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              All entries
            </span>
            <h2 className="mt-3 font-display text-3xl tracking-[-0.01em] text-ink lg:text-4xl">
              Every application, <em className="text-clay">accounted for</em>.
            </h2>
          </div>
          <button
            onClick={openCreateModal}
            className="group inline-flex shrink-0 items-center gap-2.5 rounded-full bg-clay py-3 pr-3 pl-6 text-sm font-semibold text-paper shadow-[0_12px_24px_-12px_rgba(184,69,31,0.6)] transition-colors duration-300 hover:bg-clay-deep"
          >
            New entry
            <span className="grid h-7 w-7 place-items-center rounded-full bg-paper/20 transition-transform duration-300 group-hover:rotate-90">
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
          </button>
        </div>

        {/* Review pending emails */}
        <ReviewQueue uid={user.uid} />

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-line bg-card py-3 pr-4 pl-11 text-sm text-ink placeholder-ink-faint transition-colors hover:border-ink-faint focus:border-clay focus:outline-none"
            />
          </div>
          <div className="relative sm:w-60">
            <Filter className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-full border border-line bg-card py-3 pr-4 pl-11 text-sm text-ink-soft transition-colors hover:border-ink-faint focus:border-clay focus:outline-none"
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Success / error messages */}
        {success && (
          <div className="flex items-center gap-3 rounded-2xl border border-moss/30 bg-moss/10 p-4">
            <CheckCircle className="h-5 w-5 shrink-0 text-moss" strokeWidth={2} />
            <p className="text-sm font-semibold text-moss">{success}</p>
          </div>
        )}

        {(error || fetchError) && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose/30 bg-rose/10 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose" strokeWidth={2} />
            <p className="text-sm font-semibold text-rose">
              {error || fetchError}
            </p>
          </div>
        )}

        {/* Applications list */}
        <div className="overflow-hidden rounded-2xl border border-line bg-card">
          {loading && applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <span className="block h-14 w-14 animate-spin rounded-full border-2 border-dashed border-clay [animation-duration:2.5s]" />
                <SunMark className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-clay" />
              </div>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                Loading entries...
              </p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <SunMark className="mx-auto mb-6 h-10 w-10 text-clay" />
              <h3 className="mb-2 font-display text-3xl text-ink">
                {applications.length === 0
                  ? "A fresh page."
                  : "Nothing matches."}
              </h3>
              <p className="mx-auto mb-8 max-w-md text-ink-soft">
                {applications.length === 0
                  ? "Your ledger is empty — file your first application and let the record begin."
                  : "Try adjusting your search or filter criteria."}
              </p>
              {applications.length === 0 && (
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 rounded-full bg-clay px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-clay-deep"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                  File your first entry
                </button>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {paginatedApplications.map((app) => (
                <li
                  key={app.Id}
                  className="group p-6 transition-colors duration-300 hover:bg-paper lg:px-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex flex-wrap items-center gap-3">
                        <h3 className="truncate font-display text-xl text-ink transition-colors duration-300 group-hover:text-clay lg:text-2xl">
                          {app.jobTitle}
                        </h3>
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="text-sm font-semibold text-ink-soft">
                        {app.company}
                      </p>
                      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                        Filed {formatDate(app.applicationDate)}
                      </p>
                      {app.notes && (
                        <p className="mt-3 max-w-2xl border-l-2 border-clay/40 pl-3 text-sm text-ink-soft italic">
                          {app.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1.5 opacity-100 transition-opacity duration-200 lg:opacity-0 lg:group-hover:opacity-100">
                      <button
                        onClick={() => openEditModal(app)}
                        className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-clay-wash hover:text-clay"
                        title="Edit entry"
                      >
                        <Edit className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={() => deleteApplication(app.Id)}
                        className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-rose/10 hover:text-rose"
                        title="Delete entry"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination — keeps the ledger from becoming one endless scroll */}
          {filteredApplications.length > 0 && (
            <div className="flex flex-col gap-4 border-t border-dashed border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                  Showing {pageStart + 1}–
                  {Math.min(pageStart + pageSize, filteredApplications.length)}{" "}
                  of {filteredApplications.length}
                </span>
                <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                  Per page
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="cursor-pointer rounded-full border border-line bg-paper px-3 py-1.5 text-ink-soft transition-colors hover:border-ink-faint focus:border-clay focus:outline-none"
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage(Math.max(1, currentPageClamped - 1))
                    }
                    disabled={currentPageClamped <= 1}
                    aria-label="Previous page"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-clay/50 hover:text-clay disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                  </button>

                  {/* Horizontally scrollable so a long run of pages never
                      pushes the layout wider than the card. */}
                  <div className="flex max-w-[11rem] items-center gap-1.5 overflow-x-auto sm:max-w-xs">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (n) => (
                        <button
                          type="button"
                          key={n}
                          onClick={() => setCurrentPage(n)}
                          aria-current={
                            n === currentPageClamped ? "page" : undefined
                          }
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-xs transition-colors ${
                            n === currentPageClamped
                              ? "bg-clay text-paper"
                              : "text-ink-soft hover:bg-paper hover:text-clay"
                          }`}
                        >
                          {n}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage(
                        Math.min(totalPages, currentPageClamped + 1)
                      )
                    }
                    disabled={currentPageClamped >= totalPages}
                    aria-label="Next page"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-clay/50 hover:text-clay disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Form modal */}
      <JobApplicationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        initialData={editingApplication}
        loading={formLoading}
      />
    </div>
  );
};

export default JobApplicationForm;
