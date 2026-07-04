import CardImg1 from "../../assets/card-img.png";
import CardImg2 from "../../assets/card2-img.png";

const promos = [
	{
		id: 1,
		image: CardImg1,
		gradient: "linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0.6) 70%)",
		label: "Fashion Wanita",
		title: "Diskon s/d 50%",
		cta: "Belanja Sekarang",
	},
	{
		id: 2,
		image: CardImg2,
		gradient: "linear-gradient(to left, rgba(28,57,142,0), rgba(28,57,142,0.8) 70%)",
		label: "Elektronik Pilihan",
		title: "Harga Terbaik",
		cta: "Lihat Produk",
	},
];

export default function CardPromotion() {
	return (
		<section className='w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
			{promos.map(({ id, image, gradient, label, title, cta }) => (
				<div
					key={id}
					className='h-44 flex items-center px-6 rounded-2xl bg-cover bg-center'
					style={{
						backgroundImage: `${gradient}, url(${image})`,
					}}>
					<div className='flex flex-col gap-2 max-w-2xl'>
						<span className='text-sm text-white/80'>{label}</span>
						<span className='text-xl font-bold text-white leading-7'>{title}</span>
						<span className='w-fit px-2.5 py-1 text-sm text-white border border-white/80 rounded-xl cursor-pointer hover:bg-white/10 transition-colors'>{cta}</span>
					</div>
				</div>
			))}
		</section>
	);
}
