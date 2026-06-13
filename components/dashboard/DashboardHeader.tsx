"use client";

import { useLocale, useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { Menu, ChevronRight, LogOut, Home } from "lucide-react";
import { Link, usePathname } from "@/navigation";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userName: string | null;
  onMenuClick: () => void;
}

export function DashboardHeader({ userName, onMenuClick }: DashboardHeaderProps) {
  // usePathname de @/navigation devuelve la ruta SIN el prefijo de locale,
  // así que los segmentos no incluyen "es"/"en"/etc.
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("dashboard.sidebar");
  const tNav = useTranslations("nav");
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-dark-300/90 px-4 backdrop-blur-lg sm:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburguesa móvil */}
        <button
          onClick={onMenuClick}
          className="cursor-pointer rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 md:hidden"
          aria-label={tNav("openMenu")}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-slate-500 transition-colors hover:text-brand-400"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
          {segments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/");
            const isLast = index === segments.length - 1;
            // Etiqueta traducida; si el segmento no tiene clave (p. ej. un id de pedido),
            // se muestra un identificador corto.
            const hasLabel = t.has(segment);
            const label = hasLabel
              ? t(segment)
              : `#ZMA-${segment.slice(-6).toUpperCase()}`;
            return (
              <span key={href} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                {isLast ? (
                  <span className="font-medium text-white">{label}</span>
                ) : (
                  <Link
                    href={href}
                    className="text-slate-500 transition-colors hover:text-brand-400"
                  >
                    {label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-slate-400 sm:inline">
          {userName ?? t("athlete")}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
          onClick={() => signOut({ callbackUrl: `/${locale}` })}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">{tNav("logout")}</span>
        </Button>
      </div>
    </header>
  );
}
