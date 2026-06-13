import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCurrentUser } from "@/lib/server-only-db";
import { getClientIp } from "@/lib/security";
import { SecuritySettings } from "@/components/dashboard/SecuritySettings";
import { Reveal } from "@/components/Reveal";

export default async function SecuritySettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) redirect("/logout");

  const requestHeaders = headers();
  const ip = getClientIp(new Headers(requestHeaders));
  const userAgent = requestHeaders.get("user-agent") ?? "Desconocido";

  return (
    <div className="mx-auto max-w-3xl">
      <Reveal>
        <h1 className="font-display text-4xl tracking-wide text-white">
          <span className="text-brand-400">SEGURIDAD</span> DE LA CUENTA
        </h1>
        <p className="mt-2 text-slate-400">
          Contraseña, sesiones activas y actividad reciente.
        </p>
      </Reveal>
      <div className="mt-8">
        <SecuritySettings
          session={{
            ip,
            userAgent,
            lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
            lastLoginIp: user.lastLoginIp,
            passwordChangedAt: user.passwordChangedAt?.toISOString() ?? null,
            wasEverLocked: user.lockedUntil !== null,
            twoFactorEnabled: user.twoFactorEnabled,
          }}
        />
      </div>
    </div>
  );
}
