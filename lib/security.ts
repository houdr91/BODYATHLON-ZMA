// Helpers de seguridad compartidos por API routes y auth

/** Extrae la IP real del cliente de los headers (Vercel/proxies usan x-forwarded-for). */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}

/** Delay artificial para mitigar timing attacks (no revelar si un email existe). */
export function artificialDelay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Respuesta 429 estándar con Retry-After. */
export function tooManyRequests(resetAt: number): Response {
  return Response.json(
    { error: "Demasiadas peticiones. Inténtalo más tarde." },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.max(1, Math.ceil((resetAt - Date.now()) / 1000))),
      },
    }
  );
}

/** Formato de ID de pedido visible para el usuario: #ZMA-XXXXXX */
export function formatOrderId(id: string): string {
  return `#ZMA-${id.slice(-6).toUpperCase()}`;
}
