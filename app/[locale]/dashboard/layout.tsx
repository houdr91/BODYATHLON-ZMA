import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/lib/server-only-db";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default async function DashboardRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // SIEMPRE verificar sesión en Server Components — barrera secundaria al middleware
  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login?callbackUrl=/${locale}/dashboard`);

  // JWT válido pero usuario inexistente en DB (sesión huérfana):
  // destruir cookie en /logout, que redirigirá a /${locale}/login
  const user = await getCurrentUser();
  if (!user) redirect("/logout");

  return (
    <DashboardLayout user={{ name: user.name, email: user.email }}>
      {children}
    </DashboardLayout>
  );
}
