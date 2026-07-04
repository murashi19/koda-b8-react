import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import category from "../../data/category";
import products from "../../data/products";

function CategorySection() {
	const categoriesWithCount = category.map((category) => ({
		...category,
		totalProduct: products.filter((product) => product.category === category.name).length,
	}));
	return (
		<>
			<section className='py-10'>
				<div className='max-w-7xl mx-auto px-4'>
					{/* Header kategori */}
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-2xl font-semibold text-gray-900'>Belanja Berdasarkan Kategori</h2>
						<Link
							to='/browse-product'
							className='flex items-center gap-1 text-sm text-[#1a73e8] hover:underline'>
							Lihat Semua
							<ArrowRight className='w-4 h-4' />
						</Link>
					</div>

					{/* List kategori */}
					<ul className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'>
						{categoriesWithCount.map(({ id, slug, name, image, totalProduct }) => (
							<li key={id}>
								<Link
									to={`/browse-product/${slug}`}
									className='flex flex-col items-center gap-2 bg-white rounded-xl p-4 hover:shadow-md transition-shadow duration-200'>
									<img
										src={image}
										alt={name}
										className='w-16 h-16 object-cover rounded-lg'
									/>
									<span className='text-sm font-medium text-gray-800 text-center'>{name}</span>
									<span className='text-xs text-gray-400'>{totalProduct} Produk</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</section>
		</>
	);
}

export default CategorySection;
