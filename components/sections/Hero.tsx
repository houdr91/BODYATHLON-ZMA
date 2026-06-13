"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Zap, Star, ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { ParticlesCanvas } from "@/components/ParticlesCanvas";
import { ProductBottle } from "@/components/ProductBottle";
import { Stat } from "@/components/Stat";

const lineContainer = {
  hidden: {},
  visible: (lineIndex: number) => ({
    transition: { staggerChildren: 0.035, delayChildren: 0.35 + lineIndex * 0.45 },
  }),
};

const letterVariant = {
  hidden: { opacity: 0, y: 40, rotateX: -60 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.5, ease: [0.21, 0.65, 0.36, 1] as const },
  },
};

export function Hero() {
  const t = useTranslations("hero");

  const HEADLINE_LINES = [t("line1"), t("line2"), t("line3")];

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-dark-400 pt-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 40%, rgba(22,163,74,0.12), transparent 70%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(20,83,45,0.15), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <ParticlesCanvas density={70} />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 120, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.5 }}
          className="order-first mx-auto w-44 sm:w-52 lg:order-last lg:w-80"
        >
          <div className="floating glow-green-drop">
            <ProductBottle priority className="h-auto w-full" />
          </div>
        </motion.div>

        <div className="text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass animate-pulse-soft inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-300"
          >
            <Zap className="h-3.5 w-3.5 fill-brand-400 text-brand-400" />
            {t("badge")}
          </motion.span>

          <h1 className="mt-6 font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] tracking-wide">
            {HEADLINE_LINES.map((line, lineIndex) => (
              <motion.span
                key={lineIndex}
                className="text-gradient-green block"
                variants={lineContainer}
                custom={lineIndex}
                initial="hidden"
                animate="visible"
                aria-label={line}
              >
                {line.split("").map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    variants={letterVariant}
                    className="inline-block"
                    aria-hidden="true"
                  >
                    {char === " " ? " " : char}
                  </motion.span>
                ))}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.7 }}
            className="mx-auto mt-6 max-w-xl text-lg text-slate-400 sm:text-xl lg:mx-0"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 2 }}
            className="mt-6 flex items-center justify-center gap-2 lg:justify-start"
          >
            <span className="flex" aria-label="4,8 de 5 estrellas">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < 4
                      ? "fill-brand-400 text-brand-400"
                      : "fill-brand-400/60 text-brand-400/60"
                  }`}
                />
              ))}
            </span>
            <span className="text-sm text-slate-300">
              <Stat end={4.8} decimals={1} duration={1.6} className="font-bold" />
              {t("ratingText")}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2.2 }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button
              asChild
              size="lg"
              className="btn-shimmer glow-green group h-14 bg-brand-600 px-8 text-base font-bold tracking-wide text-white hover:bg-brand-500"
            >
              <Link href="/checkout">
                {t("cta")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-14 text-slate-300 hover:bg-white/5 hover:text-brand-300"
            >
              <Link href="/#ingredientes">
                {t("ctaSecondary")}
                <ChevronDown className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
        aria-hidden="true"
      >
        <div className="flex h-12 w-7 justify-center rounded-full border-2 border-white/20 pt-2">
          <div className="h-2 w-1 animate-bounce-dot rounded-full bg-brand-400" />
        </div>
      </motion.div>
    </section>
  );
}
