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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {initialData ? "Edit Job Application" : "Add New Job Application"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Briefcase className="inline h-4 w-4 mr-1" />
                Job Title *
              </label>
              <input
                type="text"
                value={formData.JobTitle}
                onChange={(e) => handleInputChange("JobTitle", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.JobTitle ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Senior Frontend Developer"
                disabled={loading}
              />
              {errors.JobTitle && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.JobTitle}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Building className="inline h-4 w-4 mr-1" />
                Company *
              </label>
              <input
                type="text"
                value={formData.Company}
                onChange={(e) => handleInputChange("Company", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.Company ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Google, Microsoft, etc."
                disabled={loading}
              />
              {errors.Company && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.Company}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.Status}
                onChange={(e) => handleInputChange("Status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Application Date *
              </label>
              <input
                type="date"
                value={formData.ApplicationDate}
                onChange={(e) =>
                  handleInputChange("ApplicationDate", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.ApplicationDate ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errors.ApplicationDate && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.ApplicationDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText className="inline h-4 w-4 mr-1" />
                Notes
              </label>
              <textarea
                value={formData.Notes}
                onChange={(e) => handleInputChange("Notes", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any additional notes about this application..."
                disabled={loading}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {initialData ? "Update" : "Create"}
              </button>
            </div>
          </form>
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
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Job Applications
            </h1>
            <p className="text-gray-600">Manage your job applications</p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Application</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {applications.length === 0
                ? "No job applications yet"
                : "No matching applications found"}
            </h3>
            <p className="text-gray-500 mb-4">
              {applications.length === 0
                ? "Get started by adding your first job application"
                : "Try adjusting your search or filter criteria"}
            </p>
            {applications.length === 0 && (
              <button
                onClick={openCreateModal}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Add Your First Application
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((app) => (
              <div
                key={app.Id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {app.JobTitle}
                      </h3>
                      <StatusBadge status={app.Status} />
                    </div>
                    <p className="text-gray-600 mb-1 flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {app.Company}
                    </p>
                    <p className="text-sm text-gray-500 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Applied on {formatDate(app.ApplicationDate)}
                    </p>
                    {app.Notes && (
                      <p className="text-sm text-gray-600 italic">
                        "{app.Notes}"
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => openEditModal(app)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit application"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteApplication(app.Id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete application"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
