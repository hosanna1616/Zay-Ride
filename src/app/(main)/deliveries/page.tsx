"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeliveriesStore } from "@/stores/use-deliveries-store";
import { useSettingsStore } from "@/stores/use-settings-store";
import { StatusPipeline } from "@/components/deliveries/status-pipeline";
import { format } from "date-fns";
import { Phone, Truck, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/** Demo platform fee per completed job (ብር) — replace with real fare data from API. */
const PARTNER_FEE_ESTIMATE = 45;

export default function DeliveriesPage() {
  const { t } = useTranslation();
  const partnerView = useSettingsStore((s) => s.partnerView);
  const deliveries = useDeliveriesStore((s) => s.deliveries);
  const list = [...deliveries].sort(
    (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)
  );
  const delivered = list.filter((d) => d.status === "delivered").length;
  const platformRevenueEst = delivered * PARTNER_FEE_ESTIMATE;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold md:text-2xl">{t("deliveries")}</h1>

      {partnerView && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-3 sm:grid-cols-3"
        >
          <Card className="border-sky-200/60 bg-sky-500/5 dark:border-sky-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                <Truck className="h-4 w-4 text-sky-600" />
                {t("partnerDeliveryJobs")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums text-sky-700 dark:text-sky-300">
                {list.length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-emerald-200/60 bg-emerald-500/5 dark:border-emerald-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-zinc-500">
                {t("partnerDeliveryCompleted")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
                {delivered}
              </p>
            </CardContent>
          </Card>
          <Card className="border-amber-200/60 bg-amber-500/5 dark:border-amber-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                <TrendingUp className="h-4 w-4 text-amber-600" />
                {t("partnerDeliveryRevenueEst")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums text-amber-800 dark:text-amber-200">
                {platformRevenueEst.toLocaleString()} {t("birr")}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {partnerView && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{t("partnerDeliveriesBlurb")}</p>
      )}

      {list.length === 0 ? (
        <p className="text-center text-zinc-500">{t("noDeliveries")}</p>
      ) : (
        <div className="space-y-4">
          {list.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: Math.min(i * 0.07, 0.5),
                type: "spring",
                stiffness: 300,
                damping: 26,
              }}
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <Card className="overflow-hidden border-sky-200/40 shadow-lg shadow-sky-500/5 dark:border-sky-900/40">
                  <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Truck className="h-5 w-5 text-sky-600" />
                        ZayRide #{d.id.slice(0, 8)}
                      </CardTitle>
                      <p className="text-xs text-zinc-500">
                        {format(new Date(d.createdAt), "MMM d, yyyy HH:mm")}
                      </p>
                    </div>
                    <Badge variant="delivery">{t("deliveryStatus")}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <StatusPipeline current={d.status} />
                    {partnerView && d.status === "delivered" && (
                      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        {t("partnerFeeLine", { amount: PARTNER_FEE_ESTIMATE.toLocaleString() })}
                      </p>
                    )}
                    <div className="grid gap-2 rounded-xl bg-zinc-50/90 p-3 text-sm dark:bg-zinc-900/60">
                      <p>
                        <span className="font-semibold text-zinc-600 dark:text-zinc-300">
                          {t("pickup")}:{" "}
                        </span>
                        {d.pickupAddress}
                      </p>
                      <p>
                        <span className="font-semibold text-zinc-600 dark:text-zinc-300">
                          {t("dropoff")}:{" "}
                        </span>
                        {d.dropoffAddress}
                      </p>
                    </div>
                    {d.driver && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="rounded-xl border border-emerald-200/60 bg-emerald-50/60 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/30"
                      >
                        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                          {t("driver")}: {d.driver.name}
                        </p>
                        <p className="flex items-center gap-1 text-sm text-zinc-700 dark:text-zinc-200">
                          <Phone className="h-4 w-4" />
                          {d.driver.phone} · {d.driver.vehicle} · {d.driver.plate}
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
