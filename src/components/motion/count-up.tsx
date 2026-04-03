"use client";

import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";

export function CountUp({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const mv = useMotionValue(0);
  const [text, setText] = useState("0");

  useMotionValueEvent(mv, "change", (v) => {
    setText(Math.round(v).toLocaleString());
  });

  useEffect(() => {
    const c = animate(mv, value, {
      type: "spring",
      stiffness: 120,
      damping: 18,
      mass: 0.85,
    });
    return () => c.stop();
  }, [value, mv]);

  return <span className={className}>{text}</span>;
}
