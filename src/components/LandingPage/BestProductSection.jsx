import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import products from "../../data/products.js";

import ProductCard from "../ProductCard.jsx";

export default function BestProduct() {
	const bestProducts = products.filter((p) => p.tags.includes("best")).slice(0, 6);

	return (
		<div className='max-w-7xl mx-auto px-4 flex flex-col gap-10'>
			{/* ===== BEST PRODUCT SECTION ===== */}
			<section className='flex flex-col gap-4'>
				{/* Header */}
				<div className='flex items-center justify-between'>
					<h2 className='text-xl font-medium text-gray-900 leading-7.5'>Produk Unggulan</h2>
					<Link
						to='/browse-product'
						className='flex items-center gap-1 text-sm text-[#1a73e8] hover:underline'>
						Lihat Semua
						<ArrowRight className='w-3.5 h-3.5' />
					</Link>
				</div>

				{/* Product Grid */}
				<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
					{bestProducts.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
						/>
					))}
				</div>
			</section>
		</div>
	);
}
