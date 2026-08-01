import { Link } from "react-router-dom";
import { HiOutlineBars3 } from "react-icons/hi2";
import { IoChevronDownOutline } from "react-icons/io5";
import { MdOutlineComputer, MdOutlineCheckroom, MdOutlineKitchen, MdOutlineMenuBook } from "react-icons/md";
import { PiSparkle } from "react-icons/pi";
import { IoFootballOutline } from "react-icons/io5";

import category from "@/features/products/data/category";

const categoryIcons = {
	elektronik: MdOutlineComputer,
	fashion: MdOutlineCheckroom,
	"rumah-dapur": MdOutlineKitchen,
	kecantikan: PiSparkle,
	olahraga: IoFootballOutline,
	"buku-dan-alat-tulis": MdOutlineMenuBook,
};

function NavHeader() {
	return (
		<nav className='w-full border-b border-border bg-white hidden md:block'>
			<div className='container-page px-4 xl:px-0'>
				<ul className='flex items-center gap-8 text-sm text-text-secondary py-3'>
					<li>
						<Link
							to='/browse-product'
							className='flex items-center gap-2 text-text-primary font-semibold whitespace-nowrap'>
							<HiOutlineBars3 className='w-5 h-5' />
							<span>Semua Kategori</span>
							<IoChevronDownOutline className='w-3.5 h-3.5' />
						</Link>
					</li>

					{category.map((item) => {
						const Icon = categoryIcons[item.slug];

						return (
							<li key={item.id}>
								<Link
									to={`/browse-product/${item.slug}`}
									className='flex items-center gap-2 hover:text-primary transition-colors duration-300 whitespace-nowrap'>
									{Icon && <Icon size={18} />}
									<span>{item.name}</span>
								</Link>
							</li>
						);
					})}

					<li className=''>
						<Link
							to='/browse-product'
							className='flex items-center gap-1.5 text-accent font-semibold hover:text-accent-dark transition-colors duration-300 whitespace-nowrap'>
							🔥 Promo
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default NavHeader;
