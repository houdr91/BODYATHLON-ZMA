import type { NextAuthConfig } from "next-auth";

// Configuración edge-safe (sin Prisma) — la usa el middleware.
// La lógica de protección de rutas vive en middleware.ts.
export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
} satisfies NextAuthConfig;
