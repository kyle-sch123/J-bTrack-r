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
  FileText,
  AlertCircle,
  CheckCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import StatusBadge from "@/components/statusBadge";

// Type definitions
interface JobApplication {
  Id: string;
  JobNumber: number;
  UserId: string;
  JobTitle: string;
  Company: string;
  Status: string;
  ApplicationDate: string;
  Notes: string;
  AutoStatusUpdated: boolean;
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
        JobTitle: initialData.JobTitle,
        Company: initialData.Company,
        Status: initialData.Status,
        ApplicationDate: initialData.ApplicationDate.split("T")[0],
        Notes: initialData.Notes,
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

  const handleSubmit = (e: React.FormEvent) => {
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-[#f78433] to-[#ff6b35] p-6 rounded-t-3xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {initialData ? "Edit Application" : "New Application"}
                </h2>
                <p className="text-orange-100 text-sm">
                  {initialData
                    ? "Update your application details"
                    : "Add a new job to track"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all"
                disabled={loading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-blue-600" />
              </div>
              Job Title *
            </label>
            <input
              type="text"
              value={formData.JobTitle}
              onChange={(e) => handleInputChange("JobTitle", e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f78433]/20 transition-all ${
                errors.JobTitle
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:border-gray-300 focus:border-[#f78433]"
              }`}
              placeholder="e.g., Senior Frontend Developer"
              disabled={loading}
            />
            {errors.JobTitle && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                {errors.JobTitle}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <Building className="h-4 w-4 text-purple-600" />
              </div>
              Company *
            </label>
            <input
              type="text"
              value={formData.Company}
              onChange={(e) => handleInputChange("Company", e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f78433]/20 transition-all ${
                errors.Company
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:border-gray-300 focus:border-[#f78433]"
              }`}
              placeholder="e.g., Google, Microsoft, etc."
              disabled={loading}
            />
            {errors.Company && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                {errors.Company}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              Status
            </label>
            <select
              value={formData.Status}
              onChange={(e) => handleInputChange("Status", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f78433]/20 focus:border-[#f78433] hover:border-gray-300 transition-all bg-white"
              disabled={loading}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-amber-600" />
              </div>
              Application Date *
            </label>
            <input
              type="date"
              value={formData.ApplicationDate}
              onChange={(e) =>
                handleInputChange("ApplicationDate", e.target.value)
              }
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f78433]/20 transition-all ${
                errors.ApplicationDate
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:border-gray-300 focus:border-[#f78433]"
              }`}
              disabled={loading}
            />
            {errors.ApplicationDate && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                {errors.ApplicationDate}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-indigo-600" />
              </div>
              Notes
            </label>
            <textarea
              value={formData.Notes}
              onChange={(e) => handleInputChange("Notes", e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f78433]/20 focus:border-[#f78433] hover:border-gray-300 transition-all resize-none"
              placeholder="Any additional notes about this application..."
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all font-semibold"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#f78433] to-[#ff6b35] text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all font-semibold flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {initialData ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </form>
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

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const uid = useAuthStore((state) => state.uid);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobapplications`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch job applications");
      }

      const data: JobApplication[] = await response.json();
      setApplications(
        data.sort(
          (a, b) =>
            new Date(b.ApplicationDate).getTime() -
            new Date(a.ApplicationDate).getTime()
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
          app.JobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.Company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((app) => app.Status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const createApplication = async (formData: FormData) => {
    try {
      setFormLoading(true);
      setError(null);

      const newApplication = {
        UserId: uid,
        JobTitle: formData.JobTitle,
        Company: formData.Company,
        Status: formData.Status,
        ApplicationDate: new Date(formData.ApplicationDate).toISOString(),
        Notes: formData.Notes,
        AutoStatusUpdated: false,
      };

      const response = await fetch(`${API_BASE_URL}/jobapplication`, {
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
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f78433]/20 focus:border-[#f78433] hover:border-gray-300 transition-all"
                />
              </div>
            </div>
            <div className="sm:w-56">
              <div className="relative">
                <Filter className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f78433]/20 focus:border-[#f78433] hover:border-gray-300 transition-all appearance-none bg-white"
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
                          {app.JobTitle}
                        </h3>
                        <StatusBadge status={app.Status} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-700 flex items-center gap-2 font-medium">
                          <div className="w-6 h-6 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Building className="h-4 w-4 text-purple-600" />
                          </div>
                          {app.Company}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-6 h-6 bg-amber-50 rounded-lg flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-amber-600" />
                          </div>
                          Applied on {formatDate(app.ApplicationDate)}
                        </p>
                      </div>
                      {app.Notes && (
                        <p className="text-sm text-gray-600 mt-4 p-3 bg-gradient-to-r from-gray-50 to-orange-50/30 rounded-xl italic border-l-4 border-[#f78433]">
                          "{app.Notes}"
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
