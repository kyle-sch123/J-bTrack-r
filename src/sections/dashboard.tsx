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
} from "lucide-react";

import MetricCard from "@/components/metricCard";
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
  //State & Side Effects - useState is how react stores data internally, useEffect is how we perform side effects like fetching data after render.
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_ENDPOINT = "http://localhost:5160/api/jobapplication";

  useEffect(() => {
    fetchJobApplications();
  }, []);

  const fetchJobApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINT);

      if (!response.ok) {
        throw new Error("Failed to fetch job applications");
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

    const statusCounts = jobApplications.reduce((acc, app) => {
      acc[app.Status] = (acc[app.Status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const applicationsThisWeek = jobApplications.filter(
      (app) => new Date(app.ApplicationDate) >= oneWeekAgo
    ).length;

    const applicationsThisMonth = jobApplications.filter(
      (app) => new Date(app.ApplicationDate) >= oneMonthAgo
    ).length;

    const recentApplications = jobApplications
      .sort(
        (a, b) =>
          new Date(b.ApplicationDate).getTime() -
          new Date(a.ApplicationDate).getTime()
      )
      .slice(0, 5);

    // Calculate average response time (simplified - days since application)
    const averageResponseTime = Math.round(
      jobApplications.reduce((sum, app) => {
        const daysSinceApplication =
          (now.getTime() - new Date(app.ApplicationDate).getTime()) /
          (1000 * 60 * 60 * 24);
        return sum + daysSinceApplication;
      }, 0) / jobApplications.length
    );

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <XCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              onClick={fetchJobApplications}
              className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Job Application Dashboard
        </h1>
        <p className="text-gray-600">
          Track your job search progress and metrics
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Applications"
          value={metrics.totalApplications}
          icon={<Briefcase />}
          color="#3B82F6"
        />
        <MetricCard
          title="This Week"
          value={metrics.applicationsThisWeek}
          icon={<Calendar />}
          trend={`${metrics.applicationsThisMonth} this month`}
          color="#10B981"
        />
        <MetricCard
          title="Response Rate"
          value={`${Math.round(
            (((metrics.statusCounts["Interview Scheduled"] || 0) +
              (metrics.statusCounts["Accepted"] || 0)) /
              metrics.totalApplications) *
              100
          )}%`}
          icon={<TrendingUp />}
          color="#F59E0B"
        />
        <MetricCard
          title="Avg. Days Pending"
          value={metrics.averageResponseTime}
          icon={<Clock />}
          color="#8B5CF6"
        />
      </div>

      {/* Status Overview & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Application Status Overview
          </h3>
          <div className="space-y-3">
            {Object.entries(metrics.statusCounts).map(([status, count]) => {
              const percentage = Math.round(
                (count / metrics.totalApplications) * 100
              );
              const getIcon = (status: string) => {
                switch (status.toLowerCase()) {
                  case "applied":
                    return <Clock className="h-4 w-4 text-blue-500" />;
                  case "interview scheduled":
                    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
                  case "rejected":
                    return <XCircle className="h-4 w-4 text-red-500" />;
                  case "accepted":
                    return <CheckCircle className="h-4 w-4 text-green-500" />;
                  default:
                    return <Clock className="h-4 w-4 text-gray-500" />;
                }
              };

              return (
                <div
                  key={status}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div className="flex items-center">
                    {getIcon(status)}
                    <span className="ml-2 font-medium text-gray-700">
                      {status}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">{count}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Applications
          </h3>
          <div className="space-y-3">
            {metrics.recentApplications.map((app) => (
              <div
                key={app.Id}
                className="border-l-4 border-blue-500 pl-4 py-2"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {app.JobTitle}
                    </h4>
                    <p className="text-sm text-gray-600">{app.Company}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(app.ApplicationDate)}
                    </p>
                  </div>
                  <StatusBadge status={app.Status} />
                </div>
                {app.Notes && (
                  <p className="text-xs text-gray-500 mt-2 italic">
                    {app.Notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={fetchJobApplications}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          disabled={loading}
        >
          <Calendar className="h-4 w-4" />
          <span>Refresh Data</span>
        </button>
      </div>
    </div>
  );
};

export default JobApplicationDashboard;
