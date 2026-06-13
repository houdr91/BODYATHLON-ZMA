import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiRateLimit } from "@/lib/rate-limiter";
import { tooManyRequests } from "@/lib/security";

// Exportación de datos del usuario (GDPR) — descarga un JSON real
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const rateLimitResult = apiRateLimit(session.user.id);
  if (!rateLimitResult.success) {
    return tooManyRequests(rateLimitResult.resetAt);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      // NUNCA: password, loginAttempts
      id: true,
      name: true,
      email: true,
      phone: true,
      bio: true,
      birthdate: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      lastLoginAt: true,
      lastLoginIp: true,
      passwordChangedAt: true,
      twoFactorEnabled: true,
      notifyOrders: true,
      notifyPromos: true,
      notifyNewsletter: true,
      address: {
        select: {
          street: true,
          city: true,
          postalCode: true,
          country: true,
          createdAt: true,
        },
      },
      orders: {
        select: {
          id: true,
          product: true,
          quantity: true,
          total: true,
          status: true,
          trackingCode: true,
          shippingAddress: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      notifications: {
        select: {
          type: true,
          title: true,
          message: true,
          read: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    application: "Bodyathlon ZMA",
    user,
  };

  return new NextResponse(JSON.stringify(exportPayload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="bodyathlon-datos-${user.id.slice(-6)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
