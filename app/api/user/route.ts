import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteAccountSchema } from "@/lib/validations";

// Eliminación de cuenta: requiere confirmar el email exacto.
// Borra usuario + pedidos + dirección + notificaciones + sesiones (cascada Prisma).
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const parsed = deleteAccountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  // El email debe coincidir exactamente con el de la sesión (case-insensitive)
  if (parsed.data.confirmEmail.toLowerCase() !== user.email.toLowerCase()) {
    return NextResponse.json(
      { error: "El email no coincide con el de tu cuenta" },
      { status: 400 }
    );
  }

  await prisma.user.delete({ where: { id: session.user.id } });

  return NextResponse.json({ message: "Cuenta eliminada definitivamente" });
}
