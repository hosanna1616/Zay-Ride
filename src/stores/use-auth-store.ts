import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { GUEST_DEMO_EMAIL, validateMockCredentials } from "@/lib/mock-auth";

/**
 * Session gate for the trader shell. Swap for real auth + httpOnly cookies / tokens.
 */
interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  /** True when the user entered via "Try demo" — no credentials, same UI as signed-in trader. */
  isGuest: boolean;
  login: (email: string, password: string) => boolean;
  loginGuest: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      email: null,
      isGuest: false,
      login: (email, password) => {
        if (!validateMockCredentials(email, password)) {
          set({ isAuthenticated: false, email: null, isGuest: false });
          return false;
        }
        set({ isAuthenticated: true, email: email.trim(), isGuest: false });
        return true;
      },
      loginGuest: () =>
        set({
          isAuthenticated: true,
          email: GUEST_DEMO_EMAIL,
          isGuest: true,
        }),
      logout: () => set({ isAuthenticated: false, email: null, isGuest: false }),
    }),
    {
      name: "zayride-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        email: s.email,
        isGuest: s.isGuest,
      }),
    }
  )
);
