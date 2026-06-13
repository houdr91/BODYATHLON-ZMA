"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { Link } from "@/navigation";
import { signIn } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Eye, EyeOff, Loader2, UserPlus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { registerSchema, type RegisterValues } from "@/lib/validations";
import { staggerContainer, staggerItem } from "@/components/Reveal";

function getPasswordStrengthScore(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (password.length >= 12 && /[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const STRENGTH_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-brand-500",
  "bg-brand-400",
];

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("auth.register");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", terms: false },
  });

  const passwordValue = watch("password");
  const score = getPasswordStrengthScore(passwordValue ?? "");

  const onSubmit = async (values: RegisterValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.name, email: values.email, password: values.password }),
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

      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#22c55e", "#4ade80", "#f0fdf4", "#16a34a"],
      });
      toast({ title: t("successTitle"), description: t("successDesc") });

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
        return;
      }
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 16 }}
      className="glass w-full max-w-md rounded-3xl p-8 sm:p-10"
    >
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="font-display text-3xl tracking-wider text-white">
            BODY<span className="text-brand-400">ATHLON</span>
          </span>
          <span className="rounded-md bg-brand-600 px-2 py-0.5 font-display text-sm tracking-widest text-white">
            ZMA
          </span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-white">{t("title")}</h1>
        <p className="mt-1.5 text-sm text-slate-400">{t("subtitle")}</p>
      </div>

      <motion.form
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-4"
        noValidate
      >
        <motion.div variants={staggerItem} className="space-y-2">
          <Label htmlFor="name" className="text-slate-300">{t("name")}</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Tu nombre"
            className="h-11 border-white/15 bg-white/5 text-white placeholder:text-slate-600 focus-visible:ring-brand-500"
            {...register("name")}
          />
          {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
        </motion.div>

        <motion.div variants={staggerItem} className="space-y-2">
          <Label htmlFor="email" className="text-slate-300">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            className="h-11 border-white/15 bg-white/5 text-white placeholder:text-slate-600 focus-visible:ring-brand-500"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </motion.div>

        <motion.div variants={staggerItem} className="space-y-2">
          <Label htmlFor="password" className="text-slate-300">{t("password")}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className="h-11 border-white/15 bg-white/5 pr-11 text-white placeholder:text-slate-600 focus-visible:ring-brand-500"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((show) => !show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500 transition-colors hover:text-slate-300"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {passwordValue && (
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
                  const passed = rule.test(passwordValue);
                  return (
                    <li
                      key={rule.label}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${
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
          {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
        </motion.div>

        <motion.div variants={staggerItem} className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-slate-300">{t("confirmPassword")}</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            className="h-11 border-white/15 bg-white/5 text-white placeholder:text-slate-600 focus-visible:ring-brand-500"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </motion.div>

        <motion.div variants={staggerItem} className="space-y-2 pt-1">
          <div className="flex items-start gap-2.5">
            <Controller
              name="terms"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="terms"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-0.5 border-white/30 data-[state=checked]:border-brand-500 data-[state=checked]:bg-brand-600"
                />
              )}
            />
            <Label
              htmlFor="terms"
              className="cursor-pointer text-xs font-normal leading-relaxed text-slate-400"
            >
              {t("terms")}
            </Label>
          </div>
          {errors.terms && <p className="text-xs text-red-400">{errors.terms.message}</p>}
        </motion.div>

        <motion.div variants={staggerItem} className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="btn-shimmer h-12 w-full bg-brand-600 text-base font-semibold text-white hover:bg-brand-500"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("loading")}
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-5 w-5" /> {t("submit")}
              </>
            )}
          </Button>
        </motion.div>
      </motion.form>

      <p className="mt-7 text-center text-sm text-slate-400">
        {t("hasAccount")}{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-400 transition-colors hover:text-brand-300"
        >
          {t("login")}
        </Link>
      </p>
    </motion.div>
  );
}
