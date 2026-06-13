"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-dark-400 px-6 text-center">
      <h1 className="font-display text-5xl tracking-wide text-white">{t("title")}</h1>
      <p className="max-w-md text-slate-400">{t("description")}</p>
      <div className="flex gap-3">
        <Button onClick={reset} className="bg-brand-600 hover:bg-brand-500">
          {t("retry")}
        </Button>
        <Button variant="outline" asChild>
          <a href="/">{t("backHome")}</a>
        </Button>
      </div>
      {error.digest && (
        <p className="text-xs text-slate-600">Ref: {error.digest}</p>
      )}
    </div>
  );
}
