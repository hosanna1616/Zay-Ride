"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Receipt,
  HandCoins,
  Truck,
  Settings,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/stores/use-settings-store";
import { Badge } from "@/components/ui/badge";
import { ZayRideLogo } from "@/components/brand/zayride-logo";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/transactions", key: "transactions", icon: Receipt },
  { href: "/debts", key: "debts", icon: HandCoins },
  { href: "/deliveries", key: "deliveries", icon: Truck },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const partnerView = useSettingsStore((s) => s.partnerView);
  const setPartnerView = useSettingsStore((s) => s.setPartnerView);

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-zinc-50 via-white to-emerald-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/20">
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2 px-4 py-3 md:max-w-4xl">
          <Link href="/dashboard" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="sm:hidden">
              <ZayRideLogo variant="mark" priority />
            </span>
            <span className="hidden sm:block">
              <ZayRideLogo variant="wordmark" priority />
            </span>
            {partnerView && (
              <Badge variant="delivery" className="hidden shrink-0 text-[10px] sm:inline-flex">
                Partner
              </Badge>
            )}
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link href="/settings">
              <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "rounded-xl",
                    pathname === "/settings" && "border-emerald-500 bg-emerald-500/10"
                  )}
                  aria-label={t("settings")}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <div className="hidden items-center gap-2 sm:flex">
              <Label htmlFor="partner" className="text-xs text-zinc-500">
                {partnerView ? t("partnerView") : t("traderView")}
              </Label>
              <Switch
                id="partner"
                checked={partnerView}
                onCheckedChange={setPartnerView}
              />
            </div>
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-zinc-100 px-4 py-2 sm:hidden dark:border-zinc-800">
          <Label htmlFor="partner-m" className="text-xs">
            {t("partnerView")}
          </Label>
          <Switch
            id="partner-m"
            checked={partnerView}
            onCheckedChange={setPartnerView}
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-3 pb-24 pt-4 md:max-w-4xl md:px-6 md:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname + (partnerView ? "-p" : "")}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200/90 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl dark:border-zinc-800 dark:bg-zinc-950/95 md:hidden">
        <div className="mx-auto flex max-w-lg justify-around px-2 py-2">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <motion.div
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-medium",
                    active
                      ? "text-emerald-600"
                      : "text-zinc-500 dark:text-zinc-400"
                  )}
                  whileTap={{ scale: 0.94 }}
                >
                  <Icon className="h-5 w-5" />
                  {t(item.key)}
                  {active && (
                    <motion.div
                      layoutId="navdot"
                      className="h-1 w-6 rounded-full bg-emerald-500"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      <nav className="sticky bottom-0 z-30 mx-auto mt-auto hidden w-full max-w-4xl pb-6 pt-4 md:block">
        <div className="flex justify-center gap-2 rounded-2xl border border-zinc-200 bg-white/90 p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900/90">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <motion.span
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium",
                    active
                      ? "bg-emerald-500 text-white shadow-md"
                      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon className="h-4 w-4" />
                  {t(item.key)}
                </motion.span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
