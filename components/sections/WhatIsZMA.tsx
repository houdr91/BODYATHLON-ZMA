"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Hexagon, Moon, Brain } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Stat } from "@/components/Stat";
import { staggerContainer, staggerItem } from "@/components/Reveal";

const MINERAL_ICONS = [
  { icon: Hexagon, color: "text-sky-400", bg: "bg-sky-400/10", key: "zinc" },
  { icon: Moon, color: "text-brand-400", bg: "bg-brand-400/10", key: "magnesio" },
  { icon: Brain, color: "text-yellow-400", bg: "bg-yellow-400/10", key: "b6" },
] as const;

export function WhatIsZMA() {
  const t = useTranslations("whatiszma");
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const animation = gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      {
        scaleX: 1,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: { trigger: lineRef.current, start: "top 85%" },
      }
    );
    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, []);

  return (
    <section id="que-es-zma" className="relative bg-dark-200 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-2">
          <div>
            <motion.h2
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
              className="font-display text-5xl tracking-wide text-white sm:text-6xl lg:text-7xl"
            >
              {t("title").split("ZMA").map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>
                    {part}
                    <span className="text-brand-400">ZMA</span>
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </motion.h2>

            <div ref={lineRef} className="mt-6 h-1 w-32 rounded-full bg-brand-500" />

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 text-lg leading-relaxed text-slate-400"
            >
              {t("description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="glass mt-10 rounded-2xl p-6"
            >
              <p className="text-lg text-slate-300">
                El{" "}
                <span className="font-display text-5xl text-brand-400">
                  <Stat end={80} suffix="%" duration={2} />
                </span>{" "}
                {t("statLabel")}
              </p>
            </motion.div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col gap-5"
          >
            {MINERAL_ICONS.map((mineral) => (
              <motion.article
                key={mineral.key}
                variants={staggerItem}
                className="glass group rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-[0_10px_40px_rgba(34,197,94,0.15)]"
              >
                <div className="flex items-center gap-5">
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${mineral.bg} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <mineral.icon className={`h-7 w-7 ${mineral.color}`} />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl tracking-wide text-white">
                      {t(`${mineral.key}.name`)}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {t(`${mineral.key}.desc`)}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
