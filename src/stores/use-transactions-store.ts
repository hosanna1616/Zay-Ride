import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Transaction } from "@/types";
import { createLocalId } from "@/lib/utils";

/**
 * Sales & expenses ledger.
 * BACKEND:
 * - `GET /v1/transactions?from=&to=`
 * - `POST /v1/transactions`
 * - `PATCH /v1/transactions/:id` (optional)
 * Webhooks or realtime channel for multi-register sync.
 */
interface TransactionsState {
  transactions: Transaction[];
  hydrated: boolean;
  addTransaction: (t: Omit<Transaction, "id" | "createdAt">) => Transaction;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  linkDelivery: (transactionId: string, deliveryId: string) => void;
  setHydrated: (v: boolean) => void;
}

export const useTransactionsStore = create<TransactionsState>()(
  persist(
    (set, get) => ({
      transactions: [],
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),

      addTransaction: (partial) => {
        const row: Transaction = {
          ...partial,
          id: createLocalId(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ transactions: [row, ...s.transactions] }));
        return row;
      },

      updateTransaction: (id, patch) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...patch } : t
          ),
        })),

      removeTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      linkDelivery: (transactionId, deliveryId) =>
        get().updateTransaction(transactionId, {
          deliveryRequested: true,
          deliveryId,
        }),
    }),
    {
      name: "zayride-transactions",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ transactions: s.transactions }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
