"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import StatusBadge from "@/components/statusBadge";
import SunMark from "@/components/SunMark";
import { authedFetch } from "@/lib/authedFetch";
import ReviewQueue from "@/components/ReviewQueue";

// Type definitions
interface JobApplication {
  Id: string;
  userId: string;
  jobTitle: string;
  company: string;
  status: string;
  applicationDate: string;
  notes: string;
  autoStatusUpdated: boolean;
}

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

const inputClass = (hasError?: boolean) =>
  `w-full rounded-xl border bg-paper px-4 py-3 text-sm font-medium text-ink placeholder-ink-faint transition-colors focus:outline-none ${
    hasError
      ? "border-rose/50 bg-rose/5 focus:border-rose"
      : "border-line hover:border-ink-faint focus:border-clay"
  }`;

// Form Modal Component
const JobApplicationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: JobApplication | null;
  loading: boolean;
}> = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [formData, setFormData] = useState<FormData>({
    JobTitle: "",
    Company: "",
    Status: "Applied",
    ApplicationDate: new Date().toISOString().split("T")[0],
    Notes: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        JobTitle: initialData.jobTitle,
        Company: initialData.company,
        Status: initialData.status,
        ApplicationDate: initialData.applicationDate.split("T")[0],
        Notes: initialData.notes,
      });
    } else {
      setFormData({
        JobTitle: "",
        Company: "",
        Status: "Applied",
        ApplicationDate: new Date().toISOString().split("T")[0],
        Notes: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.JobTitle.trim()) {
      newErrors.JobTitle = "Job title is required";
    }

    if (!formData.Company.trim()) {
      newErrors.Company = "Company name is required";
    }

    if (!formData.ApplicationDate) {
      newErrors.ApplicationDate = "Application date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  const isEdit = !!initialData;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-card shadow-[0_48px_96px_-32px_rgba(50,38,26,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex">
          {/* Decorative rail */}
          <div className="relative hidden w-2/5 overflow-hidden border-r border-line bg-clay-wash md:block">
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
                    Keeping the record{" "}
                    <em className="text-clay">straight</em>.
                  </>
                ) : (
                  <>
                    Every entry is a <em className="text-clay">step</em>{" "}
                    forward.
                  </>
                )}
              </p>
              <p className="mt-auto font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                {isEdit ? "Amending the ledger" : "A fresh page"}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="w-full md:w-3/5">
            <div className="flex items-start justify-between border-b border-dashed border-line p-6 pb-5">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-clay">
                  {isEdit ? "Edit entry" : "New entry"}
                </span>
                <h2 className="mt-1.5 font-display text-2xl text-ink">
                  {isEdit ? "Update this application" : "Log an application"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-paper hover:text-ink"
                disabled={loading}
                aria-label="Close"
              >
                <X className="h-4.5 w-4.5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="max-h-[calc(100vh-280px)] space-y-5 overflow-y-auto p-6">
              {/* Job Title */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                  Job title
                </label>
                <input
                  type="text"
                  value={formData.JobTitle}
                  onChange={(e) => handleInputChange("JobTitle", e.target.value)}
                  className={inputClass(!!errors.JobTitle)}
                  placeholder="e.g., Senior Product Designer"
                  disabled={loading}
                />
                {errors.JobTitle && (
                  <p className="flex items-center gap-1.5 text-xs font-medium text-rose">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.JobTitle}
                  </p>
                )}
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.Company}
                  onChange={(e) => handleInputChange("Company", e.target.value)}
                  className={inputClass(!!errors.Company)}
                  placeholder="e.g., Fernwood & Co."
                  disabled={loading}
                />
                {errors.Company && (
                  <p className="flex items-center gap-1.5 text-xs font-medium text-rose">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.Company}
                  </p>
                )}
              </div>

              {/* Status & Date row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={formData.Status}
                      onChange={(e) =>
                        handleInputChange("Status", e.target.value)
                      }
                      className={`${inputClass()} cursor-pointer appearance-none`}
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
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                    Date applied
                  </label>
                  <input
                    type="date"
                    value={formData.ApplicationDate}
                    onChange={(e) =>
                      handleInputChange("ApplicationDate", e.target.value)
                    }
                    className={inputClass(!!errors.ApplicationDate)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                  Notes{" "}
                  <span className="normal-case tracking-normal text-ink-faint">
                    (optional)
                  </span>
                </label>
                <textarea
                  value={formData.Notes}
                  onChange={(e) => handleInputChange("Notes", e.target.value)}
                  rows={3}
                  className={`${inputClass()} resize-none`}
                  placeholder="Important details, contacts, or reminders..."
                  disabled={loading}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-ink-faint hover:text-ink disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Job Application Form Component
const JobApplicationForm: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    JobApplication[]
  >([]);
  const [loading, setLoading] = useState(true);
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

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Wait for auth to be ready, then fetch applications
  useEffect(() => {
    if (!authLoading && user) {
      fetchApplications();
    }
  }, [authLoading, user]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  // GET API REQUEST
  const fetchApplications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // The backend scopes results to the authenticated user via the JWT.
      const response = await authedFetch(`${API_BASE_URL}/jobapplications`);

      if (!response.ok) {
        throw new Error("Failed to fetch job applications");
      }

      const data: JobApplication[] = await response.json();

      setApplications(
        data.sort(
          (a, b) =>
            new Date(b.applicationDate).getTime() -
            new Date(a.applicationDate).getTime()
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose/30 bg-rose/10 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose" strokeWidth={2} />
            <p className="text-sm font-semibold text-rose">{error}</p>
          </div>
        )}

        {/* Applications list */}
        <div className="overflow-hidden rounded-2xl border border-line bg-card">
          {loading ? (
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
              {filteredApplications.map((app) => (
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
