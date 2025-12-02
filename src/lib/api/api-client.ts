// lib/api-client.ts
import { useAuthStore } from '@/store/authStore';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class ApiClient {
  private static async getAuthToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
      const token = await user.getIdToken();
      return token;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Request failed: ${response.status}`);
    }

    return response.json();
  }

  // Gmail Auth endpoints
  static async getGmailAuthUrl(): Promise<{ authUrl: string; state: string }> {
    return this.request('/api/auth/gmail/connect');
  }

  static async getGmailStatus(): Promise<{
    connected: boolean;
    email?: string;
    connectedAt?: string;
    lastSyncAt?: string;
    lastSyncStatus?: string;
  }> {
    return this.request('/api/auth/gmail/status');
  }

  static async disconnectGmail(): Promise<{ message: string }> {
    return this.request('/api/auth/gmail/disconnect', {
      method: 'POST',
    });
  }

  // Email Sync endpoints
  static async syncEmails(): Promise<{
    message: string;
    emailsProcessed: number;
    emailsSkipped: number;
    emailsFailed: number;
    status: string;
  }> {
    return this.request('/api/emails/sync', {
      method: 'POST',
    });
  }

  static async getSyncHistory(limit: number = 20): Promise<any[]> {
    return this.request(`/api/emails/history?limit=${limit}`);
  }

  static async getLatestSync(): Promise<any> {
    return this.request('/api/emails/latest-sync');
  }

  static async getProcessedEmails(limit: number = 50): Promise<any[]> {
    return this.request(`/api/emails/processed?limit=${limit}`);
  }

  static async getJobRelatedEmails(limit: number = 50): Promise<any[]> {
    return this.request(`/api/emails/job-related?limit=${limit}`);
  }
}