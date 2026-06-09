// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Persist only serializable identity fields. The full Firebase User object is
// mostly non-serializable internals and doesn't survive a JSON round-trip;
// components that need it should use AuthContext (the source of truth).
interface AuthState {
  uid: string | null;
  email: string | null;
  setAuth: (uid: string | null, email: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      uid: null,
      email: null,
      setAuth: (uid, email) => set({ uid, email }),
      clearAuth: () => set({ uid: null, email: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
