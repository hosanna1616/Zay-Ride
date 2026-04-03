"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ZayRideLogo } from "@/components/brand/zayride-logo";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { TraderLoginPanel } from "@/components/auth/trader-login-panel";
import { cn } from "@/lib/utils";

function LandingInner() {
  const { t } = useTranslation();
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const authHydrated = useAuthHydrated();

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setOrigin(window.location.origin);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const goDashboard = () => {
    router.push("/dashboard");
  };

  const qrValue = origin ? `${origin}/` : "";

  return (
    <div
      className={cn(
        "relative min-h-dvh overflow-hidden",
        "bg-gradient-to-b from-zinc-50 via-white to-emerald-50/35",
        "dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/25"
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.18),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]"
        aria-hidden
      />

      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-4 pt-4 md:px-10 md:pt-6">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-3"
        >
          <ZayRideLogo variant="mark" priority className="scale-90 sm:scale-100" />
        </motion.div>
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <ThemeToggle />
          <LanguageToggle />
        </motion.div>
      </header>

      <AnimatePresence mode="wait">
        {showLogin ? (
          <motion.main
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 mx-auto flex min-h-[calc(100dvh-5rem)] max-w-lg flex-col items-center justify-center px-4 pb-16 pt-4 md:px-6"
          >
            <TraderLoginPanel onSignedIn={goDashboard} onBack={() => setShowLogin(false)} />
          </motion.main>
        ) : (
          <motion.main
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-6 md:flex-row md:items-center md:px-10 md:pt-10"
          >
            <div className="flex-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05, type: "spring", stiffness: 260, damping: 22 }}
                className="flex justify-center md:justify-start"
              >
                <ZayRideLogo variant="wordmark" priority />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, type: "spring", stiffness: 280, damping: 24 }}
                className="text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-left md:text-4xl lg:text-[2.75rem] lg:leading-tight"
              >
                {t("tagline")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 280, damping: 24 }}
                className="max-w-xl text-center text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-left"
              >
                {t("heroSub")}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, type: "spring", stiffness: 280, damping: 22 }}
                className="flex flex-wrap justify-center gap-3 md:justify-start"
              >
                <motion.button
                  type="button"
                  disabled={!authHydrated}
                  whileHover={authHydrated ? { scale: 1.03 } : undefined}
                  whileTap={authHydrated ? { scale: 0.96 } : undefined}
                  onClick={() => {
                    if (!authHydrated) return;
                    setShowLogin(true);
                  }}
                  className={cn(
                    "relative flex items-center gap-2 overflow-hidden rounded-2xl px-8 py-4 text-base font-semibold text-white",
                    "bg-gradient-to-r from-emerald-500 via-emerald-500 to-sky-500",
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.15)_inset,0_4px_28px_-4px_rgba(16,185,129,0.7),0_12px_40px_-8px_rgba(14,165,233,0.5)]",
                    "transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)_inset,0_6px_40px_-2px_rgba(16,185,129,0.8),0_16px_48px_-6px_rgba(14,165,233,0.55)]",
                    "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_4px_36px_-2px_rgba(16,185,129,0.55),0_0_56px_-8px_rgba(14,165,233,0.4)]",
                    !authHydrated && "pointer-events-none opacity-70"
                  )}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t("getStarted")}
                    <ArrowRight className="h-5 w-5" />
                  </span>
                  <span
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20"
                    aria-hidden
                  />
                </motion.button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, type: "spring", stiffness: 260, damping: 22 }}
              className="flex flex-1 flex-col items-center gap-4 md:items-end"
            >
              <div className="rounded-[1.75rem] border border-zinc-200/80 bg-white/90 p-6 shadow-xl shadow-emerald-500/10 backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-900/90 dark:shadow-emerald-500/5">
                <p className="mb-4 text-center text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t("scanQr")}
                </p>
                <div className="flex justify-center rounded-2xl bg-white p-3 dark:bg-zinc-950">
                  {qrValue ? (
                    <QRCodeSVG
                      value={qrValue}
                      size={200}
                      level="M"
                      marginSize={1}
                      className="h-[200px] w-[200px]"
                    />
                  ) : (
                    <div className="flex h-[200px] w-[200px] items-center justify-center text-sm text-zinc-400">
                      …
                    </div>
                  )}
                </div>
                <p className="mt-4 max-w-[220px] text-center text-xs text-zinc-500 dark:text-zinc-500">
                  {t("installPwa")}
                </p>
              </div>
            </motion.div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return <LandingInner />;
}
