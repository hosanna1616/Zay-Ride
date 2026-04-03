"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { isBefore, startOfDay } from "date-fns";
import { HandCoins, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDebtsStore } from "@/stores/use-debts-store";
import { format } from "date-fns";
import { toast } from "sonner";
import { ExportMenu } from "@/components/shared/export-menu";
import { useTransactionsStore } from "@/stores/use-transactions-store";
import { useSettingsStore } from "@/stores/use-settings-store";

export default function DebtsPage() {
  const { t } = useTranslation();
  const partnerView = useSettingsStore((s) => s.partnerView);
  const debts = useDebtsStore((s) => s.debts);
  const addDebt = useDebtsStore((s) => s.addDebt);
  const togglePaid = useDebtsStore((s) => s.togglePaid);
  const transactions = useTransactionsStore((s) => s.transactions);

  const [filterOverdue, setFilterOverdue] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [due, setDue] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [note, setNote] = useState("");

  const overdueIds = useMemo(() => {
    const today = startOfDay(new Date());
    return new Set(
      debts
        .filter(
          (d) =>
            !d.paid && isBefore(startOfDay(new Date(d.dueDate)), today)
        )
        .map((d) => d.id)
    );
  }, [debts]);

  const list = useMemo(() => {
    const rows = [...debts].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );
    if (!filterOverdue) return rows;
    return rows.filter((d) => overdueIds.has(d.id));
  }, [debts, filterOverdue, overdueIds]);

  const pendingBirr = useMemo(
    () => debts.filter((d) => !d.paid).reduce((a, d) => a + d.amount, 0),
    [debts]
  );

  const save = () => {
    const n = parseFloat(amount.replace(/,/g, ""));
    if (!name.trim() || !Number.isFinite(n) || n <= 0 || !due) {
      toast.error(t("addDebt"));
      return;
    }
    addDebt({
      customerName: name.trim(),
      amount: n,
      dueDate: new Date(due).toISOString(),
      note: note.trim() || undefined,
      paid: false,
    });
    toast.success(t("success"));
    setOpen(false);
    setName("");
    setAmount("");
    setNote("");
  };

  if (partnerView) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold md:text-2xl">{t("debts")}</h1>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-violet-200/70 bg-gradient-to-br from-violet-500/10 to-sky-500/5 p-6 dark:border-violet-900/50">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-700 dark:text-violet-300">
                <HandCoins className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {t("partnerDebtsDisabled")}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t("partnerDebtsHint")}
                </p>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t("partnerDebtsNetworkStat", {
                    count: debts.length,
                    amount: pendingBirr.toLocaleString(),
                  })}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold md:text-2xl">{t("debts")}</h1>
        <div className="flex flex-wrap gap-2">
          <ExportMenu transactions={transactions} debts={debts} />
          <Button
            variant={filterOverdue ? "default" : "outline"}
            size="sm"
            className="rounded-xl border-amber-300"
            onClick={() => setFilterOverdue((v) => !v)}
          >
            {t("filterOverdue")}
          </Button>
          <motion.div whileTap={{ scale: 0.96 }}>
            <Button size="sm" className="gap-1 rounded-xl" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              {t("addDebt")}
            </Button>
          </motion.div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>{t("addDebt")}</DialogTitle>
          <div className="space-y-2">
            <Label>{t("customer")}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t("amountBirr")}</Label>
            <Input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("dueDate")}</Label>
            <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t("note")}</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button className="flex-1 rounded-xl" onClick={save}>
              {t("save")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {list.length === 0 ? (
          <p className="text-center text-zinc-500">{t("noDebts")}</p>
        ) : (
          list.map((d, i) => {
            const od = overdueIds.has(d.id);
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: Math.min(i * 0.06, 0.42),
                  type: "spring",
                  stiffness: 320,
                  damping: 28,
                }}
              >
                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}>
                  <Card
                    className={`p-4 shadow-md ${
                      od && !d.paid
                        ? "border-amber-300/80 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/25"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-semibold">{d.customerName}</p>
                          {od && !d.paid && (
                            <Badge variant="warning">{t("filterOverdue")}</Badge>
                          )}
                          {d.paid && <Badge variant="default">{t("markPaid")}</Badge>}
                        </div>
                        <p className="text-xl font-bold tabular-nums text-amber-700 dark:text-amber-300">
                          {d.amount.toLocaleString()} {t("birr")}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {t("dueDate")}: {format(new Date(d.dueDate), "MMM d, yyyy")}
                        </p>
                        {d.note && (
                          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{d.note}</p>
                        )}
                      </div>
                      <motion.div whileTap={{ scale: 0.97 }}>
                        <Button
                          variant={d.paid ? "outline" : "default"}
                          className="w-full rounded-xl sm:w-auto"
                          onClick={() => {
                            togglePaid(d.id);
                            toast.success(t("success"));
                          }}
                        >
                          {d.paid ? t("markUnpaid") : t("markPaid")}
                        </Button>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
