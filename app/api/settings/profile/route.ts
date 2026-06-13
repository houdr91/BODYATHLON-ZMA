import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiRateLimit } from "@/lib/rate-limiter";
import { getClientIp, tooManyRequests } from "@/lib/security";
import { updateProfileSchema } from "@/lib/validations";

export async function PATCH(request: Request) {
  // 1. Rate limiting por IP
  const ip = getClientIp(request.headers);
  const rateLimitResult = apiRateLimit(ip);
  if (!rateLimitResult.success) {
    return tooManyRequests(rateLimitResult.resetAt);
  }

  // 2. Verificar sesión (doble check — middleware es solo la primera barrera)
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // 3. Validar body con Zod
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // 4. Operación con solo los campos permitidos
  const { name, phone, bio, address } = parsed.data;

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name !== undefined && { name: name.trim().substring(0, 100) }),
      ...(phone !== undefined && { phone: phone.trim().substring(0, 20) || null }),
      ...(bio !== undefined && { bio: bio.trim().substring(0, 500) || null }),
      ...(address && {
        address: {
          upsert: {
            create: {
              street: address.street?.trim() || null,
              city: address.city?.trim() || null,
              postalCode: address.postalCode?.trim() || null,
              country: address.country?.trim() || "España",
            },
            update: {
              street: address.street?.trim() || null,
              city: address.city?.trim() || null,
              postalCode: address.postalCode?.trim() || null,
              country: address.country?.trim() || "España",
            },
          },
        },
      }),
    },
    // NUNCA devolver password ni campos internos de seguridad
    select: {
      id: true,
      name: true,
      phone: true,
      bio: true,
      address: {
        select: { street: true, city: true, postalCode: true, country: true },
      },
    },
  });

  return NextResponse.json({ user: updated });
}
