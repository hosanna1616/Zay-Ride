import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Delivery, DeliveryDriver, DeliveryStatus } from "@/types";
import { createLocalId } from "@/lib/utils";
import { FAKE_DRIVERS } from "@/lib/seed-data";

/**
 * ZayRide delivery jobs (demo simulation).
 * BACKEND:
 * - `POST /v1/deliveries` — create job, returns job id + ETA
 * - `GET /v1/deliveries/:id/stream` or polling for status + driver
 * - Partner dashboard: `GET /partner/metrics`, `GET /partner/deliveries`
 */

interface DeliveriesState {
  deliveries: Delivery[];
  hydrated: boolean;
  requestDelivery: (input: {
    transactionId?: string;
    pickupAddress: string;
    dropoffAddress: string;
  }) => Delivery;
  /** Optional driver only when moving to `assigned`; later steps keep existing driver. */
  advanceDeliveryDemo: (id: string, status: DeliveryStatus, driver?: DeliveryDriver) => void;
  setHydrated: (v: boolean) => void;
}

function pickDriver(): DeliveryDriver {
  const d = FAKE_DRIVERS[Math.floor(Math.random() * FAKE_DRIVERS.length)];
  return { ...d };
}

export const useDeliveriesStore = create<DeliveriesState>()(
  persist(
    (set, get) => ({
      deliveries: [],
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),

      requestDelivery: ({ transactionId, pickupAddress, dropoffAddress }) => {
        const now = new Date().toISOString();
        const row: Delivery = {
          id: createLocalId(),
          transactionId,
          pickupAddress,
          dropoffAddress,
          status: "searching",
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ deliveries: [row, ...s.deliveries] }));

        // Demo: simulate rider assignment pipeline (replace with SSE from ZayRide API).
        const id = row.id;
        const driver = pickDriver();
        setTimeout(() => {
          get().advanceDeliveryDemo(id, "assigned", driver);
        }, 2200);
        setTimeout(() => {
          get().advanceDeliveryDemo(id, "picked_up");
        }, 5200);
        setTimeout(() => {
          get().advanceDeliveryDemo(id, "delivered");
        }, 8500);

        return row;
      },

      advanceDeliveryDemo: (id, status, driver) =>
        set((s) => ({
          deliveries: s.deliveries.map((d) => {
            if (d.id !== id) return d;
            const nextDriver = driver ?? d.driver;
            return {
              ...d,
              status,
              driver: nextDriver,
              updatedAt: new Date().toISOString(),
            };
          }),
        })),
    }),
    {
      name: "zayride-deliveries",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ deliveries: s.deliveries }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
