"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Menu, X, User, Package, Settings, LogOut, ChevronDown } from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Locale } from "@/routing";

function getInitials(name?: string | null, email?: string | null): string {
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

export function Navbar() {
  const { data: session, status } = useSession();
  const { scrollY } = useScroll();
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => setScrolled(latest > 40));
  }, [scrollY]);

  const NAV_LINKS = [
    { href: "/#beneficios", label: t("benefits") },
    { href: "/#ingredientes", label: t("ingredients") },
    { href: "/#opiniones", label: t("testimonials") },
    { href: "/#faq", label: t("faq") },
  ];

  const USER_MENU_ITEMS = [
    {
      label: t("myAccount"),
      href: "/dashboard" as const,
      icon: User,
      description: t("myAccountDesc"),
    },
    {
      label: t("myOrders"),
      href: "/dashboard/orders" as const,
      icon: Package,
      description: t("myOrdersDesc"),
    },
    {
      label: t("settings"),
      href: "/dashboard/settings/profile" as const,
      icon: Settings,
      description: t("settingsDesc"),
    },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass bg-black/60 py-3 shadow-lg shadow-black/40"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2"
          aria-label="Bodyathlon ZMA"
        >
          <span className="font-display text-2xl tracking-wider text-white">
            BODY<span className="text-brand-400">ATHLON</span>
          </span>
          <span className="rounded-md bg-brand-600 px-2 py-0.5 font-display text-sm tracking-widest text-white transition-colors group-hover:bg-brand-500">
            ZMA
          </span>
        </Link>

        {/* Links desktop */}
        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-slate-300 transition-colors duration-200 hover:text-brand-400"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Acciones desktop */}
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher currentLocale={locale} />

          {status === "authenticated" && session.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-white/5"
                  aria-label={t("myAccount")}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {getInitials(session.user.name, session.user.email)}
                  </span>
                  <span className="max-w-[120px] truncate text-sm text-slate-200">
                    {session.user.name ?? session.user.email}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="glass w-52 border-white/10 bg-black/80"
              >
                <DropdownMenuLabel className="text-slate-300">
                  {t("myAccount")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {USER_MENU_ITEMS.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    asChild
                    className="cursor-pointer gap-2.5 text-slate-200 focus:bg-brand-600/20 focus:text-white"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 text-brand-400" />
                      <span className="flex flex-col">
                        <span>{item.label}</span>
                        <span className="text-xs text-slate-500">{item.description}</span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-red-400 focus:bg-red-500/15 focus:text-red-300"
                  onClick={() => signOut({ callbackUrl: `/${locale}` })}
                >
                  <LogOut className="h-4 w-4" /> {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:border-brand-400 hover:bg-brand-400/10 hover:text-brand-300"
            >
              <Link href="/login">{t("login")}</Link>
            </Button>
          )}
          <Button
            asChild
            className="btn-shimmer bg-brand-600 font-semibold text-white hover:bg-brand-500"
          >
            <Link href="/checkout">{t("buy")}</Link>
          </Button>
        </div>

        {/* Hamburguesa móvil */}
        <button
          className="cursor-pointer rounded-lg p-2 text-white transition-colors hover:bg-white/10 lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Drawer móvil */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="glass overflow-hidden bg-black/80 lg:hidden"
          >
            <ul className="space-y-1 px-6 py-4">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={link.href}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-slate-200 transition-colors hover:bg-brand-600/15 hover:text-brand-300"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <li className="pt-2">
                <LanguageSwitcher currentLocale={locale} />
              </li>
              <li className="flex flex-col gap-2 pt-2">
                {status === "authenticated" && session?.user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                        {getInitials(session.user.name, session.user.email)}
                      </span>
                      <span className="truncate text-sm text-slate-200">
                        {session.user.name ?? session.user.email}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-white/20 bg-transparent text-red-400 hover:bg-red-500/10"
                      onClick={() => signOut({ callbackUrl: `/${locale}` })}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> {t("logout")}
                    </Button>
                  </>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-white/20 bg-transparent text-white"
                  >
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      {t("login")}
                    </Link>
                  </Button>
                )}
                <Button
                  asChild
                  className="w-full bg-brand-600 font-semibold hover:bg-brand-500"
                >
                  <Link href="/checkout" onClick={() => setMobileOpen(false)}>
                    {t("buy")}
                  </Link>
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
