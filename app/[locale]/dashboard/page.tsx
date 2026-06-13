import Link from "next/link";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import {
  Package,
  CalendarCheck,
  ShieldCheck,
  ArrowRight,
  Bell,
  User,
  Lock,
} from "lucide-react";
import { auth } from "@/lib/auth";
import {
  getCurrentUser,
  getUserOrders,
  getUserNotifications,
} from "@/lib/server-only-db";
import { Reveal } from "@/components/Reveal";
import { OrderStatusBadge } from "@/components/dashboard/OrderStatusBadge";
import { formatSpanishDate } from "@/components/dashboard/OrderCard";

export default async function DashboardOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const [user, orders, notifications, t] = await Promise.all([
    getCurrentUser(),
    getUserOrders(session.user.id),
    getUserNotifications(3),
    getTranslations({ locale, namespace: "dashboard.overview" }),
  ]);
  if (!user) redirect("/logout");

  const lastOrder = orders[0];

  const QUICK_LINKS = [
    {
      href: `/${locale}/dashboard/orders`,
      label: t("quickOrders"),
      description: t("quickOrdersDesc"),
      icon: Package,
    },
    {
      href: `/${locale}/dashboard/settings/profile`,
      label: t("quickProfile"),
      description: t("quickProfileDesc"),
      icon: User,
    },
    {
      href: `/${locale}/dashboard/settings/security`,
      label: t("quickSecurity"),
      description: t("quickSecurityDesc"),
      icon: Lock,
    },
    {
      href: `/${locale}/dashboard/settings/notifications`,
      label: t("quickNotifications"),
      description: t("quickNotificationsDesc"),
      icon: Bell,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <Reveal>
        <h1 className="font-display text-4xl tracking-wide text-white sm:text-5xl">
          HOLA, <span className="text-brand-400">{user.name?.toUpperCase() ?? "ATLETA"}</span>
        </h1>
        <p className="mt-2 text-slate-400">{t("welcomeText")}</p>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal delay={0.05}>
          <div className="glass h-full rounded-2xl p-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Package className="h-4 w-4 text-brand-400" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {t("ordersLabel")}
              </span>
            </div>
            <p className="mt-3 font-display text-5xl text-white">{orders.length}</p>
            {lastOrder ? (
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                {t("lastOrder")} <OrderStatusBadge status={lastOrder.status} />
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-500">{t("noOrders")}</p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="glass h-full rounded-2xl p-6">
            <div className="flex items-center gap-2 text-slate-400">
              <CalendarCheck className="h-4 w-4 text-brand-400" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {t("memberLabel")}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">
              {formatSpanishDate(user.createdAt)}
            </p>
            <p className="mt-3 text-xs text-slate-500">{t("memberNote")}</p>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="glass h-full rounded-2xl p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="h-4 w-4 text-brand-400" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {t("lastAccessLabel")}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">
              {user.lastLoginAt ? formatSpanishDate(user.lastLoginAt) : "—"}
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-brand-400">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              {t("secure")}
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <h2 className="font-display text-2xl tracking-wide text-white">
          {t("quickTitle")}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="glass group rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/40"
            >
              <link.icon className="h-5 w-5 text-brand-400" />
              <p className="mt-3 text-sm font-semibold text-white">{link.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{link.description}</p>
            </Link>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <h2 className="font-display text-2xl tracking-wide text-white">
          {t("notificationsTitle")}
        </h2>
        <div className="mt-4 space-y-3">
          {notifications.length === 0 ? (
            <p className="glass rounded-xl p-6 text-sm text-slate-500">
              {t("noNotifications")}
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`glass flex items-start gap-4 rounded-xl p-5 ${
                  notification.read ? "opacity-60" : ""
                }`}
              >
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    notification.read ? "bg-slate-600" : "bg-brand-400"
                  }`}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{notification.title}</p>
                  <p className="mt-0.5 text-sm text-slate-400">{notification.message}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    {formatSpanishDate(notification.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <Link
          href={`/${locale}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          {t("backToStore")}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </div>
  );
}
