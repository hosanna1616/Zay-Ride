"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  getMockPrimaryEmail,
  getMockPrimaryPassword,
} from "@/lib/mock-auth";
import { cn } from "@/lib/utils";

type TraderLoginPanelProps = {
  onSignedIn: () => void;
  onBack: () => void;
  className?: string;
};

export function TraderLoginPanel({
  onSignedIn,
  onBack,
  className,
}: TraderLoginPanelProps) {
  const { t } = useTranslation();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setEmail("");
      setPassword("");
      setError(false);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    if (login(email, password)) {
      onSignedIn();
    } else {
      setError(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className={cn("mx-auto w-full max-w-md", className)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl p-[1px]",
          "bg-gradient-to-br from-emerald-400 via-sky-400 to-emerald-600",
          "shadow-[0_0_0_1px_rgba(16,185,129,0.35),0_0_50px_-8px_rgba(16,185,129,0.65),0_0_80px_-20px_rgba(14,165,233,0.45)]",
          "dark:shadow-[0_0_0_1px_rgba(52,211,153,0.4),0_0_60px_-6px_rgba(16,185,129,0.5),0_0_100px_-25px_rgba(14,165,233,0.35)]"
        )}
      >
        <div className="relative rounded-[1.4rem] bg-white/95 px-6 py-7 backdrop-blur-xl dark:bg-zinc-900/95">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/25 blur-3xl dark:bg-emerald-500/20"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-500/15"
            aria-hidden
          />

          <div className="relative mb-6 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 text-white shadow-lg shadow-emerald-500/40">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">{t("signInTitle")}</h2>
          </div>

          <form onSubmit={submit} className="relative space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="landing-login-email">{t("email")}</Label>
              <Input
                id="landing-login-email"
                type="email"
                autoComplete="email"
                placeholder={getMockPrimaryEmail()}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "rounded-xl border-zinc-200 bg-white/90 shadow-inner transition-shadow",
                  "focus-visible:border-emerald-500/60 focus-visible:ring-2 focus-visible:ring-emerald-400/50",
                  "dark:border-zinc-700 dark:bg-zinc-950/80",
                  "focus-visible:shadow-[0_0_24px_-4px_rgba(16,185,129,0.45)]"
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="landing-login-pass">{t("password")}</Label>
              <Input
                id="landing-login-pass"
                type="password"
                autoComplete="current-password"
                placeholder={getMockPrimaryPassword()}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "rounded-xl border-zinc-200 bg-white/90 shadow-inner transition-shadow",
                  "focus-visible:border-sky-500/60 focus-visible:ring-2 focus-visible:ring-sky-400/50",
                  "dark:border-zinc-700 dark:bg-zinc-950/80",
                  "focus-visible:shadow-[0_0_24px_-4px_rgba(14,165,233,0.45)]"
                )}
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {t("signInError")}
              </p>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative w-full overflow-hidden rounded-2xl py-3.5 text-base font-semibold text-white",
                "bg-gradient-to-r from-emerald-500 via-emerald-500 to-sky-500",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.15)_inset,0_4px_24px_-4px_rgba(16,185,129,0.65),0_8px_32px_-8px_rgba(14,165,233,0.45)]",
                "transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)_inset,0_6px_36px_-2px_rgba(16,185,129,0.75),0_12px_40px_-6px_rgba(14,165,233,0.55)]",
                "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_4px_32px_-2px_rgba(16,185,129,0.5),0_0_48px_-8px_rgba(14,165,233,0.35)]"
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {t("signInCta")}
                <ArrowRight className="h-5 w-5" />
              </span>
              <span
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/0 via-white/25 to-white/0 opacity-40"
                aria-hidden
              />
            </motion.button>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 py-2 text-center text-sm text-zinc-500 underline-offset-4 hover:text-zinc-800 hover:underline dark:hover:text-zinc-300"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
              {t("backToHome")}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
