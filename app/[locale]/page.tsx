import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { WhatIsZMA } from "@/components/sections/WhatIsZMA";
import { Benefits } from "@/components/sections/Benefits";
import { Ingredients } from "@/components/sections/Ingredients";
import { HowToUse } from "@/components/sections/HowToUse";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { CTAFinal } from "@/components/sections/CTAFinal";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhatIsZMA />
        <Benefits />
        <Ingredients />
        <HowToUse />
        <Testimonials />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}
