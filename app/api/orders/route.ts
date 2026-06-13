import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createOrderSchema } from "@/lib/validations";
import { apiRateLimit } from "@/lib/rate-limiter";
import { tooManyRequests } from "@/lib/security";
import { ZMA_PRODUCT } from "@/types";

export async function POST(request: Request) {
  // Doble check de sesión — el middleware es solo la primera barrera
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const rateLimitResult = apiRateLimit(session.user.id);
  if (!rateLimitResult.success) {
    return tooManyRequests(rateLimitResult.resetAt);
  }

  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Cantidad inválida" }, { status: 400 });
    }

    const { quantity } = parsed.data;
    const total = Math.round(quantity * ZMA_PRODUCT.price * 100) / 100;

    // Dirección de envío del perfil (si existe)
    const address = await prisma.address.findUnique({
      where: { userId: session.user.id },
    });
    const shippingAddress = address?.street
      ? `${address.street}, ${address.postalCode ?? ""} ${address.city ?? ""}, ${address.country}`.trim()
      : null;

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        product: "ZMA 120caps",
        quantity,
        total,
        shippingAddress,
        notes: null,
      },
    });

    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: "order_update",
        title: "Pedido recibido",
        message: `Hemos recibido tu pedido de ${quantity} × Bodyathlon ZMA por ${total.toFixed(2).replace(".", ",")}€. Te avisaremos cuando salga del almacén.`,
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}
