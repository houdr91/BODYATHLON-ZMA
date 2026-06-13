import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCurrentUser } from "@/lib/server-only-db";
import { NotificationPrefs } from "@/components/dashboard/NotificationPrefs";
import { Reveal } from "@/components/Reveal";

export default async function NotificationsSettingsPage({
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
          <span className="text-brand-400">NOTIFICACIONES</span>
        </h1>
        <p className="mt-2 text-slate-400">
          Elige qué avisos quieres recibir de Bodyathlon.
        </p>
      </Reveal>
      <div className="mt-8">
        <NotificationPrefs
          initial={{
            notifyOrders: user.notifyOrders,
            notifyPromos: user.notifyPromos,
            notifyNewsletter: user.notifyNewsletter,
          }}
        />
      </div>
    </div>
  );
}
