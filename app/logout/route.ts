import { NextResponse } from "next/server";
import { routing } from "@/routing";

// Destruye la sesión en el SERVIDOR y redirige a /[locale]/login.
// Se usa cuando el JWT es válido pero el usuario ya no existe en la DB
// (sesión huérfana tras un seed o un borrado de cuenta).
// /logout NO está en el matcher del middleware, así que nunca rebota.

const SESSION_COOKIE_PREFIXES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

export async function GET(request: Request) {
  // Leer el locale guardado en cookie (next-intl lo guarda como NEXT_LOCALE)
  const cookieHeader = request.headers.get("cookie") ?? "";
  const localeCookieMatch = cookieHeader.match(/NEXT_LOCALE=([a-z]{2})/);
  const locale =
    localeCookieMatch && routing.locales.includes(localeCookieMatch[1] as (typeof routing.locales)[number])
      ? localeCookieMatch[1]
      : routing.defaultLocale;

  const response = NextResponse.redirect(
    new URL(`/${locale}/login`, request.url)
  );

  // Borra todas las variantes de la cookie de sesión de Auth.js,
  // incluidas las troceadas (.0, .1, …) de tokens grandes.
  const cookieNames = cookieHeader
    .split(";")
    .map((part) => part.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name));

  for (const name of cookieNames) {
    if (SESSION_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix))) {
      response.cookies.set(name, "", { maxAge: 0, path: "/" });
    }
  }
  // Por si la petición llegó sin la cookie visible, borra también las estándar
  for (const name of SESSION_COOKIE_PREFIXES) {
    response.cookies.set(name, "", { maxAge: 0, path: "/" });
  }

  return response;
}
