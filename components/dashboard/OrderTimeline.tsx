"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  CreditCard,
  PackageOpen,
  Truck,
  Home,
  XCircle,
} from "lucide-react";
import type { OrderStatus } from "@/types";

const TIMELINE_STEPS = [
  { key: "received", label: "Pedido recibido", icon: ClipboardCheck },
  { key: "paid", label: "Pago confirmado", icon: CreditCard },
  { key: "preparing", label: "En preparación", icon: PackageOpen },
  { key: "shipped", label: "Enviado", icon: Truck },
  { key: "delivered", label: "Entregado", icon: Home },
] as const;

// Hasta qué paso (índice) ha llegado cada estado
const STATUS_PROGRESS: Record<OrderStatus, number> = {
  PENDING: 0,
  PAID: 2, // pago confirmado implica "en preparación"
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: -1,
};

export function OrderTimeline({ status }: { status: string }) {
  const progress = STATUS_PROGRESS[status as OrderStatus] ?? 0;

  if (progress === -1) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-5">
        <XCircle className="h-6 w-6 shrink-0 text-red-400" />
        <div>
          <p className="font-semibold text-red-300">Pedido cancelado</p>
          <p className="text-sm text-red-400/70">
            Este pedido fue cancelado. Si tienes dudas, contacta con soporte.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ol className="relative space-y-0">
      {TIMELINE_STEPS.map((step, index) => {
        const done = index <= progress;
        const isLast = index === TIMELINE_STEPS.length - 1;
        const isCurrent = index === progress;
        return (
          <li key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Línea conectora */}
            {!isLast && (
              <span
                className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 bg-white/10"
                aria-hidden="true"
              >
                {index < progress && (
                  <motion.span
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 * index }}
                    className="block h-full w-full origin-top bg-brand-500"
                  />
                )}
              </span>
            )}
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.12 * index }}
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                done
                  ? "border-brand-500/50 bg-brand-600/20 text-brand-400"
                  : "border-white/10 bg-dark-100 text-slate-600"
              } ${isCurrent ? "ring-2 ring-brand-500/30" : ""}`}
            >
              <step.icon className="h-[18px] w-[18px]" />
            </motion.span>
            <div className="pt-2">
              <p
                className={`text-sm font-semibold ${
                  done ? "text-white" : "text-slate-500"
                }`}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p className="mt-0.5 text-xs text-brand-400">Estado actual</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
