import { Truck, Shield, RefreshCw, Headphones, MapPin, Phone, Mail } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";

const featureCards = [
	{
		icon: Truck,
		title: "Gratis Ongkir",
		description: "Pembelian di atas Rp 100.000",
	},
	{
		icon: Shield,
		title: "Pembayaran Aman",
		description: "SSL terenkripsi 256-bit",
	},
	{
		icon: RefreshCw,
		title: "Pengembalian Mudah",
		description: "30 hari pengembalian gratis",
	},
	{
		icon: Headphones,
		title: "Dukungan 24/7",
		description: "Bantuan kapan saja",
	},
];

const layananLinks = ["Tentang Kami", "Karir", "Blog", "Program Afiliasi", "Jual di BeliMudah"];

const bantuanLinks = ["Cara Belanja", "Kebijakan Pengembalian", "Lacak Pesanan", "FAQ", "Hubungi Kami"];

const socialLinks = [
	{ icon: FaFacebookF, label: "Facebook" },
	{ icon: FaInstagram, label: "Instagram" },
	{ icon: FaXTwitter, label: "Twitter" },
	{ icon: FaYoutube, label: "Youtube" },
];

const contactItems = [
	{
		icon: MapPin,
		text: "Jl. Sudirman No. 1, Jakarta Selatan, DKI Jakarta 12190",
	},
	{ icon: Phone, text: "0800-1234-5678 (Gratis)" },
	{ icon: Mail, text: "bantuan@belimudah.id" },
];

export default function Footer() {
	return (
		<footer className='w-full max-w-full pt-20 overflow-hidden'>
			<div className='w-full bg-secondary'>
				{/* Heading: Feature Cards */}
				<div className='border-b border-white/10'>
					<div className='container-page grid min-w-0 grid-cols-1 gap-5 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4 xl:px-0'>
						{featureCards.map(({ icon: Icon, title, description }) => (
							<div
								key={title}
								className='flex min-w-0 items-center gap-3'>
								<div className='w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0'>
									<Icon
										className='text-primary'
										strokeWidth={2}
									/>
								</div>
								<div className='min-w-0'>
									<p className='text-sm font-normal text-white leading-5'>{title}</p>
									<p className='text-xs text-white/60 leading-4'>{description}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Middle Footer */}
				<div className='container-page grid min-w-0 grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 xl:px-0'>
					{/* Column 1: Brand */}
					<div className='min-w-0'>
						<div className='flex items-center gap-2 mb-4'>
							<div className='w-8 h-8 rounded-lg bg-primary flex items-center justify-center'>
								<span className='text-white font-bold text-sm'>B</span>
							</div>
							<span className='text-white text-lg font-normal'>BeliMudah</span>
						</div>
						<p className='text-sm text-white/60 leading-relaxed mb-4'>Platform belanja online terpercaya dengan ribuan produk pilihan. Belanja mudah, aman, dan menyenangkan.</p>
						<div className='flex items-center gap-2'>
							{socialLinks.map(({ icon: Icon, label }) => (
								<button
									key={label}
									aria-label={label}
									className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors'>
									<Icon
										className='w-3.5 h-3.5 text-white/80'
										strokeWidth={1.5}
									/>
								</button>
							))}
						</div>
					</div>

					{/* Column 2: Layanan */}
					<div className='min-w-0'>
						<h3 className='text-white text-lg font-medium mb-4'>Layanan</h3>
						<ul className='space-y-3'>
							{layananLinks.map((link) => (
								<li key={link}>
									<a
										href='#'
										className='text-white/60 text-sm hover:text-white transition-colors'>
										{link}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Column 3: Bantuan */}
					<div className='min-w-0'>
						<h3 className='text-white text-lg font-medium mb-4'>Bantuan</h3>
						<ul className='space-y-3'>
							{bantuanLinks.map((link) => (
								<li key={link}>
									<a
										href='#'
										className='text-white/60 text-sm hover:text-white transition-colors'>
										{link}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Column 4: Kontak & Newsletter */}
					<div className='min-w-0'>
						<h3 className='text-white text-lg font-medium mb-4'>Kontak</h3>
						<ul className='space-y-3 mb-4'>
							{contactItems.map(({ icon: Icon, text }) => (
								<li
									key={text}
									className='flex items-start gap-2'>
									<Icon
										className='w-3.5 h-3.5 text-white/60 mt-0.5 shrink-0'
										strokeWidth={2}
									/>
									<span className='min-w-0 break-words text-sm leading-5 text-white/60'>{text}</span>
								</li>
							))}
						</ul>

						{/* Newsletter */}
						<div className='min-w-0 rounded-xl bg-white/5 p-3'>
							<p className='text-white text-xs mb-2.5'>Newsletter</p>
							<div className='flex min-w-0 flex-col gap-2 xl:flex-row xl:items-center'>
								<input
									type='email'
									placeholder='Email Kamu'
									className='h-9 w-full min-w-0 flex-1 rounded-md border border-white/10 bg-white/10 px-3 text-xs text-white outline-none placeholder-white/40 transition-colors focus:border-primary'
								/>
								<button
									type='button'
									className='btn-primary h-9 w-full whitespace-nowrap rounded-md px-3 text-xs font-medium xl:w-auto'>
									Langganan
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* <!-- Copyright --> */}
				<div className='container-page flex min-w-0 flex-col items-center justify-between gap-4 px-4 py-5 text-center md:flex-row md:text-left xl:px-0'>
					<p className='text-sm text-white/60'>© 2026 BeliMudah. Seluruh hak cipta dilindungi.</p>
					<div className='flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-end'>
						<p className='text-sm text-white/60'>Kebijakan Privasi</p>
						<p className='text-sm text-white/60'>Syarat &amp; Ketentuan</p>
						<p className='text-sm text-white/60'>Admin</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
