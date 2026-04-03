"use client";

import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Debt, Transaction } from "@/types";
import {
  downloadDebtsCsv,
  downloadProfitPdf,
  downloadTransactionsCsv,
} from "@/lib/export-report";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ExportMenuProps {
  transactions: Transaction[];
  debts: Debt[];
}

export function ExportMenu({ transactions, debts }: ExportMenuProps) {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileTap={{ scale: 0.96 }}>
          <Button variant="outline" size="sm" className="gap-1 rounded-xl">
            <Download className="h-4 w-4" />
            {t("export")}
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            downloadTransactionsCsv(transactions, "zayride-transactions.csv");
            toast.success(t("exportCsv"));
          }}
        >
          {t("transactions")} — {t("exportCsv")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            downloadDebtsCsv(debts, "zayride-debts.csv");
            toast.success(t("exportCsv"));
          }}
        >
          {t("debts")} — {t("exportCsv")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            downloadProfitPdf(transactions, "ZayRide Profit");
            toast.success(t("exportPdf"));
          }}
        >
          {t("exportPdf")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
