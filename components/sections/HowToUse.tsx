"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Pill, GlassWater, CalendarCheck } from "lucide-react";
import { staggerContainer, staggerItem } from "@/components/Reveal";

const STEP_ICONS = [
  { icon: Pill, key: "step1" },
  { icon: GlassWater, key: "step2" },
  { icon: CalendarCheck, key: "step3" },
] as const;

export function HowToUse() {
  const t = useTranslations("howtouse");

  return (
    <section id="como-usarlo" className="relative bg-dark-200 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-400">
            {t("badge")}
          </span>
          <h2 className="mt-3 font-display text-5xl tracking-wide text-white sm:text-6xl">
            {t("title1")} <span className="text-brand-400">{t("title2")}</span>
          </h2>
        </motion.div>

        <div className="relative mt-20">
          <div className="absolute left-0 right-0 top-10 hidden h-0.5 bg-white/10 md:block">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.6, ease: "easeInOut", delay: 0.3 }}
              className="h-full origin-left bg-gradient-to-r from-brand-700 via-brand-500 to-brand-400"
            />
          </div>

          <motion.ol
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-12 md:grid-cols-3 md:gap-8"
          >
            {STEP_ICONS.map((s) => (
              <motion.li
                key={s.key}
                variants={staggerItem}
                className="relative text-center"
              >
                <span className="glass relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full border-brand-500/40 bg-dark-100">
                  <s.icon className="h-9 w-9 text-brand-400" />
                </span>
                <span className="mt-5 block text-xs font-bold uppercase tracking-[0.3em] text-brand-500">
                  {t(`${s.key}.step`)}
                </span>
                <h3 className="mt-2 font-display text-2xl tracking-wide text-white">
                  {t(`${s.key}.title`)}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-slate-400">
                  {t(`${s.key}.description`)}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mx-auto mt-16 max-w-2xl text-center text-xs leading-relaxed text-slate-600"
        >
          {t("disclaimer")}
        </motion.p>
      </div>
    </section>
  );
}
