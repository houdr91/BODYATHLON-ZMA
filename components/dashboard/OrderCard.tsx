import Link from "next/link";
import type { Order } from "@prisma/client";
import { ArrowRight, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/dashboard/OrderStatusBadge";
import { formatOrderId } from "@/lib/security";

export function formatSpanishDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function OrderCard({ order }: { order: Order }) {
  return (
    <article className="glass group rounded-2xl p-6 transition-all duration-300 hover:border-brand-500/30 hover:shadow-[0_8px_30px_rgba(34,197,94,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-mono text-sm font-bold text-white">
              {formatOrderId(order.id)}
            </h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            {formatSpanishDate(order.createdAt)}
          </p>
        </div>
        <p className="text-lg font-bold text-white">{formatEuro(order.total)}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-4">
        <div className="text-sm text-slate-400">
          <p>
            Bodyathlon ZMA 120 cápsulas ·{" "}
            <span className="text-slate-300">×{order.quantity}</span>
          </p>
          {order.trackingCode && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <PackageSearch className="h-3.5 w-3.5 text-brand-500" />
              Seguimiento:{" "}
              <span className="font-mono text-slate-300">{order.trackingCode}</span>
            </p>
          )}
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-white/15 bg-transparent text-slate-200 hover:border-brand-400 hover:bg-brand-400/10 hover:text-brand-300"
        >
          <Link href={`/dashboard/orders/${order.id}`}>
            Ver detalle
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
