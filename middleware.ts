import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { authConfig } from "@/auth.config";
import { routing } from "./routing";

const { auth } = NextAuth(authConfig);

const intlMiddleware = createMiddleware(routing);

// CRÍTICO: Bloquear el header de bypass de Next.js (CVE-2025-29927)
const BLOCKED_HEADERS = ["x-middleware-subrequest"];

export default auth((request) => {
  // 1. Bloquear headers de bypass conocidos
  for (const header of BLOCKED_HEADERS) {
    if (request.headers.has(header)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  const isLoggedIn = !!request.auth?.user;
  const { pathname } = request.nextUrl;

  // 2. Rutas /api: NUNCA se localizan (intlMiddleware las redirigiría a /es/api/...
  //    rompiendo NextAuth y todas las llamadas fetch). NextAuth (/api/auth) queda
  //    excluido del matcher, pero por defensa en profundidad lo dejamos pasar aquí.
  if (pathname.startsWith("/api")) {
    // APIs protegidas sin sesión → 401 JSON (barrera secundaria; el handler también verifica).
    // Nota: /api/users (registro, público) NO debe coincidir con /api/user (cuenta, protegida).
    const isProtectedApi =
      pathname === "/api/user" ||
      pathname.startsWith("/api/user/") ||
      pathname.startsWith("/api/orders") ||
      pathname.startsWith("/api/settings");

    if (!isLoggedIn && isProtectedApi) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // 3. Detectar el locale actual desde la URL (ej. /es/dashboard → "es")
  const localeMatch = pathname.match(/^\/(es|en|de|fr)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  // Rutas de auth: /[locale]/login, /[locale]/register
  const isAuthPage =
    /^\/(es|en|de|fr)\/login(\/|$)/.test(pathname) ||
    /^\/(es|en|de|fr)\/register(\/|$)/.test(pathname);

  // Páginas protegidas: /[locale]/dashboard, /[locale]/checkout
  const isProtectedPage =
    /^\/(es|en|de|fr)\/dashboard(\/|$)/.test(pathname) ||
    /^\/(es|en|de|fr)\/checkout(\/|$)/.test(pathname);

  // 4. Páginas protegidas sin sesión → login con callbackUrl
  if (!isLoggedIn && isProtectedPage) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Usuario autenticado en páginas de auth → dashboard
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // 6. Delegar al middleware de next-intl para detección/redirección de locale
  return intlMiddleware(request);
});

export const config = {
  matcher: [
    // Todo EXCEPTO: rutas de API, internos de Next, /logout y archivos con extensión.
    // Así /api/auth (NextAuth) y /logout nunca pasan por next-intl ni se localizan.
    "/((?!api|_next|_vercel|logout|.*\\..*).*)",
  ],
};
