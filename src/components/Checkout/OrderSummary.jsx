import { useContext } from "react";
import CartContext from "../../context/CartContext";

export default function OrderSummary() {
	const { cart } = useContext(CartContext);

	const parsePrice = (priceStr) => Number(String(priceStr).replace(/[^0-9]/g, ""));
	const formatRp = (n) => "Rp " + n.toLocaleString("id-ID").replace(/\./g, ".");

	const subtotal = cart.reduce((sum, item) => sum + parsePrice(item.discountPrice) * item.qty, 0);

	return (
		<>
			<div className='w-80 flex flex-col gap-4 bg-white border border-black/10 rounded-2xl p-5'>
				<h2 className='text-base font-medium text-gray-900'>Ringkasan Pesanan</h2>

				{/* Product List */}
				<div className='flex flex-col gap-3 max-h-64 overflow-y-auto pr-1'>
					{cart.length === 0 ? (
						<p className='text-sm text-gray-400 text-center py-4'>Tidak ada produk di pesanan</p>
					) : (
						cart.map((item) => (
							<div
								key={item.id}
								className='flex items-center gap-3'>
								<img
									src={item.image}
									alt={item.name}
									className='w-14 h-14 rounded-xl object-cover border border-black/10 shrink-0'
								/>
								<div className='flex-1 min-w-0'>
									<p className='text-sm font-medium text-gray-900 leading-snug truncate'>{item.name}</p>
									<p className='text-xs text-gray-500 mt-0.5'>x{item.qty}</p>
								</div>
								<span className='text-sm text-gray-700 shrink-0'>{formatRp(parsePrice(item.discountPrice) * item.qty)}</span>
							</div>
						))
					)}
				</div>

				<hr className='border-black/10' />

				{/* Price Breakdown */}
				<div className='flex flex-col gap-2.5'>
					<div className='flex justify-between text-sm text-gray-500'>
						<span>Subtotal</span>
						<span>{formatRp(subtotal)}</span>
					</div>
					<div className='flex justify-between text-sm text-gray-500'>
						<span>Ongkir</span>
						<span className='text-green-600 font-medium'>GRATIS</span>
					</div>
					<hr className='border-black/10' />
					<div className='flex justify-between text-sm font-semibold text-gray-900'>
						<span>Total</span>
						<span className='text-[#1a73e8]'>{formatRp(subtotal)}</span>
					</div>
				</div>

				{/* Security Note */}
				<p className='text-xs text-gray-500 text-center'>🔒 Pembayaran aman dan terenkripsi</p>
			</div>
		</>
	);
}
