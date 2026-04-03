"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/use-settings-store";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export function ProTeaserModal() {
  const { t } = useTranslation();
  const hasSeen = useSettingsStore((s) => s.hasSeenProTeaser);
  const mark = useSettingsStore((s) => s.markProTeaserSeen);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hasSeen) return;
    const id = window.setTimeout(() => setOpen(true), 2400);
    return () => window.clearTimeout(id);
  }, [hasSeen]);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setOpen(false);
          mark();
        }
      }}
    >
      <DialogContent className="border-emerald-200/60 bg-gradient-to-b from-white to-emerald-50/40 dark:from-zinc-900 dark:to-emerald-950/30">
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="flex flex-col gap-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
            <Sparkles className="h-7 w-7" />
          </div>
          <DialogTitle className="text-2xl font-bold">{t("proTitle")}</DialogTitle>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {t("proBody")}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                mark();
              }}
            >
              {t("maybeLater")}
            </Button>
            <Button
              onClick={() => {
                mark();
                setOpen(false);
                toast.success(t("proCta"));
              }}
            >
              {t("proCta")}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
