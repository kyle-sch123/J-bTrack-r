// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const jobApplicationApi = {
  // Get all jobs for a user
  getJobsByUser: async (firebaseUid: string) => {
    const response = await fetch(`${API_URL}/api/JobApplication/user/${firebaseUid}`);
    return response.json();
  },

  // Create new job application
  createJob: async (firebaseUid: string, jobData: any) => {
    const response = await fetch(`${API_URL}/api/JobApplication`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...jobData, firebaseUid }),
    });
    return response.json();
  },

  // Update job application
  updateJob: async (id: string, jobData: any) => {
    const response = await fetch(`${API_URL}/api/JobApplication/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    });
    return response.ok;
  },

  // Delete job application
  deleteJob: async (id: string) => {
    const response = await fetch(`${API_URL}/api/JobApplication/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  },
};