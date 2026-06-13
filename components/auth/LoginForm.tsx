"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { Link } from "@/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, type LoginValues } from "@/lib/validations";
import { staggerContainer, staggerItem } from "@/components/Reveal";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const { toast } = useToast();
  const t = useTranslations("auth.login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setLoading(true);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      const code = (result as { code?: string }).code;
      const messages: Record<string, { title: string; description: string }> = {
        rate_limited: {
          title: t("errorRateLimited.title"),
          description: t("errorRateLimited.description"),
        },
        locked: {
          title: t("errorLocked.title"),
          description: t("errorLocked.description"),
        },
      };
      const message = (code && messages[code]) ?? {
        title: t("errorDefault.title"),
        description: t("errorDefault.description"),
      };
      toast({ variant: "destructive", ...message });
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 16 }}
      className={`glass w-full max-w-md rounded-3xl p-8 sm:p-10 ${shake ? "animate-shake" : ""}`}
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
        className="mt-8 space-y-5"
        noValidate
      >
        <motion.div variants={staggerItem} className="space-y-2">
          <Label htmlFor="email" className="text-slate-300">
            {t("email")}
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            className="h-11 border-white/15 bg-white/5 text-white placeholder:text-slate-600 focus-visible:ring-brand-500"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </motion.div>

        <motion.div variants={staggerItem} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-slate-300">
              {t("password")}
            </Label>
            <button
              type="button"
              className="cursor-pointer text-xs text-slate-500 transition-colors hover:text-brand-400"
            >
              {t("forgotPassword")}
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
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
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </motion.div>

        <motion.div variants={staggerItem}>
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
                <LogIn className="mr-2 h-5 w-5" /> {t("submit")}
              </>
            )}
          </Button>
        </motion.div>
      </motion.form>

      <p className="mt-7 text-center text-sm text-slate-400">
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="font-semibold text-brand-400 transition-colors hover:text-brand-300"
        >
          {t("register")}
        </Link>
      </p>
    </motion.div>
  );
}
