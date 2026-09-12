import { InquiryProvider } from "@/components/landing/InquiryContext";
import { Header, Hero, LineupBar, Marquee } from "@/components/landing/TopSections";
import { ProductGrid, ShopTheLook } from "@/components/landing/Products";
import { Gallery, Pillars, Reviews, Story, Tiles } from "@/components/landing/StorySections";
import { Faq } from "@/components/landing/Faq";
import { InquirySection } from "@/components/landing/InquiryForm";
import { Footer, StickyCta } from "@/components/landing/Footer";

export default function Home() {
  return (
    <InquiryProvider>
      <Marquee />
      <Header />
      <main>
        <Hero />
        <LineupBar />
        <ProductGrid />
        <Gallery />
        <Pillars />
        <ShopTheLook />
        <Story />
        <Reviews />
        <Faq />
        <InquirySection />
        <Tiles />
      </main>
      <Footer />
      <StickyCta />
    </InquiryProvider>
  );
}
