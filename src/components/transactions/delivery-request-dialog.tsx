"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/use-settings-store";
import { useDeliveriesStore } from "@/stores/use-deliveries-store";
import { useTransactionsStore } from "@/stores/use-transactions-store";
import { toast } from "sonner";
import { Truck } from "lucide-react";

interface DeliveryRequestDialogProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  transactionId?: string;
}

/**
 * UI entry point for POST /v1/deliveries — today simulated locally; swap `requestDelivery` impl.
 */
export function DeliveryRequestDialog({
  open,
  onOpenChange,
  transactionId,
}: DeliveryRequestDialogProps) {
  const { t } = useTranslation();
  const shop = useSettingsStore((s) => s.shop);
  const requestDelivery = useDeliveriesStore((s) => s.requestDelivery);
  const linkDelivery = useTransactionsStore((s) => s.linkDelivery);
  const [pickup, setPickup] = useState(shop.pickupAddress);
  const [dropoff, setDropoff] = useState("");

  const onSubmit = () => {
    if (!dropoff.trim()) {
      toast.error(t("dropoff"));
      return;
    }
    const job = requestDelivery({
      transactionId,
      pickupAddress: pickup.trim(),
      dropoffAddress: dropoff.trim(),
    });
    if (transactionId) linkDelivery(transactionId, job.id);
    toast.success(t("deliveryRequested"));
    onOpenChange(false);
    setDropoff("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (o) setPickup(shop.pickupAddress);
        onOpenChange(o);
      }}
    >
      <DialogContent className="gap-4 border-sky-200/50 sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="space-y-4"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/30">
            <Truck className="h-6 w-6" />
          </div>
          <DialogTitle>{t("requestZayRide")}</DialogTitle>
          <div className="space-y-2">
            <Label htmlFor="pickup">{t("pickup")}</Label>
            <Input
              id="pickup"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder={shop.pickupAddress}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dropoff">{t("dropoff")}</Label>
            <Input
              id="dropoff"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="e.g. Bole, near Medhanialem"
            />
          </div>
          <Button variant="delivery" className="w-full rounded-xl" onClick={onSubmit}>
            {t("requestZayRide")}
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
