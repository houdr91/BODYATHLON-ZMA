import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Test1234!", 12);

  // Seed determinista: recrea el usuario de prueba desde cero
  await prisma.user.deleteMany({ where: { email: "test@bodyathlon.com" } });

  const user = await prisma.user.create({
    data: {
      name: "Test Atleta",
      email: "test@bodyathlon.com",
      password: hashedPassword,
      phone: "+34 612 345 678",
      bio: "Atleta amateur apasionado por el fitness y la nutrición deportiva.",
      lastLoginAt: new Date(),
      lastLoginIp: "127.0.0.1",
      address: {
        create: {
          street: "Calle del Deporte 42",
          city: "Madrid",
          postalCode: "28001",
          country: "España",
        },
      },
      orders: {
        create: [
          {
            product: "Bodyathlon ZMA 120 cápsulas",
            quantity: 2,
            total: 69.98,
            status: "DELIVERED",
            trackingCode: "ES123456789",
            shippingAddress: "Calle del Deporte 42, 28001 Madrid, España",
          },
          {
            product: "Bodyathlon ZMA 120 cápsulas",
            quantity: 1,
            total: 34.99,
            status: "SHIPPED",
            trackingCode: "ES987654321",
            shippingAddress: "Calle del Deporte 42, 28001 Madrid, España",
          },
          {
            product: "Bodyathlon ZMA 120 cápsulas",
            quantity: 1,
            total: 34.99,
            status: "PENDING",
          },
        ],
      },
      notifications: {
        create: [
          {
            type: "order_update",
            title: "Pedido enviado",
            message:
              "Tu pedido #ZMA-987654 ha sido enviado. Código: ES987654321",
            read: false,
          },
          {
            type: "promo",
            title: "¡Oferta exclusiva!",
            message: "Tienes un 10% de descuento en tu próximo pedido.",
            read: true,
          },
        ],
      },
    },
  });

  console.log("✅ Seed completado:", user.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
