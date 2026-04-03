"use client";

import { motion } from "framer-motion";
import { Check, Package, Search, Truck } from "lucide-react";
import type { DeliveryStatus } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const steps: { status: DeliveryStatus; icon: typeof Search }[] = [
  { status: "searching", icon: Search },
  { status: "assigned", icon: Truck },
  { status: "picked_up", icon: Package },
  { status: "delivered", icon: Check },
];

export function StatusPipeline({ current }: { current: DeliveryStatus }) {
  const { t } = useTranslation();
  const idx = steps.findIndex((s) => s.status === current);

  return (
    <div className="flex w-full items-center">
      {steps.map((step, i) => {
        const active = i <= idx;
        const isCurrent = i === idx;
        const Icon = step.icon;
        const label =
          step.status === "searching"
            ? t("searching")
            : step.status === "assigned"
              ? t("assigned")
              : step.status === "picked_up"
                ? t("picked_up")
                : t("delivered");
        return (
          <div key={step.status} className="flex flex-1 items-center">
            <div className="flex w-full flex-col items-center gap-1">
              <motion.div
                layout
                initial={false}
                animate={{
                  scale: isCurrent ? 1.06 : 1,
                  borderColor: active ? "rgb(16,185,129)" : "rgb(228,228,231)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full border-2 bg-white shadow-sm dark:bg-zinc-900",
                  active ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"
                )}
              >
                <Icon className="h-5 w-5" />
              </motion.div>
              <span className="max-w-[4.5rem] text-center text-[9px] font-semibold uppercase leading-tight text-zinc-500 sm:text-[10px]">
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-0.5 h-0.5 min-w-[8px] flex-1 rounded-full sm:mx-1",
                  i < idx ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
