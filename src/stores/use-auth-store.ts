import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { validateMockCredentials } from "@/lib/mock-auth";

/**
 * Session gate for the trader shell. Swap for real auth + httpOnly cookies / tokens.
 */
interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      email: null,
      login: (email, password) => {
        if (!validateMockCredentials(email, password)) {
          set({ isAuthenticated: false, email: null });
          return false;
        }
        set({ isAuthenticated: true, email: email.trim() });
        return true;
      },
      logout: () => set({ isAuthenticated: false, email: null }),
    }),
    {
      name: "zayride-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        email: s.email,
      }),
    }
  )
);
