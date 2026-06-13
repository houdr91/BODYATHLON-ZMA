import Link from "next/link";
import { redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PackageOpen, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { getUserOrders } from "@/lib/server-only-db";
import { OrderCard } from "@/components/dashboard/OrderCard";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const [orders, t] = await Promise.all([
    getUserOrders(session.user.id),
    getTranslations({ locale, namespace: "dashboard.orders" }),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <Reveal>
        <h1 className="font-display text-4xl tracking-wide text-white">
          {t("title1")} <span className="text-brand-400">{t("title2")}</span>
        </h1>
        <p className="mt-2 text-slate-400">
          {orders.length > 0
            ? `${orders.length} ${orders.length === 1 ? t("subtitleSingle") : t("subtitlePlural")}`
            : t("subtitleEmpty")}
        </p>
      </Reveal>

      {orders.length === 0 ? (
        <Reveal delay={0.1}>
          <div className="glass mt-10 flex flex-col items-center rounded-3xl px-8 py-16 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-600/10">
              <PackageOpen className="h-10 w-10 text-brand-400" />
            </span>
            <h2 className="mt-6 font-display text-3xl tracking-wide text-white">
              {t("emptyTitle")}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-slate-400">{t("emptyDesc")}</p>
            <Button
              asChild
              className="btn-shimmer mt-8 bg-brand-600 font-semibold hover:bg-brand-500"
            >
              <Link href={`/${locale}`}>
                {t("emptyButton")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order, index) => (
            <Reveal key={order.id} delay={0.06 * index} y={24}>
              <OrderCard order={order} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
