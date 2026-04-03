import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Debt } from "@/types";
import { createLocalId } from "@/lib/utils";
/**
 * Customer credit / ዕዳ tracking.
 * BACKEND:
 * - `GET /v1/debts`
 * - `POST /v1/debts`
 * - `PATCH /v1/debts/:id` (mark paid, adjust amount)
 */
interface DebtsState {
  debts: Debt[];
  hydrated: boolean;
  addDebt: (d: Omit<Debt, "id" | "createdAt" | "paid"> & { paid?: boolean }) => Debt;
  updateDebt: (id: string, patch: Partial<Debt>) => void;
  togglePaid: (id: string) => void;
  removeDebt: (id: string) => void;
  setHydrated: (v: boolean) => void;
}

export const useDebtsStore = create<DebtsState>()(
  persist(
    (set) => ({
      debts: [],
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),

      addDebt: (partial) => {
        const row: Debt = {
          ...partial,
          id: createLocalId(),
          paid: partial.paid ?? false,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ debts: [row, ...s.debts] }));
        return row;
      },

      updateDebt: (id, patch) =>
        set((s) => ({
          debts: s.debts.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        })),

      togglePaid: (id) =>
        set((s) => ({
          debts: s.debts.map((d) =>
            d.id === id ? { ...d, paid: !d.paid } : d
          ),
        })),

      removeDebt: (id) =>
        set((s) => ({ debts: s.debts.filter((d) => d.id !== id) })),
    }),
    {
      name: "zayride-debts",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ debts: s.debts }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
