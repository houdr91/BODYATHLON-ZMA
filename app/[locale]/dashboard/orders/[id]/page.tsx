import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, MapPin, PackageSearch, StickyNote } from "lucide-react";
import { auth } from "@/lib/auth";
import { getUserOrder } from "@/lib/server-only-db";
import { OrderStatusBadge } from "@/components/dashboard/OrderStatusBadge";
import { OrderTimeline } from "@/components/dashboard/OrderTimeline";
import {
  formatSpanishDate,
  formatEuro,
} from "@/components/dashboard/OrderCard";
import { formatOrderId } from "@/lib/security";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { ProductBottle } from "@/components/ProductBottle";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const [order, t] = await Promise.all([
    getUserOrder(id),
    getTranslations({ locale, namespace: "dashboard.orders" }),
  ]);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Reveal>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 mb-6 gap-2 text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <Link href={`/${locale}/dashboard/orders`}>
            <ArrowLeft className="h-4 w-4" /> {t("backToOrders")}
          </Link>
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-mono text-2xl font-bold text-white sm:text-3xl">
              {formatOrderId(order.id)}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {t("orderDate", { date: formatSpanishDate(order.createdAt) })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <Reveal delay={0.1} className="lg:col-span-3">
          <div className="glass h-full rounded-2xl p-7">
            <h2 className="font-display text-xl tracking-wide text-white">
              {t("orderStatus")}
            </h2>
            <div className="mt-6">
              <OrderTimeline status={order.status} />
            </div>
          </div>
        </Reveal>

        <div className="space-y-6 lg:col-span-2">
          <Reveal delay={0.15}>
            <div className="glass rounded-2xl p-7">
              <div className="flex items-center gap-5">
                <div className="w-16 shrink-0">
                  <ProductBottle className="h-auto w-full" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t("product")}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {t("quantity")} ×{order.quantity}
                  </p>
                </div>
              </div>
              <div className="mt-5 border-t border-white/[0.06] pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t("total")}</span>
                  <span className="text-lg font-bold text-white">
                    {formatEuro(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="glass space-y-4 rounded-2xl p-7 text-sm">
              {order.trackingCode && (
                <div className="flex items-start gap-3">
                  <PackageSearch className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  <div>
                    <p className="font-semibold text-white">{t("trackingCode")}</p>
                    <p className="mt-0.5 font-mono text-slate-400">{order.trackingCode}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <div>
                  <p className="font-semibold text-white">{t("shippingAddress")}</p>
                  <p className="mt-0.5 text-slate-400">
                    {order.shippingAddress ?? t("noAddress")}
                  </p>
                </div>
              </div>
              {order.notes && (
                <div className="flex items-start gap-3">
                  <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  <div>
                    <p className="font-semibold text-white">{t("notes")}</p>
                    <p className="mt-0.5 text-slate-400">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
