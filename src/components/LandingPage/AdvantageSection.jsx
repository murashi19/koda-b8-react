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
			<section className='w-full max-w-7xl mx-auto bg-white border border-black/10 rounded-2xl px-8 py-5 flex flex-col items-center gap-5 mb-10'>
				<h2 className='text-xl font-medium text-gray-900 text-center'>Kenapa Belanja di BeliMudah?</h2>
				<div className='grid grid-cols-2 sm:grid-cols-4 gap-2 w-full'>
					{advantages.map(({ id, icon, title, description }) => (
						<div
							key={id}
							className='flex flex-col items-center text-center px-4'>
							<span className='text-2xl mb-2'>{icon}</span>
							<p className='text-sm text-gray-900 mb-1'>{title}</p>
							<p className='text-xs text-gray-500 leading-[19.5px]'>{description}</p>
						</div>
					))}
				</div>
			</section>
		</>
	);
}

export default AdvantageSection;
