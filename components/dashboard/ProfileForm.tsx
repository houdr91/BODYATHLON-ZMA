"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Camera, Loader2, Save, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { SettingsSection } from "@/components/dashboard/SettingsSection";
import { getInitials } from "@/components/dashboard/DashboardSidebar";
import { updateProfileSchema, type UpdateProfileValues } from "@/lib/validations";

const COUNTRIES = ["España", "Portugal", "Francia", "Italia", "Alemania", "Andorra"];

interface ProfileFormProps {
  initial: {
    name: string | null;
    email: string;
    phone: string | null;
    bio: string | null;
    address: {
      street: string | null;
      city: string | null;
      postalCode: string | null;
      country: string;
    } | null;
  };
}

const inputClass =
  "h-11 border-white/15 bg-white/5 text-white placeholder:text-slate-600 focus-visible:ring-brand-500";

export function ProfileForm({ initial }: ProfileFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("dashboard.forms.profile");
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: initial.name ?? "",
      phone: initial.phone ?? "",
      bio: initial.bio ?? "",
      address: {
        street: initial.address?.street ?? "",
        city: initial.address?.city ?? "",
        postalCode: initial.address?.postalCode ?? "",
        country: initial.address?.country ?? "España",
      },
    },
  });

  const watched = watch();
  const bioLength = watched.bio?.length ?? 0;

  // Indicador de perfil completo
  const completeness = useMemo(() => {
    const fields = [
      watched.name,
      watched.phone,
      watched.bio,
      watched.address?.street,
      watched.address?.city,
      watched.address?.postalCode,
    ];
    const filled = fields.filter((field) => field && field.trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }, [watched]);

  const onAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // Preview local sin subida real (placeholder para portfolio)
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    toast({
      title: t("avatarPreviewTitle"),
      description: t("avatarPreviewDesc"),
    });
  };

  const onSubmit = async (values: UpdateProfileValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast({
          variant: "destructive",
          title: t("errorTitle"),
          description: data.error ?? t("errorDesc"),
        });
        return;
      }

      toast({
        title: t("savedTitle"),
        description: t("savedDesc"),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Completitud */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-white">{t("completeness", { percent: completeness })}</span>
          <span className="text-xs text-slate-500">
            {completeness === 100 ? t("perfect") : t("completePrompt")}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
          <motion.div
            animate={{ width: `${completeness}%` }}
            transition={{ duration: 0.6, ease: [0.21, 0.65, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand-400"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <SettingsSection
          title={t("personalTitle")}
          description={t("personalDesc")}
        >
          {/* Avatar */}
          <div className="flex items-center gap-5">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarPreview}
                alt="Vista previa del avatar"
                className="h-16 w-16 rounded-full border border-brand-500/40 object-cover"
              />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white">
                {getInitials(initial.name, initial.email)}
              </span>
            )}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 border-white/15 bg-transparent text-slate-200 hover:border-brand-400 hover:bg-brand-400/10"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" /> {t("changePhoto")}
              </Button>
              <p className="mt-1.5 text-xs text-slate-600">{t("photoHint")}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">
                {t("name")}
              </Label>
              <Input id="name" className={inputClass} {...register("name")} />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="email" className="text-slate-300">
                  {t("email")}
                </Label>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" aria-label={t("emailInfoLabel")}>
                        <Info className="h-3.5 w-3.5 text-slate-500" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="border-white/10 bg-dark-100 text-slate-200">
                      {t("emailTooltip")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="email"
                value={initial.email}
                readOnly
                disabled
                className={`${inputClass} cursor-not-allowed opacity-60`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-300">
                {t("phone")} <span className="text-slate-600">{t("optional")}</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+34 600 000 000"
                className={inputClass}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-red-400">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bio" className="text-slate-300">
                  {t("bio")}
                </Label>
                <span
                  className={`text-xs ${bioLength > 500 ? "text-red-400" : "text-slate-600"}`}
                >
                  {bioLength}/500
                </span>
              </div>
              <Textarea
                id="bio"
                rows={4}
                maxLength={500}
                placeholder={t("bioPlaceholder")}
                className="border-white/15 bg-white/5 text-white placeholder:text-slate-600 focus-visible:ring-brand-500"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-xs text-red-400">{errors.bio.message}</p>
              )}
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title={t("addressTitle")}
          description={t("addressDesc")}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="street" className="text-slate-300">
                {t("street")}
              </Label>
              <Input
                id="street"
                placeholder={t("streetPlaceholder")}
                className={inputClass}
                {...register("address.street")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-slate-300">
                {t("city")}
              </Label>
              <Input id="city" placeholder="Madrid" className={inputClass} {...register("address.city")} />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-slate-300">
                  {t("postalCode")}
                </Label>
                <Input
                  id="postalCode"
                  placeholder="28001"
                  className={inputClass}
                  {...register("address.postalCode")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-slate-300">
                  {t("country")}
                </Label>
                <select
                  id="country"
                  className="h-11 w-full cursor-pointer rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 [&>option]:bg-dark-100"
                  {...register("address.country")}
                >
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </SettingsSection>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="btn-shimmer gap-2 bg-brand-600 px-8 font-semibold hover:bg-brand-500"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {t("saving")}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> {t("saveChanges")}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
