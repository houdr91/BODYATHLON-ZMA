"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  KeyRound,
  Monitor,
  LogOut,
  Check,
  X,
  ShieldAlert,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { SettingsSection } from "@/components/dashboard/SettingsSection";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/lib/validations";

const STRENGTH_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-brand-500",
  "bg-brand-400",
];

function getPasswordScore(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (password.length >= 12 && /[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function formatDateTime(value: string | null, locale: string): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

interface SecuritySettingsProps {
  session: {
    ip: string;
    userAgent: string;
    lastLoginAt: string | null;
    lastLoginIp: string | null;
    passwordChangedAt: string | null;
    wasEverLocked: boolean;
    twoFactorEnabled: boolean;
  };
}

const inputClass =
  "h-11 border-white/15 bg-white/5 text-white placeholder:text-slate-600 focus-visible:ring-brand-500";

export function SecuritySettings({ session }: SecuritySettingsProps) {
  const { toast } = useToast();
  const t = useTranslations("dashboard.forms.security");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const newPassword = watch("newPassword");
  const score = getPasswordScore(newPassword ?? "");

  const PASSWORD_RULES = [
    { label: t("ruleLength"), test: (v: string) => v.length >= 8 },
    { label: t("ruleUppercase"), test: (v: string) => /[A-Z]/.test(v) },
    { label: t("ruleNumber"), test: (v: string) => /[0-9]/.test(v) },
  ];
  const STRENGTH_LABELS = [
    t("strength0"),
    t("strength1"),
    t("strength2"),
    t("strength3"),
    t("strength4"),
  ];

  const onSubmit = async (values: ChangePasswordValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      if (response.status === 429) {
        toast({
          variant: "destructive",
          title: t("rateLimitTitle"),
          description: t("rateLimitDesc"),
        });
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast({
          variant: "destructive",
          title: t("errorTitle"),
          description: data.error ?? t("errorDesc"),
        });
        return;
      }

      reset();
      toast({
        title: t("successTitle"),
        description: t("successDesc"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cambiar contraseña */}
      <SettingsSection
        title={t("changeTitle")}
        description={t("changeDesc")}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-slate-300">
              {t("current")}
            </Label>
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              className={inputClass}
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-xs text-red-400">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-slate-300">
              {t("new")}
            </Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              className={inputClass}
              {...register("newPassword")}
            />
            {newPassword && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-1.5 flex-1 gap-1">
                    {[0, 1, 2, 3].map((segment) => (
                      <div
                        key={segment}
                        className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                          segment < score ? STRENGTH_COLORS[score] : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="w-20 text-right text-xs text-slate-400">
                    {STRENGTH_LABELS[score]}
                  </span>
                </div>
                <ul className="space-y-1">
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(newPassword);
                    return (
                      <li
                        key={rule.label}
                        className={`flex items-center gap-1.5 text-xs ${
                          passed ? "text-brand-400" : "text-slate-500"
                        }`}
                      >
                        {passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {errors.newPassword && (
              <p className="text-xs text-red-400">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-300">
              {t("confirm")}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={inputClass}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="gap-2 bg-brand-600 font-semibold hover:bg-brand-500"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {t("updating")}
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4" /> {t("update")}
              </>
            )}
          </Button>
        </form>
      </SettingsSection>

      {/* Sesión activa */}
      <SettingsSection
        title={t("sessionTitle")}
        description={t("sessionDesc")}
      >
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/15">
              <Monitor className="h-5 w-5 text-brand-400" />
            </span>
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-white">{t("thisDevice")}</p>
              <p className="text-slate-400">
                IP: <span className="font-mono text-slate-300">{session.ip}</span>
              </p>
              <p className="max-w-md break-all text-xs text-slate-500">
                {session.userAgent}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {t("loginTime")} {formatDateTime(session.lastLoginAt, locale)}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="gap-2 border-red-500/30 bg-transparent text-red-400 hover:border-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
          >
            <LogOut className="h-4 w-4" /> {t("signOutAll")}
          </Button>
        </div>
      </SettingsSection>

      {/* Historial de seguridad */}
      <SettingsSection title={t("historyTitle")}>
        <dl className="space-y-4 text-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <dt className="text-slate-400">{t("lastAccess")}</dt>
            <dd className="text-slate-200">
              {formatDateTime(session.lastLoginAt, locale)}
              {session.lastLoginIp && (
                <span className="ml-2 font-mono text-xs text-slate-500">
                  ({session.lastLoginIp})
                </span>
              )}
            </dd>
          </div>
          <Separator className="bg-white/[0.06]" />
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <dt className="text-slate-400">{t("lastPwChange")}</dt>
            <dd className="text-slate-200">
              {session.passwordChangedAt
                ? formatDateTime(session.passwordChangedAt, locale)
                : t("never")}
            </dd>
          </div>
          <Separator className="bg-white/[0.06]" />
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <dt className="text-slate-400">{t("lockouts")}</dt>
            <dd
              className={
                session.wasEverLocked ? "flex items-center gap-1.5 text-yellow-400" : "text-brand-400"
              }
            >
              {session.wasEverLocked ? (
                <>
                  <ShieldAlert className="h-4 w-4" /> {t("wasLocked")}
                </>
              ) : (
                t("neverLocked")
              )}
            </dd>
          </div>
        </dl>
      </SettingsSection>

      {/* 2FA */}
      <SettingsSection
        title={t("twoFaTitle")}
        description={t("twoFaDesc")}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch checked={session.twoFactorEnabled} disabled aria-label={t("twoFaTitle")} />
            <span className="text-sm text-slate-400">
              {session.twoFactorEnabled ? t("enabled") : t("disabled")}
            </span>
          </div>
          <Badge
            variant="outline"
            className="border-brand-500/30 bg-brand-500/10 text-brand-300"
          >
            {t("comingSoon")}
          </Badge>
        </div>
        <p className="mt-3 text-xs text-slate-600">{t("inDevelopment")}</p>
      </SettingsSection>
    </div>
  );
}
