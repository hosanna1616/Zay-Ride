"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n/client";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { bootstrapDemoData } from "@/lib/bootstrap-demo";
import { ThemeProvider } from "@/components/layout/theme-provider";

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="bottom-center"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-zinc-200 bg-white/95 shadow-xl backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95",
        },
      }}
      offset={80}
      richColors
    />
  );
}

function Bootstrap() {
  useEffect(() => {
    bootstrapDemoData();
  }, []);
  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <Bootstrap />
        {children}
        <ThemedToaster />
      </I18nextProvider>
    </ThemeProvider>
  );
}
