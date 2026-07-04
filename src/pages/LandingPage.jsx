// COMPONENT
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
}

export default LandingPage;
