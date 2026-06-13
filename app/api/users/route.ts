import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createUserSchema } from "@/lib/validations";
import { registerRateLimit } from "@/lib/rate-limiter";
import { getClientIp, tooManyRequests } from "@/lib/security";

export async function POST(request: Request) {
  try {
    // Rate limit por IP: 3 registros / hora
    const ip = getClientIp(request.headers);
    const rateLimitResult = registerRateLimit(ip);
    if (!rateLimitResult.success) {
      return tooManyRequests(rateLimitResult.resetAt);
    }

    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este email" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        notifications: {
          create: {
            type: "security",
            title: "Bienvenido a Bodyathlon",
            message:
              "Tu cuenta se ha creado correctamente. Revisa tus ajustes de seguridad y completa tu perfil.",
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
