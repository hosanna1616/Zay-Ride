"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ZAYRIDE_LOGO_SVG_PATH } from "@/lib/brand";

type ZayRideLogoProps = {
  variant?: "mark" | "wordmark";
  className?: string;
  priority?: boolean;
};

/**
 * Official ZayRide SVG — transparent artwork; hover adds glow and lift.
 * Uses `<img>` so SVG from `/public` works without Image SVG restrictions.
 */
export function ZayRideLogo({
  variant = "wordmark",
  className,
  priority = false,
}: ZayRideLogoProps) {
  const isMark = variant === "mark";

  return (
    <motion.div
      className={cn(
        "group relative shrink-0 overflow-visible rounded-xl bg-transparent",
        isMark
          ? "h-12 w-12 sm:h-14 sm:w-14"
          : "h-14 w-[11.5rem] sm:h-16 sm:w-[14rem] md:h-[8.5rem] md:w-[16.5rem]",
        className
      )}
      initial={false}
      whileHover={{
        scale: 1.05,
        rotate: -1.2,
        transition: { type: "spring", stiffness: 380, damping: 22 },
      }}
      whileTap={{ scale: 0.96 }}
    >
      {/* Hover glow ring */}
      <span
        className={cn(
          "pointer-events-none absolute inset-[-6px] rounded-2xl opacity-0 transition-opacity duration-300",
          "bg-gradient-to-br from-emerald-400/35 via-sky-400/25 to-emerald-500/30 blur-md",
          "group-hover:opacity-100"
        )}
        aria-hidden
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG from /public; next/image SVG constraints */}
      <img
        src={ZAYRIDE_LOGO_SVG_PATH}
        alt="ZayRide"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn(
          "relative z-[1] h-full w-full object-contain object-center",
          "drop-shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-all duration-300",
          "dark:drop-shadow-[0_4px_20px_rgba(16,185,129,0.35)]",
          "group-hover:drop-shadow-[0_6px_24px_rgba(16,185,129,0.45)]",
          "group-hover:dark:drop-shadow-[0_8px_32px_rgba(52,211,153,0.5)]",
          "group-hover:brightness-105 dark:group-hover:brightness-110"
        )}
      />
    </motion.div>
  );
}
