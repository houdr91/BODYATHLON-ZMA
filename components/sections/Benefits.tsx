"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  MoonStar,
  Dumbbell,
  Zap,
  Brain,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { staggerContainer, staggerItem } from "@/components/Reveal";

const BENEFIT_ICONS = [
  { icon: MoonStar, key: "sleep" },
  { icon: Dumbbell, key: "recovery" },
  { icon: Zap, key: "energy" },
  { icon: Brain, key: "mental" },
  { icon: Activity, key: "hormones" },
  { icon: ShieldCheck, key: "immune" },
] as const;

const HEX_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 4 L52 18 L52 46 L28 60 L4 46 L4 18 Z' fill='none' stroke='%2322c55e' stroke-opacity='0.06' stroke-width='1'/%3E%3C/svg%3E\")";

export function Benefits() {
  const t = useTranslations("benefits");

  return (
    <section
      id="beneficios"
      className="relative overflow-hidden py-24 lg:py-32"
      style={{
        background:
          "linear-gradient(180deg, #0f0f0f 0%, #0a120c 50%, #0f0f0f 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: HEX_PATTERN }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-400">
            {t("badge")}
          </span>
          <h2 className="mt-3 font-display text-5xl tracking-wide text-white sm:text-6xl">
            {t("title1")} <span className="text-brand-400">{t("title2")}</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">{t("subtitle")}</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {BENEFIT_ICONS.map((benefit) => (
            <motion.article
              key={benefit.key}
              variants={staggerItem}
              className="glass group cursor-default rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-brand-500/40 hover:shadow-[0_16px_50px_rgba(34,197,94,0.18)]"
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-600/15 text-brand-400 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                <benefit.icon className="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-display text-2xl leading-tight tracking-wide text-white">
                {t(`${benefit.key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {t(`${benefit.key}.description`)}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
