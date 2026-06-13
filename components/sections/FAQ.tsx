"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export function FAQ() {
  const t = useTranslations("faq");

  return (
    <section id="faq" className="relative bg-dark-200 py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {FAQ_KEYS.map((key, index) => (
              <AccordionItem
                key={key}
                value={`faq-${index}`}
                className="glass rounded-xl border-white/10 px-6 data-[state=open]:border-brand-500/40"
              >
                <AccordionTrigger className="cursor-pointer py-5 text-left text-base font-medium text-white hover:text-brand-300 hover:no-underline">
                  {t(key)}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-slate-400">
                  {t(key.replace("q", "a") as "a1" | "a2" | "a3" | "a4" | "a5" | "a6")}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
