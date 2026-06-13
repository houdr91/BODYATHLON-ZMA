import { setRequestLocale } from "next-intl/server";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dark-400 px-4 py-12">
      {/* Atmósfera: gimnasio de noche */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 30% 20%, rgba(22,163,74,0.16), transparent 65%), radial-gradient(ellipse 55% 45% at 80% 85%, rgba(20,83,45,0.22), transparent 65%), linear-gradient(180deg, #050505 0%, #0a0f0b 60%, #050505 100%)",
        }}
        aria-hidden="true"
      />
      {/* Silueta de atleta entrenando (barra con discos) */}
      <svg
        viewBox="0 0 900 600"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.13]"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <g fill="#0c1f12">
          <rect x="0" y="520" width="900" height="80" />
          <rect x="180" y="300" width="540" height="14" rx="7" />
          <ellipse cx="215" cy="307" rx="34" ry="78" />
          <ellipse cx="262" cy="307" rx="22" ry="56" />
          <ellipse cx="685" cy="307" rx="34" ry="78" />
          <ellipse cx="638" cy="307" rx="22" ry="56" />
          <circle cx="450" cy="280" r="26" />
          <path d="M424 300 Q450 290 476 300 L484 360 Q450 376 416 360 Z" />
          <path d="M420 358 L398 430 L416 436 L442 372 Z" />
          <path d="M480 358 L502 430 L484 436 L458 372 Z" />
          <path d="M398 428 L388 520 L412 520 L420 436 Z" />
          <path d="M502 428 L512 520 L488 520 L480 436 Z" />
          <path d="M428 304 L398 314 L390 308 L420 294 Z" />
          <path d="M472 304 L502 314 L510 308 L480 294 Z" />
        </g>
        <ellipse cx="450" cy="80" rx="280" ry="120" fill="#16a34a" opacity="0.06" />
      </svg>
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div className="relative z-10 flex w-full justify-center">{children}</div>
    </div>
  );
}
