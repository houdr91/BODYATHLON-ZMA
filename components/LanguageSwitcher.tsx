"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "@/navigation";
import { routing } from "@/routing";
import { ChevronDown } from "lucide-react";

const LANGUAGES = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
] as const;

type LocaleCode = (typeof routing.locales)[number];

interface LanguageSwitcherProps {
  currentLocale: LocaleCode;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === currentLocale) ?? LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(locale: LocaleCode) {
    localStorage.setItem("preferred-locale", locale);
    router.replace(pathname, { locale });
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white transition-colors hover:border-brand-500/40 hover:bg-white/10"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span aria-hidden="true">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <span className="sm:hidden">{current.code.toUpperCase()}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 min-w-[10rem] overflow-hidden rounded-xl border border-white/10 bg-dark-300/95 py-1 shadow-xl backdrop-blur-md"
          >
            {LANGUAGES.map((lang) => {
              const isActive = lang.code === currentLocale;
              return (
                <li key={lang.code}>
                  <button
                    role="option"
                    aria-selected={isActive}
                    onClick={() => switchLocale(lang.code as LocaleCode)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-brand-600/20 text-brand-400"
                        : "text-slate-300 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <span className="text-base" aria-hidden="true">
                      {lang.flag}
                    </span>
                    <span>{lang.label}</span>
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-400" />
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
