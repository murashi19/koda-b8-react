// COMPONENT
import Header from "@/components/layout/Header/index";
import ButtonMessage from "@/components/common/ButtonMessage";
import Footer from "@/components/layout/Footer";

// CONTENT MAIN
import HeroSection from "@/features/landing/components/HeroSection";
import CategorySection from "@/features/landing/components/CategorySection";
import FlashDeal from "@/features/landing/components/FlashSection";
import CardPromotion from "@/features/landing/components/PromotionSection";
import NewProduct from "@/features/landing/components/NewProductSection";
import BestProduct from "@/features/landing/components/BestProductSection";
import AdvantageSection from "@/features/landing/components/AdvantageSection";

function LandingPage() {
  return (
    <>
      <Header className="fixed" />
      <ButtonMessage />
      <main className="bg-surface min-h-max w-full flex flex-col gap-16 md:gap-20 pb-4">
        <HeroSection />
        <CategorySection />
        <FlashDeal />
        <CardPromotion />
        <NewProduct />
        <BestProduct />
        <AdvantageSection />
      </main>
      <Footer />
    </>
  );
}

export default LandingPage;
