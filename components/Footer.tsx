import { getTranslations } from "next-intl/server";
import { Music2 } from "lucide-react";
import { Link } from "@/navigation";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

export async function Footer() {
  const t = await getTranslations("footer");

  const FOOTER_COLUMNS = [
    {
      title: t("product"),
      links: [
        { label: t("home"), href: "/" },
        { label: t("benefits"), href: "/#beneficios" },
        { label: t("ingredients"), href: "/#ingredientes" },
        { label: t("testimonials"), href: "/#opiniones" },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: t("about"), href: "#" },
        { label: t("blog"), href: "#" },
        { label: t("quality"), href: "#" },
      ],
    },
    {
      title: t("legal"),
      links: [
        { label: t("privacy"), href: "#" },
        { label: t("terms"), href: "#" },
        { label: t("cookies"), href: "#" },
      ],
    },
    {
      title: t("contact"),
      links: [
        { label: t("support"), href: `mailto:${t("support")}` },
        { label: t("customer"), href: "#" },
        { label: t("shipping"), href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-dark-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Marca */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-2xl tracking-wider text-white">
                BODY<span className="text-brand-400">ATHLON</span>
              </span>
              <span className="rounded-md bg-brand-600 px-2 py-0.5 font-display text-sm tracking-widest text-white">
                ZMA
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-400">{t("tagline")}</p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-white/10 p-2.5 text-slate-300 transition-colors duration-200 hover:border-brand-400 hover:text-brand-400"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="rounded-full border border-white/10 p-2.5 text-slate-300 transition-colors duration-200 hover:border-brand-400 hover:text-brand-400"
              >
                <Music2 className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="rounded-full border border-white/10 p-2.5 text-slate-300 transition-colors duration-200 hover:border-brand-400 hover:text-brand-400"
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Columnas */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors duration-200 hover:text-brand-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs text-slate-500">{t("copyright")}</p>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-slate-600">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
