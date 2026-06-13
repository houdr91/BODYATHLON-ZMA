import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCurrentUser } from "@/lib/server-only-db";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { Reveal } from "@/components/Reveal";

export default async function ProfileSettingsPage({
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
          MI <span className="text-brand-400">PERFIL</span>
        </h1>
        <p className="mt-2 text-slate-400">
          Gestiona tus datos personales y tu dirección de envío.
        </p>
      </Reveal>
      <div className="mt-8">
        <ProfileForm
          initial={{
            name: user.name,
            email: user.email,
            phone: user.phone,
            bio: user.bio,
            address: user.address
              ? {
                  street: user.address.street,
                  city: user.address.city,
                  postalCode: user.address.postalCode,
                  country: user.address.country,
                }
              : null,
          }}
        />
      </div>
    </div>
  );
}
