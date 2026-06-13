"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Quote } from "lucide-react";

const FEATURED = [
  {
    name: "Carlos M.",
    sport: "Crossfitter",
    text: "Llevaba meses durmiendo fatal después de los WODs. Con ZMA llevo 2 meses durmiendo del tirón y notando la diferencia en los entrenos. Sin vuelta atrás.",
  },
  {
    name: "Marta R.",
    sport: "Triatleta amateur",
    text: "Escéptica al principio. Ahora forma parte de mi rutina nocturna para siempre. La recuperación entre sesiones es otra cosa.",
  },
  {
    name: "Adrián L.",
    sport: "Powerlifter",
    text: "El sueño profundo que da este suplemento es brutal. Me despierto con las piernas sin agujetas. 120 cápsulas dan para 40 días y merece absolutamente la pena.",
  },
];

const MARQUEE_ITEMS = [
  { name: "Sara G.", sport: "Corredora de montaña", text: "Mi nutricionista me lo recomendó y no me ha defraudado." },
  { name: "Carlos M.", sport: "Crossfitter", text: "Durmiendo del tirón después de cada WOD. Sin vuelta atrás." },
  { name: "Marta R.", sport: "Triatleta", text: "La recuperación entre sesiones es otra cosa." },
  { name: "Adrián L.", sport: "Powerlifter", text: "Me despierto con las piernas sin agujetas." },
  { name: "Javi P.", sport: "Culturista", text: "El básico más infravalorado de mi stack nocturno." },
  { name: "Lucía F.", sport: "Nadadora", text: "Zinc + Magnesio es lo que más nos falta a los de resistencia." },
];

function Stars() {
  return (
    <span className="flex gap-0.5" aria-label="5 de 5 estrellas">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-brand-400 text-brand-400" />
      ))}
    </span>
  );
}

export function Testimonials() {
  const t = useTranslations("testimonials");
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const yLeft = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yCenter = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const yRight = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const parallaxValues = [yLeft, yCenter, yRight];

  return (
    <section
      id="opiniones"
      ref={sectionRef}
      className="relative overflow-hidden bg-dark-300 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {FEATURED.map((testimonial, index) => (
            <motion.figure
              key={testimonial.name}
              style={{ y: parallaxValues[index] }}
              className="glass relative rounded-2xl p-8"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-brand-500/20" aria-hidden="true" />
              <Stars />
              <blockquote className="mt-4 text-sm leading-relaxed text-slate-300">
                &ldquo;{testimonial.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/20 text-sm font-bold text-brand-300">
                  {testimonial.name[0]}
                </span>
                <div>
                  <span className="block text-sm font-semibold text-white">{testimonial.name}</span>
                  <span className="block text-xs text-slate-500">{testimonial.sport}</span>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>

      <div className="relative mt-16 overflow-hidden py-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-dark-300 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-dark-300 to-transparent" aria-hidden="true" />
        <div className="marquee-track gap-5">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
            <div
              key={index}
              className="glass w-80 shrink-0 rounded-xl p-5"
              aria-hidden={index >= MARQUEE_ITEMS.length}
            >
              <Stars />
              <p className="mt-3 text-sm text-slate-300">&ldquo;{item.text}&rdquo;</p>
              <p className="mt-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-300">{item.name}</span> · {item.sport}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
