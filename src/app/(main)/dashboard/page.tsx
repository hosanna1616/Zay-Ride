"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { isToday, isBefore, startOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactionsStore } from "@/stores/use-transactions-store";
import { useDebtsStore } from "@/stores/use-debts-store";
import { useDeliveriesStore } from "@/stores/use-deliveries-store";
import { useSettingsStore } from "@/stores/use-settings-store";
import { CountUp } from "@/components/motion/count-up";
import {
  netProfit,
  sumExpenses,
  sumSales,
  transactionsLastNDays,
} from "@/lib/profit";
const TrendChart = dynamic(() => import("@/components/dashboard/trend-chart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-56 items-center justify-center rounded-xl bg-zinc-100/80 text-sm text-zinc-500 dark:bg-zinc-800/50">
      Loading chart…
    </div>
  ),
});
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PartnerDashboard } from "@/components/partner/partner-dashboard";
import { ProTeaserModal } from "@/components/shared/pro-teaser-modal";
import { ExportMenu } from "@/components/shared/export-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const { t } = useTranslation();
  const partnerView = useSettingsStore((s) => s.partnerView);
  const transactions = useTransactionsStore((s) => s.transactions);
  const debts = useDebtsStore((s) => s.debts);
  const deliveries = useDeliveriesStore((s) => s.deliveries);

  const todayTx = useMemo(
    () => transactions.filter((x) => isToday(new Date(x.createdAt))),
    [transactions]
  );
  const salesToday = sumSales(todayTx);
  const expensesToday = sumExpenses(todayTx);
  const profitToday = netProfit(todayTx);

  const overdue = useMemo(
    () =>
      debts.filter(
        (d) =>
          !d.paid &&
          isBefore(startOfDay(new Date(d.dueDate)), startOfDay(new Date()))
      ),
    [debts]
  );
  const pendingSum = useMemo(
    () => debts.filter((d) => !d.paid).reduce((a, d) => a + d.amount, 0),
    [debts]
  );

  useEffect(() => {
    if (partnerView) return;
    if (overdue.length === 0) return;
    const key = "zayride-debt-reminder";
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    toast(t("overdueDebts"), {
      description: `${overdue.length} · ${pendingSum.toLocaleString()} ${t("birr")}`,
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    });
  }, [partnerView, overdue.length, pendingSum, t]);

  if (partnerView) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            {t("partnerMetrics")}
          </h1>
        </div>
        <PartnerDashboard />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ProTeaserModal />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">{t("dashboard")}</h1>
        <ExportMenu transactions={transactions} debts={debts} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
        >
          <Card className="border-emerald-200/50 shadow-md shadow-emerald-500/5">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-500">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                {t("todaySales")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                <CountUp value={salesToday} />{" "}
                <span className="text-base font-semibold text-zinc-400">{t("birr")}</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, type: "spring", stiffness: 300, damping: 26 }}
        >
          <Card className="border-red-200/50 shadow-md shadow-red-500/5">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-500">
                <TrendingDown className="h-4 w-4 text-red-500" />
                {t("todayExpenses")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums text-red-600 dark:text-red-400">
                <CountUp value={expensesToday} />{" "}
                <span className="text-base font-semibold text-zinc-400">{t("birr")}</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 26 }}
        >
          <Card className="border-zinc-200/80">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-zinc-500">{t("netProfit")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-bold tabular-nums ${
                  profitToday >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                <CountUp value={profitToday} />{" "}
                <span className="text-base font-semibold text-zinc-400">{t("birr")}</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">{t("last7Days")}</CardTitle>
          <span className="text-xs text-zinc-500">{t("todayTx")}</span>
        </CardHeader>
        <CardContent className="min-h-[240px] overflow-x-auto">
          <TrendChart transactions={transactionsLastNDays(transactions, 7)} />
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="border-amber-200/60 dark:border-amber-900/50">
          <CardHeader>
            <CardTitle className="text-base">{t("overdueDebts")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {overdue.length === 0 ? (
              <p className="text-zinc-500">{t("allDebts")}</p>
            ) : (
              overdue.map((d) => (
                <div key={d.id} className="flex justify-between rounded-lg bg-amber-50/80 px-2 py-2 dark:bg-amber-950/30">
                  <span>{d.customerName}</span>
                  <span className="font-semibold text-amber-800 dark:text-amber-200">
                    {d.amount.toLocaleString()} {t("birr")}
                  </span>
                </div>
              ))
            )}
            <p className="pt-1 text-xs text-zinc-500">
              {t("pendingTotal")}: {pendingSum.toLocaleString()} {t("birr")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("recentDeliveries")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {deliveries.length === 0 ? (
              <p className="text-zinc-500">{t("noDeliveries")}</p>
            ) : (
              deliveries.slice(0, 4).map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-2">
                  <span className="truncate text-zinc-700 dark:text-zinc-200">
                    {d.dropoffAddress.slice(0, 28)}…
                  </span>
                  <Badge variant="delivery">
                    {d.status === "picked_up" ? t("picked_up") : t(d.status)}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/transactions">
          <Button className="rounded-xl">{t("quickAddSale")}</Button>
        </Link>
        <Link href="/transactions">
          <Button variant="destructive" className="rounded-xl">
            {t("quickAddExpense")}
          </Button>
        </Link>
        <Link href="/debts">
          <Button variant="outline" className="rounded-xl border-amber-300 text-amber-900 dark:text-amber-100">
            {t("quickAddDebt")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
