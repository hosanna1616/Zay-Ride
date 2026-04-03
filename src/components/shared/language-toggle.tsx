"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";

export function LanguageToggle() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
          <Button variant="outline" size="icon" className="rounded-xl" aria-label={t("language")}>
            <Languages className="h-5 w-5" />
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => void i18n.changeLanguage("en")}>
          {t("english")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => void i18n.changeLanguage("am")}>
          {t("amharic")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
