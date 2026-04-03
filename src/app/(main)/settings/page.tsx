"use client";

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Download, Upload, HardDrive, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSettingsStore } from "@/stores/use-settings-store";
import { toast } from "sonner";
import {
  applyBackup,
  downloadBackupJson,
  parseBackup,
} from "@/lib/backup-restore";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Backup & restore — critical while data is localStorage-only.
 * Replace with cloud sync (`GET/PUT /v1/me/data`) when backend ships.
 */
export default function SettingsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const partnerView = useSettingsStore((s) => s.partnerView);
  const shop = useSettingsStore((s) => s.shop);
  const setShop = useSettingsStore((s) => s.setShop);
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingJson, setPendingJson] = useState<string | null>(null);

  const onPickFile = async (f: File | null) => {
    if (!f) return;
    const text = await f.text();
    try {
      parseBackup(text);
      setPendingJson(text);
      setConfirmOpen(true);
    } catch {
      toast.error(t("backupInvalid"));
    }
  };

  const applyImport = () => {
    if (!pendingJson) return;
    try {
      const b = parseBackup(pendingJson);
      applyBackup(b);
      setConfirmOpen(false);
      setPendingJson(null);
      toast.success(t("backupRestored"));
      window.setTimeout(() => window.location.reload(), 400);
    } catch {
      toast.error(t("backupInvalid"));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold md:text-2xl">{t("settings")}</h1>

      {partnerView ? (
        <Card className="border-sky-200/70 bg-sky-500/5 dark:border-sky-900/50">
          <CardHeader>
            <CardTitle className="text-base">{t("partnerSettingsTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t("partnerSettingsBody")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("shopName")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="sn">{t("shopName")}</Label>
                <Input
                  id="sn"
                  value={shop.name}
                  onChange={(e) => setShop({ name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sp">{t("pickup")}</Label>
                <Input
                  id="sp"
                  value={shop.pickupAddress}
                  onChange={(e) => setShop({ pickupAddress: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ph">{t("phone")}</Label>
                <Input
                  id="ph"
                  value={shop.phone}
                  onChange={(e) => setShop({ phone: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <Card className="border-emerald-200/60 dark:border-emerald-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <HardDrive className="h-5 w-5 text-emerald-600" />
              {t("backupTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t("backupHint")}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                className="gap-2 rounded-xl"
                onClick={() => {
                  downloadBackupJson();
                  toast.success(t("backupExported"));
                }}
              >
                <Download className="h-4 w-4" />
                {t("backupDownload")}
              </Button>
              <Button
                variant="outline"
                className="gap-2 rounded-xl"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                {t("backupRestore")}
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => void onPickFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
        </>
      )}

      <Card className="border-red-200/60 dark:border-red-900/40">
        <CardHeader>
          <CardTitle className="text-base">{t("signOutSection")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="gap-2 rounded-xl border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40"
            onClick={() => {
              logout();
              toast.success(t("signedOut"));
              router.replace("/");
            }}
          >
            <LogOut className="h-4 w-4" />
            {t("signOut")}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogTitle>{t("backupConfirmTitle")}</DialogTitle>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {t("backupConfirmBody")}
          </p>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setConfirmOpen(false)}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" className="flex-1 rounded-xl" onClick={applyImport}>
              {t("backupReplace")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
