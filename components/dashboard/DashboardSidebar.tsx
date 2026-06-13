"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link, usePathname } from "@/navigation";
import {
  LayoutDashboard,
  Package,
  User,
  Lock,
  Bell,
  ShieldCheck,
} from "lucide-react";

export interface SidebarUser {
  name: string | null;
  email: string;
}

const NAV_ITEMS = [
  { href: "/dashboard" as const, key: "overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/orders" as const, key: "orders", icon: Package, exact: false },
  { href: "/dashboard/settings/profile" as const, key: "profile", icon: User, exact: true },
  { href: "/dashboard/settings/security" as const, key: "security", icon: Lock, exact: true },
  { href: "/dashboard/settings/notifications" as const, key: "notifications", icon: Bell, exact: true },
  { href: "/dashboard/settings/privacy" as const, key: "privacy", icon: ShieldCheck, exact: true },
] as const;

export function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]!.toUpperCase())
      .join("");
  }
  return email?.[0]?.toUpperCase() ?? "U";
}

interface DashboardSidebarProps {
  user: SidebarUser;
  onNavigate?: () => void;
  inDrawer?: boolean;
}

export function DashboardSidebar({
  user,
  onNavigate,
  inDrawer = false,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("dashboard.sidebar");

  return (
    <motion.aside
      initial={inDrawer ? false : { x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.21, 0.65, 0.36, 1] }}
      className={`flex h-full flex-col border-r border-white/[0.06] bg-dark-100 ${
        inDrawer ? "w-full" : "w-16 lg:w-[260px]"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-white/[0.06] px-4 lg:justify-start">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Bodyathlon ZMA"
        >
          <span className="rounded-md bg-brand-600 px-1.5 py-0.5 font-display text-sm tracking-widest text-white">
            ZMA
          </span>
          <span
            className={`font-display text-lg tracking-wider text-white ${
              inDrawer ? "" : "hidden lg:inline"
            }`}
          >
            BODY<span className="text-brand-400">ATHLON</span>
          </span>
        </Link>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4 lg:px-3">
        {NAV_ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const label = t(item.key);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={label}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                active
                  ? "bg-brand-600/15 text-white"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              }`}
            >
              {active && (
                <motion.span
                  layoutId={inDrawer ? "sidebar-active-drawer" : "sidebar-active"}
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-500"
                />
              )}
              <item.icon
                className={`h-5 w-5 shrink-0 ${
                  active ? "text-brand-400" : "text-slate-500 group-hover:text-slate-300"
                }`}
              />
              <span className={inDrawer ? "" : "hidden lg:inline"}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Usuario */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
            {getInitials(user.name, user.email)}
          </span>
          <div className={`min-w-0 ${inDrawer ? "" : "hidden lg:block"}`}>
            <p className="truncate text-sm font-medium text-white">
              {user.name ?? t("athlete")}
            </p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
