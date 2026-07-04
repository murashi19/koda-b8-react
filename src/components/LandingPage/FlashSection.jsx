import { useState, useEffect } from "react";
import { Zap, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import products from "../../data/products.js";
import ProductCard from "../ProductCard.jsx";

// Countdown timer — mulai dari 5 jam 21 menit 38 detik
const Timer = 5 * 3600 + 21 * 60 + 38;

function useCountdown(initialSeconds) {
	const [seconds, setSeconds] = useState(initialSeconds);

	useEffect(() => {
		const interval = setInterval(() => {
			setSeconds((s) => (s > 0 ? s - 1 : 0));
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
	const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
	const s = String(seconds % 60).padStart(2, "0");
	return { h, m, s };
}

export default function FlashDeal() {
	const { h, m, s } = useCountdown(Timer);

	// Tampilkan hanya 4 produk pertama
	const flashProducts = products.filter((p) => p.tags.includes("flash")).slice(0, 4);
	return (
		<section className='max-w-7xl mx-auto px-4 flex flex-col gap-4'>
			{/* Header */}
			<div className='flex items-center justify-between mb-2'>
				<div className='flex items-center gap-4'>
					{/* Label Flash Deal */}
					<div className='flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg'>
						<Zap
							className='w-4 h-4'
							strokeWidth={1.5}
						/>
						<span className='text-sm font-semibold'>Flash Deal</span>
					</div>

					{/* Timer */}
					<div className='flex items-center gap-1 text-sm text-gray-500'>
						<Clock
							className='w-3.5 h-3.5'
							strokeWidth={1.5}
						/>
						<span>Berakhir dalam:</span>
						<span className='font-medium tabular-nums'>
							{h} : {m} : {s}
						</span>
					</div>
				</div>

				<Link
					to='/browse-product'
					className='flex items-center gap-1 text-sm text-[#1a73e8] hover:underline'>
					Lihat Semua
					<ArrowRight className='w-3.5 h-3.5' />
				</Link>
			</div>

			{/* Product Grid */}
			<div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				{flashProducts.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
					/>
				))}
			</div>
		</section>
	);
}
