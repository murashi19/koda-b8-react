import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import Bghero from "../../assets/bg-hero.png";
import BgFashion from "../../assets/bg-fashion.png";
import Bghome from "../../assets/bg-home.png";
const slides = [
	{
		heading: "Elektronik Pilihan, Harga Special",
		subheading: "Laptop, smartphone, headphone, dan masih banyak lagi dengan diskon hingga 40%",
		bgLeft: "#4f39f6",
		bgRight: "#8200db",
		ctaLabel: "Lihat Promo",
		bgImage: Bghero,
	},
	{
		heading: "Fashion Terkini, Tampil Percaya Diri",
		subheading: "Koleksi baju, sepatu, dan aksesoris terbaru dengan harga terjangkau",
		bgLeft: "#0f766e",
		bgRight: "#0284c7",
		ctaLabel: "Lihat Koleksi",
		bgImage: BgFashion,
	},
	{
		heading: "Belanja Kebutuhan Rumah Lebih Mudah",
		subheading: "Perabot, dekorasi, dan perlengkapan rumah dengan pengiriman cepat",
		bgLeft: "#b45309",
		bgRight: "#c2410c",
		ctaLabel: "Belanja Sekarang",
		bgImage: Bghome,
	},
];
function HeroSection() {
	const [current, setCurrent] = useState(0);

	const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
	const next = () => setCurrent((c) => (c + 1) % slides.length);

	const slide = slides[current];
	return (
		<>
			<section
				className='relative w-full h-105 overflow-hidden'
				style={{
					background: `linear-gradient(to right, ${slide.bgLeft} 50%, ${slide.bgRight} 50%)`,
					transition: "background 0.5s ease",
				}}>
				{/* Background image overlay (right half) */}
				<div
					className='absolute top-0 right-0 w-1/2 h-full bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none'
					style={{ backgroundImage: `url(${slide.bgImage})` }}
				/>

				{/* Content */}
				<div className='relative z-10 max-w-7xl mx-auto h-full flex items-center'>
					<div className='flex flex-col items-start gap-4 min-w-lg max-w-lg'>
						<h1 className='text-[40px] leading-12.5 font-bold text-white'>{slide.heading}</h1>
						<p className='text-lg leading-7.25 font-normal text-white/80'>{slide.subheading}</p>
						<button
							type='button'
							className='group flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#1a73e8] text-base font-normal border-none cursor-pointer hover:bg-[#1a73e8] hover:text-white transition-colors duration-200'>
							{slide.ctaLabel}
							<ArrowRight className='w-4 h-4' />
						</button>
					</div>
				</div>

				{/* Dots */}
				<div className='absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5'>
					{slides.map((_, i) => (
						<button
							key={i}
							onClick={() => setCurrent(i)}
							aria-label={`Slide ${i + 1}`}
							className={`h-2 rounded-full transition-all duration-300 cursor-pointer border-none ${i === current ? "w-5.5 bg-white" : "w-2 bg-white/40"}`}
						/>
					))}
				</div>

				{/* Arrow Left */}
				<button
					onClick={prev}
					aria-label='Previous slide'
					className='absolute left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors duration-200'>
					<ChevronLeft
						className='w-4 h-4 text-white'
						strokeWidth={2.5}
					/>
				</button>

				{/* Arrow Right */}
				<button
					onClick={next}
					aria-label='Next slide'
					className='absolute right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors duration-200'>
					<ChevronRight
						className='w-4 h-4 text-white'
						strokeWidth={2.5}
					/>
				</button>
			</section>
		</>
	);
}

export default HeroSection;
