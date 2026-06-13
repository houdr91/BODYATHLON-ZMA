import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiRateLimit } from "@/lib/rate-limiter";
import { tooManyRequests } from "@/lib/security";
import { notificationPrefsSchema } from "@/lib/validations";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const rateLimitResult = apiRateLimit(session.user.id);
  if (!rateLimitResult.success) {
    return tooManyRequests(rateLimitResult.resetAt);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const parsed = notificationPrefsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
    select: {
      notifyOrders: true,
      notifyPromos: true,
      notifyNewsletter: true,
    },
  });

  return NextResponse.json({ preferences: updated });
}
