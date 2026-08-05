// COMPONENT
<<<<<<< HEAD
import Header from "../components/Header";
import ButtonMessage from "../components/ButtonMessage";
import Footer from "../components/Footer";

// CONTENT MAIN
import HeroSection from "../components/LandingPage/HeroSection";
import CategorySection from "../components/LandingPage/CategorySection";
import FlashDeal from "../components/LandingPage/FlashSection";
import CardPromotion from "../components/LandingPage/PromotionSection";
import NewProduct from "../components/LandingPage/NewProductSection";
import BestProduct from "../components/LandingPage/BestProductSection";
import AdvantageSection from "../components/LandingPage/AdvantageSection";

function LandingPage() {
	return (
		<>
			<Header className='fixed' />
			<ButtonMessage />
			<main className='bg-[#f3f4f6] min-h-max w-full flex flex-col gap-10'>
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
=======
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
>>>>>>> feat/newVersion
}

export default LandingPage;
