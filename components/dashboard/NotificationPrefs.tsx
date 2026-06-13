"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Package, Gift, Lock, Newspaper, Check, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { SettingsSection } from "@/components/dashboard/SettingsSection";

type PrefKey = "notifyOrders" | "notifyPromos" | "notifyNewsletter";

interface NotificationPrefsProps {
  initial: Record<PrefKey, boolean>;
}

const PREFS: {
  key: PrefKey;
  icon: typeof Package;
  titleKey: "ordersTitle" | "promosTitle" | "newsletterTitle";
  descKey: "ordersDesc" | "promosDesc" | "newsletterDesc";
}[] = [
  { key: "notifyOrders", icon: Package, titleKey: "ordersTitle", descKey: "ordersDesc" },
  { key: "notifyPromos", icon: Gift, titleKey: "promosTitle", descKey: "promosDesc" },
  { key: "notifyNewsletter", icon: Newspaper, titleKey: "newsletterTitle", descKey: "newsletterDesc" },
];

export function NotificationPrefs({ initial }: NotificationPrefsProps) {
  const { toast } = useToast();
  const t = useTranslations("dashboard.forms.notifications");
  const [prefs, setPrefs] = useState(initial);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<Partial<Record<PrefKey, boolean>>>({});

  const persist = async () => {
    const payload = { ...pendingRef.current };
    pendingRef.current = {};
    setSaveState("saving");
    try {
      const response = await fetch("/api/settings/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error();
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("idle");
      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description: t("errorDesc"),
      });
    }
  };

  const toggle = (key: PrefKey, value: boolean) => {
    setPrefs((current) => ({ ...current, [key]: value }));
    pendingRef.current[key] = value;
    // Guardado automático con debounce de 500ms
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(persist, 500);
  };

  return (
    <SettingsSection
      title={t("title")}
      description={t("desc")}
    >
      <div className="space-y-1 divide-y divide-white/[0.06]">
        {PREFS.map((pref) => (
          <div key={pref.key} className="flex items-center justify-between gap-4 py-4">
            <div className="flex items-start gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600/10">
                <pref.icon className="h-[18px] w-[18px] text-brand-400" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{t(pref.titleKey)}</p>
                <p className="mt-0.5 text-xs text-slate-500">{t(pref.descKey)}</p>
              </div>
            </div>
            <Switch
              checked={prefs[pref.key]}
              onCheckedChange={(value) => toggle(pref.key, value)}
              aria-label={t(pref.titleKey)}
              className="data-[state=checked]:bg-brand-600"
            />
          </div>
        ))}

        {/* Seguridad: siempre activado */}
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-start gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600/10">
              <Lock className="h-[18px] w-[18px] text-brand-400" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{t("securityTitle")}</p>
              <p className="mt-0.5 text-xs text-slate-500">{t("securityDesc")}</p>
            </div>
          </div>
          <Switch
            checked
            disabled
            aria-label={t("securityTitle")}
            className="data-[state=checked]:bg-brand-600 opacity-60"
          />
        </div>
      </div>

      {/* Indicador de guardado */}
      <div className="mt-4 flex h-5 items-center gap-1.5 text-xs" aria-live="polite">
        {saveState === "saving" && (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />
            <span className="text-slate-500">{t("saving")}</span>
          </>
        )}
        {saveState === "saved" && (
          <>
            <Check className="h-3.5 w-3.5 text-brand-400" />
            <span className="text-brand-400">{t("saved")}</span>
          </>
        )}
      </div>
    </SettingsSection>
  );
}
