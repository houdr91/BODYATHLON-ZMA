// Valida que todas las variables críticas existen al arrancar.
// Si falta alguna, la app FALLA en build time — nunca en runtime silenciosamente.
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL es requerida"),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET debe tener al menos 32 caracteres"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL debe ser una URL válida"),
  NODE_ENV: z.enum(["development", "test", "production"]),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Variables de entorno inválidas o faltantes:");
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error("Variables de entorno inválidas — revisa tu .env.local");
}

export const env = parsed.data;
