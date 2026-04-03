import type { Transaction } from "@/types";
import { isWithinInterval, startOfDay, subDays } from "date-fns";

export function sumSales(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "sale")
    .reduce((a, t) => a + t.amount, 0);
}

export function sumExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((a, t) => a + t.amount, 0);
}

export function netProfit(transactions: Transaction[]): number {
  return sumSales(transactions) - sumExpenses(transactions);
}

export function transactionsLastNDays(transactions: Transaction[], days: number): Transaction[] {
  const end = new Date();
  const start = startOfDay(subDays(end, days - 1));
  return transactions.filter((t) =>
    isWithinInterval(new Date(t.createdAt), { start, end })
  );
}

/** Aggregate sales/expenses/profit by calendar day for charts */
export function dailyBuckets(
  transactions: Transaction[],
  days: number
): { label: string; sales: number; expenses: number; profit: number }[] {
  const buckets: Record<string, { sales: number; expenses: number }> = {};
  const end = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = startOfDay(subDays(end, i));
    const key = d.toISOString().slice(0, 10);
    buckets[key] = { sales: 0, expenses: 0 };
  }
  for (const t of transactionsLastNDays(transactions, days)) {
    const key = new Date(t.createdAt).toISOString().slice(0, 10);
    if (!buckets[key]) continue;
    if (t.type === "sale") buckets[key].sales += t.amount;
    else buckets[key].expenses += t.amount;
  }
  return Object.entries(buckets).map(([key, v]) => ({
    label: key.slice(5),
    sales: v.sales,
    expenses: v.expenses,
    profit: v.sales - v.expenses,
  }));
}
