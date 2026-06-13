import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "de", "fr"],
  defaultLocale: "es",
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
