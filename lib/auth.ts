import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validations";
import { loginRateLimit } from "@/lib/rate-limiter";
import { getClientIp, artificialDelay } from "@/lib/security";
import { authConfig } from "@/auth.config";
import type { Role } from "@/types";

// Errores tipados: el cliente recibe el `code` (nunca detalles internos)
class RateLimitedError extends CredentialsSignin {
  code = "rate_limited";
}
class AccountLockedError extends CredentialsSignin {
  code = "locked";
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials, request) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const ip = getClientIp(request.headers);

        // Rate limit por IP: 5 intentos / 15 min
        const { success } = loginRateLimit(ip);
        if (!success) {
          throw new RateLimitedError();
        }

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          // Delay artificial para evitar timing attacks (no revelar si el email existe)
          await artificialDelay(500);
          return null;
        }

        // Cuenta bloqueada por intentos fallidos
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new AccountLockedError();
        }

        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
          // Incrementar contador de intentos fallidos y bloquear al llegar al máximo
          const newAttempts = user.loginAttempts + 1;
          const lockUntil =
            newAttempts >= MAX_LOGIN_ATTEMPTS
              ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000)
              : null;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: newAttempts,
              ...(lockUntil && { lockedUntil: lockUntil }),
            },
          });
          return null;
        }

        // Login exitoso — resetear contador y registrar IP/tiempo
        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
            lastLoginIp: ip,
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role as Role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
});
