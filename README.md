<div align="center">

# 🏋️ Bodyathlon ZMA

### Plataforma de venta profesional para suplemento deportivo ZMA

**Full-Stack · Next.js 14 · TypeScript · Prisma · NextAuth · Framer Motion**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/houdr91/BODYATHLON-ZMA)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io)

</div>

---

## 📸 Vista previa

> Landing page de venta completa con diseño oscuro de marca premium, animaciones avanzadas y sistema de autenticación funcional.

---

## 🎯 Qué es este proyecto

Bodyathlon ZMA es una **plataforma de e-commerce completa** construida desde cero como proyecto de portfolio. Demuestra la capacidad de desarrollar una aplicación web full-stack profesional con:

- **Landing page de alta conversión** — 8 secciones con psicología de ventas, animaciones con GSAP y Framer Motion, diseño de marca premium
- **Sistema de autenticación completo** — Registro, login, protección de rutas, brute-force protection, hashing con bcrypt
- **Dashboard de usuario** — Perfil editable, historial de pedidos con estados, ajustes de seguridad, gestión de notificaciones y privacidad
- **Internacionalización (i18n)** — La página completa en 4 idiomas (ES, EN, DE, FR) con detección automática del navegador
- **Seguridad production-ready** — Headers HTTP de seguridad, rate limiting, protección CVE-2025-29927, validación de inputs con Zod

---

## ✨ Funcionalidades

### 🛍️ Landing Page de Venta
- Hero con partículas animadas y producto en 3D flotante
- Sección educativa sobre el producto (qué es ZMA y sus beneficios científicos)
- Grid de 6 beneficios con iconos y animaciones reveal on scroll
- Tabla de ingredientes con dosis y biodisponibilidad
- Guía de uso paso a paso
- Testimonios de clientes con avatares y valoraciones
- FAQ con acordeón animado
- CTA final con countdown de oferta y badges de confianza
- Smooth scroll con Lenis + ScrollTrigger sincronizado

### 🔐 Autenticación
- Registro con validación en tiempo real (barra de fuerza de contraseña, checklist de requisitos)
- Login con show/hide password y shake animation en error
- Protección anti-brute force (bloqueo de cuenta tras 5 intentos fallidos, 15 min)
- Rate limiting por IP en endpoints de auth
- Sesiones JWT con NextAuth.js v5

### 👤 Dashboard de Usuario
- **Resumen** — Cards con estadísticas personales y notificaciones recientes
- **Mis pedidos** — Lista completa con badges de estado, código de seguimiento, timeline
- **Mi perfil** — Editar nombre, teléfono, bio, dirección de envío, indicador de completitud
- **Seguridad** — Cambiar contraseña, ver sesión activa, historial de accesos
- **Notificaciones** — Gestionar preferencias de comunicación
- **Privacidad** — Descargar datos personales (JSON), eliminar cuenta con confirmación

### 🌍 Internacionalización
- 4 idiomas: Español 🇪🇸, Inglés 🇬🇧, Alemán 🇩🇪, Francés 🇫🇷
- Detección automática del idioma del navegador
- Selector elegante en el navbar con banderas
- Traducciones completas en toda la web (landing, auth, dashboard)
- URLs por idioma: `/es/`, `/en/`, `/de/`, `/fr/`

### 🔒 Seguridad
- Variables de entorno nunca en el repositorio
- Headers HTTP: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- Protección CVE-2025-29927 (middleware bypass de Next.js)
- Rate limiting en todos los endpoints sensibles
- Doble verificación de sesión (middleware + Server Components)
- Inputs sanitizados y validados con Zod en cliente y servidor
- Contraseñas hasheadas con bcrypt (12 rounds)

---

## 🧱 Stack tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript (strict) |
| Estilos | Tailwind CSS v3 + shadcn/ui |
| Animaciones | Framer Motion + GSAP + Lenis |
| Auth | NextAuth.js v5 (Credentials Provider) |
| Base de datos | Prisma ORM + SQLite (dev) / PostgreSQL (prod) |
| Validación | Zod + React Hook Form |
| i18n | next-intl |
| Iconos | Lucide React |
| Fuentes | Inter + Bebas Neue (Google Fonts) |
| Deploy | Vercel |

---

## 🚀 Instalación y uso local

### Requisitos previos
- Node.js 18+
- npm o pnpm

