"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import {
  Download,
  Trash2,
  Loader2,
  Database,
  UserRound,
  MapPin,
  Package,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { SettingsSection } from "@/components/dashboard/SettingsSection";

const STORED_DATA = [
  { icon: UserRound, labelKey: "accountLabel", purposeKey: "accountPurpose" },
  { icon: MapPin, labelKey: "addressLabel", purposeKey: "addressPurpose" },
  { icon: Package, labelKey: "ordersLabel", purposeKey: "ordersPurpose" },
  { icon: Bell, labelKey: "notifyLabel", purposeKey: "notifyPurpose" },
  { icon: Database, labelKey: "securityLabel", purposeKey: "securityPurpose" },
] as const;

export function PrivacySettings({ email }: { email: string }) {
  const { toast } = useToast();
  const t = useTranslations("dashboard.forms.privacy");
  const locale = useLocale();
  const [confirmEmail, setConfirmEmail] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const emailMatches = confirmEmail.trim().toLowerCase() === email.toLowerCase();

  const deleteAccount = async () => {
    if (!emailMatches) return;
    setDeleting(true);
    try {
      const response = await fetch("/api/user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmEmail: confirmEmail.trim() }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast({
          variant: "destructive",
          title: t("deleteErrorTitle"),
          description: data.error ?? t("deleteErrorDesc"),
        });
        setDeleting(false);
        return;
      }

      // Cuenta eliminada → cerrar sesión y volver al inicio
      await signOut({ callbackUrl: `/${locale}` });
    } catch {
      setDeleting(false);
      toast({
        variant: "destructive",
        title: t("connErrorTitle"),
        description: t("connErrorDesc"),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Tus datos */}
      <SettingsSection
        title={t("dataTitle")}
        description={t("dataDesc")}
      >
        <ul className="space-y-4">
          {STORED_DATA.map((item) => (
            <li key={item.labelKey} className="flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600/10">
                <item.icon className="h-4 w-4 text-brand-400" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{t(item.labelKey)}</p>
                <p className="mt-0.5 text-xs text-slate-500">{t(item.purposeKey)}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-slate-600">{t("noSell")}</p>
        <Button
          asChild
          variant="outline"
          className="mt-6 gap-2 border-white/15 bg-transparent text-slate-200 hover:border-brand-400 hover:bg-brand-400/10 hover:text-brand-300"
        >
          {/* Descarga real: el endpoint devuelve un JSON con Content-Disposition attachment */}
          <a href="/api/user/export" download>
            <Download className="h-4 w-4" /> {t("download")}
          </a>
        </Button>
      </SettingsSection>

      {/* Zona de peligro */}
      <SettingsSection
        title={t("dangerTitle")}
        description={t("dangerDesc")}
        danger
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">{t("deleteAccount")}</p>
            <p className="mt-0.5 max-w-md text-xs text-red-300/60">{t("deleteWarning")}</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-red-500/40 bg-transparent text-red-400 hover:border-red-400 hover:bg-red-500/15 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" /> {t("deleteAccount")}
              </Button>
            </DialogTrigger>
            <DialogContent className="border-white/10 bg-dark-100 sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {t("dialogTitle")}
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  {t("dialogDesc")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <Label htmlFor="confirmEmail" className="text-slate-300">
                  {t("confirmLabel", { email })}
                </Label>
                <Input
                  id="confirmEmail"
                  type="email"
                  autoComplete="off"
                  value={confirmEmail}
                  onChange={(event) => setConfirmEmail(event.target.value)}
                  placeholder={email}
                  className="h-11 border-white/15 bg-white/5 text-white placeholder:text-slate-700 focus-visible:ring-red-500"
                />
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="ghost"
                  className="text-slate-300 hover:bg-white/5"
                  onClick={() => setDialogOpen(false)}
                  disabled={deleting}
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={deleteAccount}
                  disabled={!emailMatches || deleting}
                  className="gap-2 bg-red-600 font-semibold text-white hover:bg-red-500 disabled:opacity-40"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> {t("deleting")}
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" /> {t("deleteForever")}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SettingsSection>
    </div>
  );
}
