// ESTE ARCHIVO SOLO SE PUEDE IMPORTAR EN SERVER COMPONENTS Y API ROUTES
import "server-only";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// Todas las queries de usuario pasan por aquí — nunca directamente desde el cliente

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      bio: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
      lastLoginIp: true,
      passwordChangedAt: true,
      lockedUntil: true,
      twoFactorEnabled: true,
      notifyOrders: true,
      notifyPromos: true,
      notifyNewsletter: true,
      address: true,
      // NUNCA seleccionar: password, loginAttempts
    },
  });
}

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export async function getUserOrders(userId: string) {
  const session = await auth();
  // Verificar que el usuario solo puede ver SUS pedidos
  if (!session?.user?.id || session.user.id !== userId) {
    throw new Error("Unauthorized");
  }

  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserOrder(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // findFirst con userId en el where: imposible leer pedidos de otro usuario (IDOR)
  return prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
  });
}

export async function getUserNotifications(limit = 10) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: [{ read: "asc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string; phone?: string; bio?: string }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) {
    throw new Error("Unauthorized");
  }

  // Sanitizar inputs — solo campos permitidos
  const safeData = {
    ...(data.name && { name: data.name.trim().substring(0, 100) }),
    ...(data.phone && { phone: data.phone.trim().substring(0, 20) }),
    ...(data.bio && { bio: data.bio.trim().substring(0, 500) }),
  };

  return prisma.user.update({
    where: { id: userId },
    data: safeData,
    select: { id: true, name: true, phone: true, bio: true },
  });
}
