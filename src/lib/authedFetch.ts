// lib/authedFetch.ts
import { getAuth } from "firebase/auth";

export async function authedFetch(url: string, options: RequestInit = {}) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("No authenticated user found");
  }

  try {
    // getIdToken() automatically refreshes if token is expired
    // Pass false to use cached token, true to force refresh
    const token = await currentUser.getIdToken(false);

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, { ...options, headers });

    // Handle token expiration (401 responses)
    if (response.status === 401) {
      // Force refresh token and retry
      const refreshedToken = await currentUser.getIdToken(true);
      const retryHeaders = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${refreshedToken}`,
      };

      return fetch(url, { ...options, headers: retryHeaders });
    }

    return response;
  } catch (error) {
    console.error("Auth fetch error:", error);
    throw error;
  }
}
