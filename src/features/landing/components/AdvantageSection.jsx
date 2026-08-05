const advantages = [
	{
		id: 1,
		icon: "🚚",
		title: "Gratis Ongkir",
		description: "Gratis ongkos kirim untuk pembelian di atas Rp 100.000 ke seluruh Indonesia",
	},
	{
		id: 2,
		icon: "🔒",
		title: "Pembayaran Aman",
		description: "Transaksi terenkripsi SSL 256-bit, data kamu selalu terlindungi",
	},
	{
		id: 3,
		icon: "↩️",
		title: "Pengembalian Mudah",
		description: "Tidak puas? Kembalikan dalam 30 hari tanpa biaya tambahan",
	},
	{
		id: 4,
		icon: "🎧",
		title: "Dukungan 24/7",
		description: "Tim kami siap membantu kapan saja melalui chat, telepon, atau email",
	},
];
function AdvantageSection() {
	return (
		<>
			<section className='w-full container-page px-4 xl:px-0'>
				<div className='bg-card border border-border rounded-2xl px-8 py-10 flex flex-col items-center gap-8 shadow-sm'>
				<h2 className='font-display text-xl md:text-2xl font-bold text-text-primary text-center'>Kenapa Belanja di BeliMudah?</h2>
				<div className='grid grid-cols-2 sm:grid-cols-4 gap-6 w-full'>
					{advantages.map(({ id, icon, title, description }) => (
						<div
							key={id}
							className='flex flex-col items-center text-center px-4'>
							<div className='w-14 h-14 flex items-center justify-center rounded-full bg-primary-light text-2xl mb-3'>{icon}</div>
							<p className='text-sm font-semibold text-text-primary mb-1'>{title}</p>
							<p className='text-xs text-text-secondary leading-[19.5px]'>{description}</p>
						</div>
					))}
				</div>
				</div>
			</section>
		</>
	);
}

export default AdvantageSection;
