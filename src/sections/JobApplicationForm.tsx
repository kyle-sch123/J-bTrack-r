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
  Calendar,
  Building,
  Briefcase,
  AlertCircle,
  CheckCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAuthStore } from "@/store/authStore";
import StatusBadge from "@/components/statusBadge";

// Type definitions
interface JobApplication {
  Id: string; // MongoDB _id (capitalized in response)
  userId: string; // camelCase to match backend
  jobTitle: string; // camelCase to match backend
  company: string; // camelCase to match backend
  status: string; // camelCase to match backend
  applicationDate: string; // camelCase to match backend
  notes: string; // camelCase to match backend
  autoStatusUpdated: boolean; // camelCase to match backend
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

const STATUS_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Applied: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
  },
  "Interview Scheduled": {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-300",
  },
  "Interview Completed": {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    border: "border-indigo-300",
  },
  Rejected: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
  },
  Accepted: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300",
  },
  Withdrawn: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
  },
  "On Hold": {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-300",
  },
};

//LOTTIE PLAYER
const LottieAnimation: React.FC<{ src: string }> = ({ src }) => {
  return (
    <DotLottieReact
      //   src="@/assets/animations/animation.lottie"
      //src\assets\animations\create-animation.lottie
      src={`${src}`}
      loop
      autoplay
      speed={0.6}
      className="w-auto h-[400px] md:h-[550px]"
    />
  );
};
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
      className="fixed inset-0 bg-gradient-to-br from-black/50 to-purple-900/30 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl w-full max-w-4xl animate-in zoom-in-95 duration-300 overflow-hidden ${
          isEdit ? "slide-in-from-right-4" : "slide-in-from-left-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex ${isEdit ? "flex-row-reverse" : "flex-row"}`}>
          {/* Lottie Animation Side */}
          <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-8 items-center justify-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl"></div>

            <LottieAnimation
              src={
                isEdit
                  ? "https://lottie.host/1e84ccad-c16c-471f-8f69-97f29297fedf/KtekqEyF44.lottie"
                  : "https://lottie.host/99da9821-11f2-466f-b1c0-d28a1ffadec2/20AULrss2N.lottie"
              }
            />
          </div>

          {/* Form Side */}
          <div className="w-full md:w-3/5">
            {/* Colorful Header */}
            <div className="relative p-6 pb-5 bg-gradient-to-r from-[#fc7534] via-orange-400 to-pink-500">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-all hover:rotate-90 duration-300"
                disabled={loading}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {isEdit ? (
                    <TrendingUp className="h-6 w-6 text-white" />
                  ) : (
                    <Sparkles className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {isEdit ? "Update Application" : "New Application"}
                  </h2>
                  <p className="text-sm text-white/80">
                    {isEdit
                      ? "Make your changes below"
                      : "Let's add a new opportunity!"}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-5 max-h-[calc(100vh-300px)] overflow-y-auto">
              {/* Job Title */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  {/* <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Briefcase className="h-3.5 w-3.5 text-white" />
                  </div> */}
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.JobTitle}
                  onChange={(e) =>
                    handleInputChange("JobTitle", e.target.value)
                  }
                  className={`w-full px-4 py-3 text-sm border-2 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-4 transition-all ${
                    errors.JobTitle
                      ? "border-red-300 focus:ring-red-100 bg-red-50"
                      : "border-gray-200 focus:ring-orange-100 focus:border-orange-400 hover:border-gray-300"
                  }`}
                  placeholder="e.g., Senior Product Designer"
                  disabled={loading}
                />
                {errors.JobTitle && (
                  <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1 font-medium">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.JobTitle}
                  </p>
                )}
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  {/* <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <Building className="h-3.5 w-3.5 text-white" />
                  </div> */}
                  Company
                </label>
                <input
                  type="text"
                  value={formData.Company}
                  onChange={(e) => handleInputChange("Company", e.target.value)}
                  className={`w-full px-4 py-3 text-sm border-2 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-4 transition-all ${
                    errors.Company
                      ? "border-red-300 focus:ring-red-100 bg-red-50"
                      : "border-gray-200 focus:ring-orange-100 focus:border-orange-400 hover:border-gray-300"
                  }`}
                  placeholder="e.g., Google, Shopify, Stripe"
                  disabled={loading}
                />
                {errors.Company && (
                  <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1 font-medium">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.Company}
                  </p>
                )}
              </div>

              {/* Status & Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={formData.Status}
                      onChange={(e) =>
                        handleInputChange("Status", e.target.value)
                      }
                      className={`w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 bg-white hover:border-gray-300 transition-all appearance-none cursor-pointer ${
                        STATUS_COLORS[formData.Status].text
                      }`}
                      disabled={loading}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option
                          key={status}
                          value={status}
                          className="text-gray-700"
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    {/* <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                      <Calendar className="h-3.5 w-3.5 text-white" />
                    </div> */}
                    Date Applied
                  </label>
                  <input
                    type="date"
                    value={formData.ApplicationDate}
                    onChange={(e) =>
                      handleInputChange("ApplicationDate", e.target.value)
                    }
                    className={`w-full px-4 py-3 text-sm border-2 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-4 transition-all ${
                      errors.ApplicationDate
                        ? "border-red-300 focus:ring-red-100 bg-red-50"
                        : "border-gray-200 focus:ring-orange-100 focus:border-orange-400 hover:border-gray-300"
                    }`}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  Notes
                  <span className="text-xs text-gray-400 font-normal ml-1">
                    (optional)
                  </span>
                </label>
                <textarea
                  value={formData.Notes}
                  onChange={(e) => handleInputChange("Notes", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 hover:border-gray-300 transition-all resize-none"
                  placeholder="Add any important details, contacts, or reminders..."
                  disabled={loading}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-5 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 active:scale-95 disabled:opacity-50 transition-all"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-5 py-3 text-sm font-semibold bg-gradient-to-r from-[#fc7534] via-orange-500 to-pink-500 text-white rounded-xl hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {isEdit ? "Update Application" : "Create Application"}
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

  const uid = useAuthStore((state) => state.uid);

  useEffect(() => {
    fetchApplications();
  }, [uid]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  //GET API REQUEST
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("user id ", uid);
      console.log("api url: ", API_BASE_URL);

      const response = await fetch(
        `${API_BASE_URL}/jobapplications?userId=${uid}`
      );

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

  //===== POST HTTP METHOD =====
  const createApplication = async (formData: FormData) => {
    try {
      console.log("Trying to create a new job appliuaction using -->", uid);

      setFormLoading(true);
      setError(null);

      const newApplication = {
        userId: uid,
        jobTitle: formData.JobTitle,
        company: formData.Company,
        status: formData.Status,
        applicationDate: new Date(formData.ApplicationDate).toISOString(),
        notes: formData.Notes,
        autoStatusUpdated: false,
      };

      console.log(JSON.stringify(newApplication));

      const response = await fetch(`${API_BASE_URL}/jobapplications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newApplication),
      });

      if (!response.ok) {
        throw new Error("Failed to create job application");
      }

      setSuccess("Job application created successfully!");
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
    if (!editingApplication) return;

    try {
      setFormLoading(true);
      setError(null);

      const updatedApplication = {
        ...editingApplication,
        JobTitle: formData.JobTitle,
        Company: formData.Company,
        Status: formData.Status,
        ApplicationDate: new Date(formData.ApplicationDate).toISOString(),
        Notes: formData.Notes,
      };

      const response = await fetch(
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

      setSuccess("Job application updated successfully!");
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

      const response = await fetch(`${API_BASE_URL}/jobapplication/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job application");
      }

      setSuccess("Job application deleted successfully!");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fcf8f5] via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#f78433] to-[#ff6b35] rounded-3xl shadow-xl p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Job Applications
                </h1>
              </div>
              <p className="text-orange-50 text-lg">
                Track and manage all your job applications in one place 📝
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="bg-white text-[#f78433] px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Add Application</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by job title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 text-gray-800 border-gray-200 rounded-xl focus:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f78433]/20 focus:border-[#f78433] hover:border-gray-300 transition-all"
                />
              </div>
            </div>
            <div className="sm:w-56">
              <div className="relative">
                <Filter className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f78433]/20 focus:border-[#f78433] hover:border-gray-300 transition-all appearance-none bg-white"
                >
                  <option value="">All Statuses</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 shadow-lg animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="font-semibold text-green-800">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 shadow-lg animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Applications List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-100"></div>
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-[#f78433] absolute top-0"></div>
              </div>
              <p className="mt-6 text-gray-600 font-medium">
                Loading applications...
              </p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-10 w-10 text-[#f78433]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {applications.length === 0
                  ? "No applications yet"
                  : "No matching applications"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {applications.length === 0
                  ? "Ready to start your job search journey? Add your first application!"
                  : "Try adjusting your search or filter criteria"}
              </p>
              {applications.length === 0 && (
                <button
                  onClick={openCreateModal}
                  className="bg-gradient-to-r from-[#f78433] to-[#ff6b35] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold inline-flex items-center gap-2 transform hover:scale-105"
                >
                  <Plus className="h-5 w-5" />
                  Add Your First Application
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredApplications.map((app, index) => (
                <div
                  key={app.Id}
                  className="group p-6 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-transparent transition-all duration-200"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#f78433] transition-colors truncate">
                          {app.jobTitle}
                        </h3>
                        <StatusBadge status={app.status} />
                      </div>
                      <div className="space-y-2">
                        <span className="flex gap-2">
                          <div className="w-6 h-6 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Building className="h-4 w-4 text-purple-600" />
                          </div>
                          <p className="text-gray-700 flex items-center gap-2 font-medium">
                            {app.company}
                          </p>
                        </span>
                        <span className="flex gap-2">
                          <div className="w-6 h-6 bg-amber-50 rounded-lg flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-amber-600" />
                          </div>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            Applied on {formatDate(app.applicationDate)}
                          </p>
                        </span>
                      </div>
                      {app.notes && (
                        <p className="text-sm text-gray-600 mt-4 p-3 bg-gradient-to-r from-gray-50 to-orange-50/30 rounded-xl italic border-l-4 border-[#f78433]">
                          "{app.notes}"
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(app)}
                        className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all transform hover:scale-110"
                        title="Edit application"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteApplication(app.Id)}
                        className="p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all transform hover:scale-110"
                        title="Delete application"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
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
