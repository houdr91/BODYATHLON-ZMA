"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FlaskConical, Leaf, BadgeCheck, Microscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Stat } from "@/components/Stat";

const INGREDIENTS = [
  { key: "zinc", name: "Zinc", dose: "30 mg", vrn: 300, barWidth: 60 },
  { key: "magnesium", name: "Magnesio", dose: "450 mg", vrn: 120, barWidth: 35 },
  { key: "b6", name: "Vitamina B6", dose: "10,5 mg", vrn: 750, barWidth: 100 },
] as const;

const QUALITY_BADGES = [
  { icon: BadgeCheck, label: "GMP Certified" },
  { icon: Microscope, label: "Lab Tested" },
  { icon: FlaskConical, label: "No proprietary blends" },
];

export function Ingredients() {
  const t = useTranslations("ingredients");

  return (
    <section id="ingredientes" className="relative bg-dark-300 py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
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
          <p className="mt-4 text-lg text-slate-400">{t("subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="glass mt-14 overflow-hidden rounded-3xl"
        >
          <div className="border-b border-white/10 bg-brand-950/40 px-6 py-4 sm:px-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-xl tracking-widest text-white">
                {t("perDose")}
              </h3>
              <span className="text-xs uppercase tracking-wider text-slate-400">
                {t("vrn")}
              </span>
            </div>
          </div>

          <div className="divide-y divide-white/5 px-6 sm:px-10">
            {INGREDIENTS.map((ingredient, index) => (
              <div key={ingredient.key} className="py-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="text-lg font-semibold text-white">
                      {ingredient.name}
                    </span>
                    <span className="ml-2 text-sm text-slate-500">
                      ({t(`${ingredient.key}.source`)})
                    </span>
                  </div>
                  <div className="flex items-baseline gap-6">
                    <span className="font-mono text-slate-300">{ingredient.dose}</span>
                    <span className="w-20 text-right font-display text-2xl text-brand-400">
                      <Stat end={ingredient.vrn} suffix="%" duration={1.8} />
                    </span>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5" role="presentation">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${ingredient.barWidth}%` }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 1.4,
                      delay: 0.2 + index * 0.15,
                      ease: [0.21, 0.65, 0.36, 1],
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-700 via-brand-500 to-brand-400"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 px-6 py-6 sm:px-10">
            <p className="text-center text-sm font-medium tracking-wide text-slate-300">
              {t("dietTags")}
            </p>
          </div>
        </motion.div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {QUALITY_BADGES.map((badge, index) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, rotateY: 90 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
            >
              <Badge
                variant="outline"
                className="glass gap-2 border-brand-500/30 px-5 py-2.5 text-sm font-medium text-brand-300"
              >
                <badge.icon className="h-4 w-4" />
                {badge.label}
              </Badge>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, rotateY: 90 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <Badge
              variant="outline"
              className="glass gap-2 border-brand-500/30 px-5 py-2.5 text-sm font-medium text-brand-300"
            >
              <Leaf className="h-4 w-4" />
              {t("vegCapsules")}
            </Badge>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
