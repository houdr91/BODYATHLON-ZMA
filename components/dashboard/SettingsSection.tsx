interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
}

// Wrapper de sección de ajustes — card glass coherente con la landing
export function SettingsSection({
  title,
  description,
  children,
  danger = false,
}: SettingsSectionProps) {
  return (
    <section
      className={`rounded-2xl border p-6 sm:p-8 ${
        danger
          ? "border-red-500/30 bg-red-950/20"
          : "glass border-white/[0.08]"
      }`}
    >
      <h2
        className={`font-display text-2xl tracking-wide ${
          danger ? "text-red-300" : "text-white"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-1.5 max-w-xl text-sm text-slate-400">{description}</p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}
