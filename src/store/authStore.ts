// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  uid: string | null;
  setUser: (user: User | null) => void;
  setUid: (uid: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      uid: null,
      setUser: (user) => set({ user }),
      setUid: (uid) => set({ uid }),
      clearAuth: () => set({ user: null, uid: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);