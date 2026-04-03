"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeliveriesStore } from "@/stores/use-deliveries-store";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Bike } from "lucide-react";

/**
 * ZayRide partner snapshot — wire to `GET /partner/analytics` for live aggregates.
 */
export function PartnerDashboard() {
  const { t } = useTranslation();
  const deliveries = useDeliveriesStore((s) => s.deliveries);
  const delivered = deliveries.filter((d) => d.status === "delivered").length;
  const activeTraders = 128 + deliveries.length * 3;
  const revenueLift = delivered * 45 + deliveries.length * 12;

  const list = deliveries.slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: t("activeTraders"),
            value: activeTraders.toLocaleString(),
            tone: "text-sky-600 dark:text-sky-300",
          },
          {
            label: t("deliveryRequests"),
            value: deliveries.length.toLocaleString(),
            tone: "text-emerald-600 dark:text-emerald-300",
          },
          {
            label: `${t("revenueLift")} (${t("birr")})`,
            value: revenueLift.toLocaleString(),
            tone: "text-amber-700 dark:text-amber-200",
          },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 320, damping: 28 }}
          >
            <Card className="overflow-hidden border-sky-200/50 dark:border-sky-900/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold tabular-nums ${item.tone}`}>{item.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bike className="h-5 w-5 text-sky-600" />
            {t("recentDeliveries")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {list.length === 0 ? (
            <p className="text-sm text-zinc-500">{t("noDeliveries")}</p>
          ) : (
            list.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div>
                  <p className="font-medium text-zinc-800 dark:text-zinc-100">
                    {d.dropoffAddress.slice(0, 42)}
                    {d.dropoffAddress.length > 42 ? "…" : ""}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {format(new Date(d.createdAt), "MMM d, HH:mm")}
                  </p>
                </div>
                <Badge variant="delivery">
                  {d.status === "searching"
                    ? t("searching")
                    : d.status === "assigned"
                      ? t("assigned")
                      : d.status === "picked_up"
                        ? t("picked_up")
                        : t("delivered")}
                </Badge>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
