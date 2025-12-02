"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import "../firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    // onAuthStateChanged handles token refresh automatically
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Optional: Force token refresh on auth state change
      if (firebaseUser) {
        try {
          await firebaseUser.getIdToken(true); // force refresh
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const getToken = async (): Promise<string | null> => {
    try {
      if (!user) return null;
      // getIdToken automatically handles token refresh if expired
      return await user.getIdToken();
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
