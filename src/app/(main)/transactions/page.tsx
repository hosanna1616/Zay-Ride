"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Plus, Mic, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useTransactionsStore } from "@/stores/use-transactions-store";
import { PRODUCT_QUICK_PICKS } from "@/lib/seed-data";
import { format } from "date-fns";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { parseVoiceTransaction } from "@/lib/voice-parse";
import { toast } from "sonner";
import { DeliveryRequestDialog } from "@/components/transactions/delivery-request-dialog";
import type { Transaction } from "@/types";
import { ExportMenu } from "@/components/shared/export-menu";
import { useDebtsStore } from "@/stores/use-debts-store";
import { useSettingsStore } from "@/stores/use-settings-store";
import { Building2 } from "lucide-react";

export default function TransactionsPage() {
  const { t } = useTranslation();
  const partnerView = useSettingsStore((s) => s.partnerView);
  const transactions = useTransactionsStore((s) => s.transactions);
  const debts = useDebtsStore((s) => s.debts);
  const addTransaction = useTransactionsStore((s) => s.addTransaction);

  const [open, setOpen] = useState(false);
  const [txType, setTxType] = useState<"sale" | "expense">("sale");
  const [amount, setAmount] = useState("");
  const [product, setProduct] = useState("");
  const [customer, setCustomer] = useState("");
  const [note, setNote] = useState("");
  const [wantDelivery, setWantDelivery] = useState(false);
  const { start, listening, error } = useVoiceInput();

  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [pendingSaleId, setPendingSaleId] = useState<string | undefined>();

  const sorted = useMemo(
    () => [...transactions].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [transactions]
  );

  const resetForm = () => {
    setAmount("");
    setProduct("");
    setCustomer("");
    setNote("");
    setWantDelivery(false);
    setTxType("sale");
  };

  const onSave = () => {
    const n = parseFloat(amount.replace(/,/g, ""));
    if (!Number.isFinite(n) || n <= 0) {
      toast.error(t("amountBirr"));
      return;
    }
    const row = addTransaction({
      type: txType,
      amount: n,
      product: product.trim() || undefined,
      customerName: txType === "sale" ? customer.trim() || undefined : undefined,
      note: note.trim() || undefined,
      deliveryRequested: false,
    });
    toast.success(t("success"));
    setOpen(false);
    if (txType === "sale" && wantDelivery) {
      setPendingSaleId(row.id);
      setDeliveryOpen(true);
    }
    resetForm();
  };

  const openDeliveryFor = (row: Transaction) => {
    if (row.type !== "sale") return;
    setPendingSaleId(row.id);
    setDeliveryOpen(true);
  };

  return (
    <div className="space-y-4">
      {partnerView && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-sky-200/70 bg-gradient-to-r from-sky-500/10 to-emerald-500/10 px-4 py-3 dark:border-sky-800/60"
        >
          <div className="flex items-start gap-3">
            <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {t("partnerReadOnlyTx")}
            </p>
          </div>
        </motion.div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold md:text-2xl">{t("transactions")}</h1>
        {!partnerView && (
          <div className="flex flex-wrap items-center gap-2">
            <ExportMenu transactions={transactions} debts={debts} />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
              <Button onClick={() => setOpen(true)} className="gap-1 rounded-xl" size="sm">
                <Plus className="h-4 w-4" />
                {t("addSale")}
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      {!partnerView && (
        <DeliveryRequestDialog
          open={deliveryOpen}
          onOpenChange={(o) => {
            setDeliveryOpen(o);
            if (!o) setPendingSaleId(undefined);
          }}
          transactionId={pendingSaleId}
        />
      )}

      {!partnerView && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogTitle>
            {txType === "sale" ? t("addSale") : t("addExpense")}
          </DialogTitle>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={txType === "sale" ? "default" : "outline"}
              className="flex-1 rounded-xl"
              onClick={() => setTxType("sale")}
            >
              {t("sale")}
            </Button>
            <Button
              type="button"
              variant={txType === "expense" ? "destructive" : "outline"}
              className="flex-1 rounded-xl"
              onClick={() => setTxType("expense")}
            >
              {t("expense")}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRODUCT_QUICK_PICKS.map((p) => (
              <motion.button
                key={p}
                type="button"
                whileTap={{ scale: 0.95 }}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                onClick={() => setProduct(p)}
              >
                {p}
              </motion.button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amt">{t("amountBirr")}</Label>
            <Input
              id="amt"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prod">{t("product")}</Label>
            <Input
              id="prod"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
          </div>
          {txType === "sale" && (
            <div className="space-y-2">
              <Label htmlFor="cust">{t("customer")}</Label>
              <Input
                id="cust"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="note">{t("note")}</Label>
            <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          {txType === "sale" && (
            <div className="flex items-center justify-between rounded-xl border border-sky-200/60 bg-sky-50/50 px-3 py-3 dark:border-sky-900/50 dark:bg-sky-950/30">
              <div>
                <p className="text-sm font-medium">{t("requestDelivery")}</p>
                <p className="text-xs text-zinc-500">ZayRide</p>
              </div>
              <Switch checked={wantDelivery} onCheckedChange={setWantDelivery} />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 gap-1 rounded-xl"
              onClick={() => {
                start((text) => {
                  const p = parseVoiceTransaction(text);
                  if (p.amount != null) setAmount(String(p.amount));
                  if (p.product) setProduct(p.product);
                  setTxType(p.type);
                  toast.success(t("success"));
                });
              }}
            >
              <Mic className={`h-4 w-4 ${listening ? "text-red-500" : ""}`} />
              {listening ? t("listening") : t("voiceHint")}
            </Button>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button className="flex-1 rounded-xl" onClick={onSave}>
              {t("save")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      )}

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <p className="text-center text-zinc-500">{t("noTransactions")}</p>
        ) : (
          sorted.map((row, i) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: Math.min(i * 0.06, 0.45),
                type: "spring",
                stiffness: 320,
                damping: 28,
              }}
            >
              <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                <Card className="border-zinc-200/80 p-4 shadow-sm dark:border-zinc-800">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={row.type === "sale" ? "default" : "destructive"}>
                          {t(row.type)}
                        </Badge>
                        <span className="text-lg font-bold tabular-nums">
                          {row.amount.toLocaleString()} {t("birr")}
                        </span>
                      </div>
                      <p className="mt-1 font-medium text-zinc-800 dark:text-zinc-100">
                        {row.product ?? "—"}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {format(new Date(row.createdAt), "MMM d, yyyy HH:mm")}
                        {row.customerName ? ` · ${row.customerName}` : ""}
                      </p>
                      {row.note && (
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{row.note}</p>
                      )}
                    </div>
                    {row.type === "sale" && !partnerView && (
                      <motion.div whileTap={{ scale: 0.94 }}>
                        <Button
                          size="sm"
                          variant="delivery"
                          className="gap-1 rounded-xl"
                          onClick={() => openDeliveryFor(row)}
                        >
                          <Truck className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
