"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  Headphones,
  Lock,
  CreditCard,
  Wallet,
  Smartphone,
} from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { ParticlesCanvas } from "@/components/ParticlesCanvas";
import { ProductBottle } from "@/components/ProductBottle";

const COUNTDOWN_KEY = "zma-offer-deadline";
const DAY_MS = 24 * 60 * 60 * 1000;

function useCountdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const getDeadline = (): number => {
      const stored = Number(localStorage.getItem(COUNTDOWN_KEY));
      if (stored && stored > Date.now()) return stored;
      const deadline = Date.now() + DAY_MS;
      localStorage.setItem(COUNTDOWN_KEY, String(deadline));
      return deadline;
    };

    let deadline = getDeadline();
    const tick = () => {
      let diff = deadline - Date.now();
      if (diff <= 0) {
        deadline = Date.now() + DAY_MS;
        localStorage.setItem(COUNTDOWN_KEY, String(deadline));
        diff = DAY_MS;
      }
      setRemaining(diff);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  if (remaining === null) return { hours: "--", minutes: "--", seconds: "--" };
  const hours = String(Math.floor(remaining / 3_600_000)).padStart(2, "0");
  const minutes = String(Math.floor((remaining % 3_600_000) / 60_000)).padStart(2, "0");
  const seconds = String(Math.floor((remaining % 60_000) / 1000)).padStart(2, "0");
  return { hours, minutes, seconds };
}

const PAYMENT_METHODS = [
  { icon: CreditCard, label: "Visa" },
  { icon: CreditCard, label: "Mastercard" },
  { icon: Wallet, label: "PayPal" },
  { icon: Smartphone, label: "Bizum" },
];

export function CTAFinal() {
  const t = useTranslations("cta");
  const { hours, minutes, seconds } = useCountdown();

  const INCLUDED = [
    t("included1"),
    t("included2"),
    t("included3"),
    t("included4"),
  ];

  const TRUST_BADGES = [
    { icon: Lock, label: t("sslBadge") },
    { icon: Truck, label: t("shippingBadge") },
    { icon: Headphones, label: t("supportBadge") },
  ];

  return (
    <section className="relative overflow-hidden bg-dark-400 py-24 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 45%, rgba(22,163,74,0.14), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <ParticlesCanvas density={50} />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.21, 0.65, 0.36, 1] }}
          className="perspective-1000 mx-auto w-40 sm:w-48"
        >
          <div className="rotate-3d glow-green-drop">
            <ProductBottle className="h-auto w-full" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-10 font-display text-5xl leading-tight tracking-wide text-white sm:text-6xl lg:text-7xl"
        >
          {t("title1")} <span className="text-brand-400">{t("title2")}</span>.
          <br />
          {t("title3")} <span className="text-brand-400">{t("title4")}</span>.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <span className="text-2xl text-slate-500 line-through">39,99€</span>
          <span className="font-display text-6xl text-white">34,99€</span>
          <span className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
            -12% Lanzamiento
          </span>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-2"
        >
          {INCLUDED.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-slate-300">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-400" />
              <span className="text-sm">{item}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {t("offerEndsIn")}
          </p>
          <div
            className="mt-3 flex items-center justify-center gap-3 font-display text-4xl text-white"
            role="timer"
            aria-label={`${hours}h ${minutes}m ${seconds}s`}
          >
            <span className="glass min-w-[72px] rounded-xl px-4 py-3">{hours}</span>
            <span className="text-brand-500">:</span>
            <span className="glass min-w-[72px] rounded-xl px-4 py-3">{minutes}</span>
            <span className="text-brand-500">:</span>
            <span className="glass min-w-[72px] rounded-xl px-4 py-3">{seconds}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-10"
        >
          <Button
            asChild
            size="lg"
            className="btn-shimmer glow-green h-16 bg-brand-600 px-10 text-lg font-bold tracking-wide text-white hover:bg-brand-500"
          >
            <Link href="/checkout">{t("button")}</Link>
          </Button>
          <p className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-400">
            <ShieldCheck className="h-4 w-4 text-brand-400" />
            {t("guarantee")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12 space-y-5"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method.label}
                className="glass flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                <method.icon className="h-4 w-4 text-slate-400" />
                {method.label}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            {TRUST_BADGES.map((badge) => (
              <span key={badge.label} className="flex items-center gap-1.5">
                <badge.icon className="h-3.5 w-3.5 text-brand-500" />
                {badge.label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
