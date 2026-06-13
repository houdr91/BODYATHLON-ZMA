import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCurrentUser } from "@/lib/server-only-db";
import { PrivacySettings } from "@/components/dashboard/PrivacySettings";
import { Reveal } from "@/components/Reveal";

export default async function PrivacySettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) redirect("/logout");

  return (
    <div className="mx-auto max-w-3xl">
      <Reveal>
        <h1 className="font-display text-4xl tracking-wide text-white">
          <span className="text-brand-400">PRIVACIDAD</span> Y DATOS
        </h1>
        <p className="mt-2 text-slate-400">
          Transparencia total sobre tus datos, igual que con nuestros ingredientes.
        </p>
      </Reveal>
      <div className="mt-8">
        <PrivacySettings email={user.email} />
      </div>
    </div>
  );
}
