"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import MetricCard from "@/components/metricCard";
import StatusBadge from "@/components/statusBadge";

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

// Main Dashboard Component
const JobApplicationDashboard: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const uid = useAuthStore((state) => state.uid);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (uid) {
      // Only fetch if uid exists
      fetchJobApplications();
    }
  }, [uid]);

  const fetchJobApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      // Correct URL with query parameter
      const response = await fetch(`${API_BASE_URL}?userId=${uid}`);

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
      <div className="min-h-screen bg-gradient-to-br from-[#fcf8f5] via-white to-orange-50 flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-orange-100"></div>
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-[#f78433] absolute top-0"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fcf8f5] via-white to-orange-50 flex justify-center items-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-red-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={fetchJobApplications}
                className="bg-gradient-to-r from-[#f78433] to-[#ff6b35] hover:shadow-lg text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fcf8f5] via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#f78433] to-[#ff6b35] rounded-3xl shadow-xl p-8">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Your Job Hunt Dashboard
              </h1>
            </div>
            <p className="text-orange-50 text-lg">
              Track your progress and stay motivated on your journey! 🚀
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 border-2 border-blue-100 hover:border-blue-200 h-50">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Total
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                Applications
              </h3>
              <p className="text-4xl font-bold text-gray-900">
                {metrics.totalApplications}
              </p>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 border-2 border-green-100 hover:border-green-200 h-50">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  Week
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                This Week
              </h3>
              <p className="text-4xl font-bold text-gray-900">
                {metrics.applicationsThisWeek}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {metrics.applicationsThisMonth} this month
              </p>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 border-2 border-amber-100 hover:border-amber-200 h-50">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  Rate
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                Response Rate
              </h3>
              <p className="text-4xl font-bold text-gray-900">
                {Math.round(
                  (((metrics.statusCounts["Interview Scheduled"] || 0) +
                    (metrics.statusCounts["Accepted"] || 0)) /
                    metrics.totalApplications) *
                    100
                )}
                %
              </p>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 border-2 border-purple-100 hover:border-purple-200 h-50">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  Avg
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                Days Pending
              </h3>
              <p className="text-4xl font-bold text-gray-900">
                {metrics.averageResponseTime}
              </p>
            </div>
          </div>
        </div>

        {/* Status Overview & Recent Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Overview */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Application Status
              </h3>
            </div>
            <div className="space-y-3">
              {Object.entries(metrics.statusCounts).map(([status, count]) => {
                const percentage = Math.round(
                  (count / metrics.totalApplications) * 100
                );
                const getStatusStyle = (status: string) => {
                  switch (status.toLowerCase()) {
                    case "applied":
                      return {
                        icon: <Clock className="h-5 w-5 text-blue-600" />,
                        bg: "bg-blue-50",
                        bar: "bg-blue-500",
                      };
                    case "interview scheduled":
                      return {
                        icon: (
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                        ),
                        bg: "bg-amber-50",
                        bar: "bg-amber-500",
                      };
                    case "rejected":
                      return {
                        icon: <XCircle className="h-5 w-5 text-red-600" />,
                        bg: "bg-red-50",
                        bar: "bg-red-500",
                      };
                    case "accepted":
                      return {
                        icon: (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ),
                        bg: "bg-green-50",
                        bar: "bg-green-500",
                      };
                    default:
                      return {
                        icon: <Clock className="h-5 w-5 text-gray-600" />,
                        bg: "bg-gray-50",
                        bar: "bg-gray-500",
                      };
                  }
                };

                const style = getStatusStyle(status);

                return (
                  <div key={status} className="group">
                    <div
                      className={`${style.bg} rounded-xl p-4 hover:shadow-md transition-all duration-200`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {style.icon}
                          <span className="font-semibold text-gray-900">
                            {status}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-gray-900">
                            {count}
                          </span>
                          <span className="text-sm text-gray-600 ml-2">
                            ({percentage}%)
                          </span>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                        <div
                          className={`${style.bar} h-full rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Recent Applications
              </h3>
            </div>
            <div className="space-y-4">
              {metrics.recentApplications.map((app, index) => (
                <div
                  key={app.Id}
                  className="group relative pl-6 pb-4 last:pb-0"
                >
                  {/* Timeline line */}
                  {index !== metrics.recentApplications.length - 1 && (
                    <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-gradient-to-b from-orange-300 to-transparent"></div>
                  )}

                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1 w-4 h-4 bg-gradient-to-br from-[#f78433] to-[#ff6b35] rounded-full border-4 border-white shadow-md"></div>

                  <div className="bg-gradient-to-br from-gray-50 to-orange-50/30 rounded-xl p-4 hover:shadow-md transition-all duration-200 border border-gray-100 group-hover:border-orange-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg group-hover:text-[#f78433] transition-colors">
                          {app.jobTitle}
                        </h4>
                        <p className="text-sm text-gray-600 font-medium">
                          {app.company}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(app.applicationDate)}
                    </div>
                    {app.notes && (
                      <p className="text-sm text-gray-600 mt-3 p-3 bg-white/50 rounded-lg italic border-l-2 border-orange-300">
                        {app.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={fetchJobApplications}
            disabled={loading}
            className="group bg-gradient-to-r from-[#f78433] to-[#ff6b35] hover:shadow-xl text-white px-8 py-4 rounded-xl transition-all duration-300 font-semibold text-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            <RefreshCw
              className={`w-5 h-5 ${
                loading
                  ? "animate-spin"
                  : "group-hover:rotate-180 transition-transform duration-500"
              }`}
            />
            <span>Refresh Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationDashboard;
