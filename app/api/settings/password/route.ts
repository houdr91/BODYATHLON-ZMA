import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { passwordChangeRateLimit } from "@/lib/rate-limiter";
import { changePasswordApiSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Rate limit estricto para cambio de contraseña: 3 intentos / hora
  const { success } = passwordChangeRateLimit(session.user.id);
  if (!success) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera 1 hora." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const parsed = changePasswordApiSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const isCurrentValid = await bcrypt.compare(
    parsed.data.currentPassword,
    user.password
  );
  if (!isCurrentValid) {
    // Mensaje genérico — no revelar si la contraseña actual era correcta
    return NextResponse.json(
      { error: "Los datos no son correctos" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      password: hashed,
      passwordChangedAt: new Date(),
    },
  });

  await prisma.notification.create({
    data: {
      userId: session.user.id,
      type: "security",
      title: "Contraseña actualizada",
      message:
        "Tu contraseña se ha cambiado correctamente. Si no has sido tú, contacta con soporte inmediatamente.",
    },
  });

  return NextResponse.json({ message: "Contraseña actualizada correctamente" });
}
