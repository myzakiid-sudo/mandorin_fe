import HeroSection from "@/components/features/beranda/herosection";
import KeamananSection from "@/components/features/beranda/keamanansection";
import LayananSection from "@/components/features/beranda/layanansection";
import TestimonialSection from "@/components/features/beranda/testimonialsection";
import TigaLangkahSection from "@/components/features/beranda/tigalangkahsection";

export default function BerandaPage() {
  return (
    <main>
      <HeroSection />
      <LayananSection />
      <TigaLangkahSection />
      <KeamananSection />
      <TestimonialSection />
    </main>
  );
}
