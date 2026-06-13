// Rate limiter in-memory — sin dependencias externas
// Para producción con múltiples instancias, usar Upstash Redis
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Limpiar entradas expiradas cada 5 minutos
const CLEANUP_INTERVAL = 5 * 60 * 1000;
const globalForRateLimit = globalThis as unknown as {
  rateLimitCleanup?: ReturnType<typeof setInterval>;
};
if (!globalForRateLimit.rateLimitCleanup) {
  globalForRateLimit.rateLimitCleanup = setInterval(() => {
    const now = Date.now();
    store.forEach((entry, key) => {
      if (entry.resetAt < now) store.delete(key);
    });
  }, CLEANUP_INTERVAL);
  // No mantener vivo el proceso solo por el cleanup
  globalForRateLimit.rateLimitCleanup.unref?.();
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(options: {
  identifier: string;
  limit: number;
  windowMs: number;
}): RateLimitResult {
  const { identifier, limit, windowMs } = options;
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || entry.resetAt < now) {
    const newEntry = { count: 1, resetAt: now + windowMs };
    store.set(identifier, newEntry);
    return { success: true, remaining: limit - 1, resetAt: newEntry.resetAt };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// Presets de rate limiting
export const loginRateLimit = (ip: string): RateLimitResult =>
  rateLimit({ identifier: `login:${ip}`, limit: 5, windowMs: 15 * 60 * 1000 });

export const registerRateLimit = (ip: string): RateLimitResult =>
  rateLimit({ identifier: `register:${ip}`, limit: 3, windowMs: 60 * 60 * 1000 });

export const apiRateLimit = (identifier: string): RateLimitResult =>
  rateLimit({ identifier: `api:${identifier}`, limit: 100, windowMs: 60 * 1000 });

export const passwordChangeRateLimit = (userId: string): RateLimitResult =>
  rateLimit({ identifier: `pwd:${userId}`, limit: 3, windowMs: 60 * 60 * 1000 });
