import type { Debt, Delivery, ShopProfile, Transaction } from "@/types";
import { useTransactionsStore } from "@/stores/use-transactions-store";
import { useDebtsStore } from "@/stores/use-debts-store";
import { useDeliveriesStore } from "@/stores/use-deliveries-store";
import { useSettingsStore } from "@/stores/use-settings-store";

export const BACKUP_VERSION = 1 as const;

/** Full local snapshot — extend with user id / remote version when backend exists. */
export interface ZayRideBackup {
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  transactions: Transaction[];
  debts: Debt[];
  deliveries: Delivery[];
  settings: {
    shop: ShopProfile;
    partnerView: boolean;
    hasSeenProTeaser: boolean;
    seedVersion: number;
  };
}

export function buildBackup(): ZayRideBackup {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    transactions: useTransactionsStore.getState().transactions,
    debts: useDebtsStore.getState().debts,
    deliveries: useDeliveriesStore.getState().deliveries,
    settings: {
      shop: useSettingsStore.getState().shop,
      partnerView: useSettingsStore.getState().partnerView,
      hasSeenProTeaser: useSettingsStore.getState().hasSeenProTeaser,
      seedVersion: useSettingsStore.getState().seedVersion,
    },
  };
}

export function parseBackup(json: string): ZayRideBackup {
  const data = JSON.parse(json) as unknown;
  if (!data || typeof data !== "object") throw new Error("Invalid file");
  const b = data as Partial<ZayRideBackup>;
  if (b.version !== BACKUP_VERSION) throw new Error("Unsupported backup version");
  if (!Array.isArray(b.transactions) || !Array.isArray(b.debts) || !Array.isArray(b.deliveries))
    throw new Error("Invalid backup structure");
  if (!b.settings || typeof b.settings !== "object") throw new Error("Missing settings");
  return b as ZayRideBackup;
}

/**
 * Applies backup to in-memory stores (Zustand persist middleware writes localStorage).
 * For full consistency, reload after import.
 */
export function applyBackup(b: ZayRideBackup): void {
  useTransactionsStore.setState({ transactions: b.transactions });
  useDebtsStore.setState({ debts: b.debts });
  useDeliveriesStore.setState({ deliveries: b.deliveries });
  useSettingsStore.setState({
    shop: b.settings.shop,
    partnerView: b.settings.partnerView,
    hasSeenProTeaser: b.settings.hasSeenProTeaser,
    seedVersion: b.settings.seedVersion,
  });
}

export function downloadBackupJson(): void {
  const b = buildBackup();
  const blob = new Blob([JSON.stringify(b, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const d = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `zayride-backup-${d}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
