"use client";

import { useTranslations } from "next-intl";
import { Clock, CreditCard, Truck, CheckCircle2, XCircle } from "lucide-react";
import type { OrderStatus } from "@/types";

const STATUS_STYLE: Record<
  OrderStatus,
  { className: string; icon: typeof Clock }
> = {
  PENDING: { className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", icon: Clock },
  PAID: { className: "bg-sky-500/10 text-sky-400 border-sky-500/30", icon: CreditCard },
  SHIPPED: { className: "bg-orange-500/10 text-orange-400 border-orange-500/30", icon: Truck },
  DELIVERED: { className: "bg-brand-500/10 text-brand-400 border-brand-500/30", icon: CheckCircle2 },
  CANCELLED: { className: "bg-red-500/10 text-red-400 border-red-500/30", icon: XCircle },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const t = useTranslations("dashboard.orders.statuses");
  const config = STATUS_STYLE[status as OrderStatus] ?? STATUS_STYLE.PENDING;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {t(status as OrderStatus)}
    </span>
  );
}
