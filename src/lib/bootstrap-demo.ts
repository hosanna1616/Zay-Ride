import { buildSeedDebts, buildSeedTransactions } from "@/lib/seed-data";
import { useSettingsStore } from "@/stores/use-settings-store";
import { useTransactionsStore } from "@/stores/use-transactions-store";
import { useDebtsStore } from "@/stores/use-debts-store";

const DEMO_DATA_VERSION = 1;

/**
 * One-shot demo dataset for first-time visitors (localStorage empty).
 * DELETE or gate behind `NODE_ENV === 'development'` when connecting a real API.
 */
export function bootstrapDemoData(): void {
  const { seedVersion, bumpSeedVersion } = useSettingsStore.getState();
  if (seedVersion >= DEMO_DATA_VERSION) return;

  const txEmpty = useTransactionsStore.getState().transactions.length === 0;
  const debtEmpty = useDebtsStore.getState().debts.length === 0;

  if (txEmpty) {
    useTransactionsStore.setState({ transactions: buildSeedTransactions() });
  }
  if (debtEmpty) {
    useDebtsStore.setState({ debts: buildSeedDebts() });
  }

  bumpSeedVersion(DEMO_DATA_VERSION);
}