### 1. Clonar el repositorio

```bash
git clone https://github.com/houdr91/BODYATHLON-ZMA.git
cd BODYATHLON-ZMA
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` y rellena los valores:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="genera-con-openssl-rand-base64-32"
AUTH_SECRET="el-mismo-valor-que-NEXTAUTH_SECRET"
NEXTAUTH_URL="http://localhost:3000"
```

Para generar el `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Configurar la base de datos

```bash
npx prisma db push
npx prisma generate
```

### 5. Cargar datos de prueba (opcional)

```bash
npx prisma db seed
```

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🧪 Cuenta de prueba

Para explorar el dashboard y todas las funcionalidades del área privada, puedes usar esta cuenta de demo:

| Campo | Valor |
|-------|-------|
| **Email** | `test@bodyathlon.com` |
| **Contraseña** | `Test1234!` |

> Esta cuenta tiene pedidos de ejemplo en diferentes estados para demostrar todas las funcionalidades del historial de compras.

---

## 🌍 Deploy en Vercel

### 1. Conectar repositorio
1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz click en **"Add New Project"**
3. Importa el repositorio `houdr91/BODYATHLON-ZMA`

### 2. Base de datos de producción
Para producción necesitas una base de datos PostgreSQL. Opciones gratuitas:
- [Neon](https://neon.tech) — PostgreSQL serverless (plan gratuito generoso)
- [Supabase](https://supabase.com) — PostgreSQL + extras (plan gratuito)

> Recuerda cambiar el `provider` del datasource en `prisma/schema.prisma` de `sqlite` a `postgresql` antes del deploy en producción.

### 3. Variables de entorno en Vercel
En **Settings → Environment Variables**, añade:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | URL de PostgreSQL de Neon/Supabase |
| `NEXTAUTH_SECRET` | Secret generado con `openssl rand -base64 32` (uno NUEVO, diferente al de dev) |
| `AUTH_SECRET` | El mismo valor que `NEXTAUTH_SECRET` |
| `NEXTAUTH_URL` | `https://tu-proyecto.vercel.app` |
| `NODE_ENV` | `production` |

### 4. Deploy
Vercel detecta automáticamente que es un proyecto Next.js. El deploy es automático en cada push a `main`.

---

## 📁 Estructura del proyecto

```
bodyathlon-zma/
├── app/
│   └── [locale]/           # Rutas por idioma (es, en, de, fr)
│       ├── page.tsx         # Landing page
│       ├── (auth)/          # Login y registro
│       └── dashboard/       # Área privada de usuario
├── components/
│   ├── sections/            # Secciones de la landing
│   ├── auth/                # Formularios de autenticación
│   └── dashboard/           # Componentes del área de usuario
├── lib/
│   ├── auth.ts              # Configuración NextAuth
│   ├── db.ts                # Cliente Prisma
│   ├── rate-limiter.ts      # Rate limiting in-memory
│   └── server-only-db.ts    # Capa de datos protegida
├── messages/                # Traducciones i18n
│   ├── es.json
│   ├── en.json
│   ├── de.json
│   └── fr.json
├── prisma/
│   ├── schema.prisma        # Modelos de base de datos
│   └── seed.ts              # Datos de prueba
├── middleware.ts             # Auth + i18n + seguridad
├── i18n.ts                  # Configuración next-intl
├── .env.example             # Plantilla de variables (sin valores)
└── next.config.mjs          # Config Next.js + headers de seguridad
```

---

## 🔒 Seguridad y contribuciones

Este proyecto está configurado para ser seguro en un repositorio público:

- ✅ `.env.local` está en `.gitignore` — nunca se sube a GitHub
- ✅ `.env.example` documenta las variables necesarias sin valores reales
- ✅ Los secrets van en **Vercel Environment Variables** (cifrados)
- ✅ No hay API keys ni contraseñas hardcodeadas en el código fuente

Si encuentras alguna vulnerabilidad de seguridad, por favor abre un issue.

---

## 📄 Licencia

MIT License — libre para usar como referencia o base para proyectos personales.

---

<div align="center">

**Construido con ❤️ como proyecto de portfolio**

[Ver demo en Vercel](https://bodyathlon-zma.vercel.app) · [Repositorio](https://github.com/houdr91/BODYATHLON-ZMA)

</div>
