<<<<<<< HEAD
import { useContext } from "react";
import { CheckCircle, Shield, Lock } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import CartContext from "../../context/CartContext";

const shippingLabels = {
	"jne-reg": "JNE Reguler · 3-5 hari kerja",
	"jne-exp": "JNE Express · 1-2 hari kerja",
	"same-day": "Same Day Delivery · Hari ini (sebelum 16.00)",
};

const paymentLabels = {
	bca: "Virtual Account BCA",
	bni: "Virtual Account BNI",
	card: "Kartu Kredit / Debit",
	gopay: "GoPay",
	ovo: "OVO",
	dana: "Dana",
};

const formatRp = (n) => "Rp " + n.toLocaleString("id-ID").replace(/\./g, ".");
const parsePrice = (priceStr) => Number(String(priceStr).replace(/[^0-9]/g, ""));
const formatDate = (date) => date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

export default function CheckoutStep3() {
	const navigate = useNavigate();
	const { checkoutData } = useOutletContext();
	const { placeOrder } = useContext(AuthContext);
	const { cart } = useContext(CartContext);

	const { shipping, shippingMethod, paymentMethod } = checkoutData;

	const total = cart.reduce((sum, item) => sum + parsePrice(item.discountPrice) * item.qty, 0);

	const handlePay = () => {
		const order = placeOrder({
			id: "BM" + new Date().getTime(),
			date: formatDate(new Date()),
			status: "Diproses",
			products: cart.map((item) => ({
				img: item.image,
				name: item.name,
				qty: item.qty,
				price: item.discountPrice,
			})),
			total: formatRp(total),
			totalRaw: total,
			canReview: false,
			shipping,
			shippingMethod,
			paymentMethod,
		});

		if (order) {
			navigate(`/success`);
		}
	};

	return (
		<>
			{/* Left: Order Confirmation */}
			<div className='flex-1 flex flex-col gap-4 bg-white border border-black/10 rounded-2xl p-6'>
				{/* Heading */}
				<div className='flex items-center gap-2'>
					<CheckCircle
						className='w-5 h-5 text-[#1a73e8]'
						strokeWidth={2}
					/>
					<span className='text-base font-medium text-gray-900'>Konfirmasi Pesanan</span>
				</div>

				{/* Alamat Pengiriman */}
				<div className='flex flex-col gap-1.5 bg-gray-100/30 rounded-xl p-4'>
					<p className='text-sm font-medium text-gray-900 mb-0.5'>Alamat Pengiriman</p>
					<span className='text-sm text-gray-500'>
						{shipping?.nama} · {shipping?.telepon}
					</span>
					<span className='text-sm text-gray-500'>
						{shipping?.alamat}, {shipping?.kota}, {shipping?.provinsi} {shipping?.kodePos}
					</span>
				</div>

				{/* Metode Pengiriman */}
				<div className='flex flex-col gap-1.5 bg-gray-100/30 rounded-xl p-4'>
					<p className='text-sm font-medium text-gray-900 mb-0.5'>Metode Pengiriman</p>
					<span className='text-sm text-gray-500'>{shippingLabels[shippingMethod] ?? "-"}</span>
				</div>

				{/* Metode Pembayaran */}
				<div className='flex flex-col gap-1.5 bg-gray-100/30 rounded-xl p-4'>
					<p className='text-sm font-medium text-gray-900 mb-0.5'>Metode Pembayaran</p>
					<span className='text-sm text-gray-500'>{paymentLabels[paymentMethod] ?? "-"}</span>
				</div>

				{/* Produk yang Dipesan */}
				<div className='flex flex-col gap-3 bg-gray-100/30 rounded-xl p-4'>
					<p className='text-sm font-medium text-gray-900'>Produk yang Dipesan</p>
					{cart.map((item) => (
						<div
							key={item.id}
							className='flex items-center gap-3'>
							<img
								src={item.image}
								alt={item.name}
								className='w-12 h-12 rounded-lg object-cover border border-black/10'
							/>
							<div className='flex-1 flex flex-col ml-1'>
								<span className='text-sm font-medium text-gray-900'>{item.name}</span>
								<span className='text-xs text-gray-500'>x{item.qty}</span>
							</div>
							<span className='text-sm font-normal text-[#1a73e8]'>{formatRp(parsePrice(item.discountPrice) * item.qty)}</span>
						</div>
					))}
				</div>

				{/* Terms Notice */}
				<div className='flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4'>
					<Shield
						className='w-6 h-6 text-[#1a73e8] shrink-0'
						strokeWidth={2}
					/>
					<span className='text-xs text-gray-500'>Dengan menekan "Bayar Sekarang", kamu menyetujui Syarat & Ketentuan kami. Pembayaran baru akan diproses setelah kamu mengkonfirmasi di langkah ini.</span>
				</div>

				{/* Buttons */}
				<div className='flex items-center gap-3'>
					<button
						type='button'
						onClick={() => navigate("/checkout/step2")}
						className='w-24 h-12 border border-black/10 rounded-xl text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 transition-colors'>
						Kembali
					</button>
					<button
						type='button'
						onClick={handlePay}
						className='flex-1 h-12 rounded-xl bg-[#1a73e8] hover:bg-blue-600 text-white text-base font-medium flex items-center justify-center gap-2 transition-colors'>
						<Lock
							className='w-5 h-5'
							strokeWidth={2}
						/>
						<span>Bayar {formatRp(total)} Sekarang</span>
					</button>
				</div>
			</div>
		</>
	);
=======
import { CheckCircle, Shield, Lock } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import useAuth from "@/features/auth/useAuth";
import useCart from "@/features/cart/useCart";

const shippingLabels = {
  "jne-reg": "JNE Reguler · 3-5 hari kerja",
  "jne-exp": "JNE Express · 1-2 hari kerja",
  "same-day": "Same Day Delivery · Hari ini (sebelum 16.00)",
};

const paymentLabels = {
  bca: "Virtual Account BCA",
  bni: "Virtual Account BNI",
  card: "Kartu Kredit / Debit",
  gopay: "GoPay",
  ovo: "OVO",
  dana: "Dana",
};

const formatRp = (n) => "Rp " + n.toLocaleString("id-ID").replace(/\./g, ".");
const parsePrice = (priceStr) =>
  Number(String(priceStr).replace(/[^0-9]/g, ""));
const formatDate = (date) =>
  date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function CheckoutStep3() {
  const navigate = useNavigate();
  const { checkoutData } = useOutletContext();
  const { placeOrder } = useAuth();
  const { cart } = useCart();

  const { shipping, shippingMethod, paymentMethod } = checkoutData;

  const total = cart.reduce(
    (sum, item) => sum + parsePrice(item.discountPrice) * item.qty,
    0,
  );

  const handlePay = () => {
    const order = placeOrder({
      id: "BM" + new Date().getTime(),
      date: formatDate(new Date()),
      status: "pending",
      products: cart.map((item) => ({
        img: item.image,
        name: item.name,
        qty: item.qty,
        price: item.discountPrice,
      })),
      total: formatRp(total),
      totalRaw: total,
      canReview: false,
      shipping,
      shippingMethod,
      paymentMethod,
    });

    if (order) {
      navigate(`/success`);
    }
  };

  return (
    <>
      {/* Left: Order Confirmation */}
      <div className="flex-1 w-full card-base p-6 flex flex-col gap-4">
        {/* Heading */}
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" strokeWidth={2} />
          <span className="text-base font-medium text-text-primary">
            Konfirmasi Pesanan
          </span>
        </div>

        {/* Alamat Pengiriman */}
        <div className="flex flex-col gap-1.5 bg-surface/30 rounded-xl p-4">
          <p className="text-sm font-medium text-text-primary mb-0.5">
            Alamat Pengiriman
          </p>
          <span className="text-sm text-text-secondary">
            {shipping?.nama} · {shipping?.telepon}
          </span>
          <span className="text-sm text-text-secondary">
            {shipping?.alamat}, {shipping?.kota}, {shipping?.provinsi}{" "}
            {shipping?.kodePos}
          </span>
        </div>

        {/* Metode Pengiriman */}
        <div className="flex flex-col gap-1.5 bg-surface/30 rounded-xl p-4">
          <p className="text-sm font-medium text-text-primary mb-0.5">
            Metode Pengiriman
          </p>
          <span className="text-sm text-text-secondary">
            {shippingLabels[shippingMethod] ?? "-"}
          </span>
        </div>

        {/* Metode Pembayaran */}
        <div className="flex flex-col gap-1.5 bg-surface/30 rounded-xl p-4">
          <p className="text-sm font-medium text-text-primary mb-0.5">
            Metode Pembayaran
          </p>
          <span className="text-sm text-text-secondary">
            {paymentLabels[paymentMethod] ?? "-"}
          </span>
        </div>

        {/* Produk yang Dipesan */}
        <div className="flex flex-col gap-3 bg-surface/30 rounded-xl p-4">
          <p className="text-sm font-medium text-text-primary">
            Produk yang Dipesan
          </p>
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover border border-border"
              />
              <div className="flex-1 flex flex-col ml-1">
                <span className="text-sm font-medium text-text-primary">
                  {item.name}
                </span>
                <span className="text-xs text-text-secondary">x{item.qty}</span>
              </div>
              <span className="text-sm font-normal text-primary">
                {formatRp(parsePrice(item.discountPrice) * item.qty)}
              </span>
            </div>
          ))}
        </div>

        {/* Terms Notice */}
        <div className="flex items-center gap-3 bg-primary-light border border-primary-light rounded-xl p-4">
          <Shield className="w-6 h-6 text-primary shrink-0" strokeWidth={2} />
          <span className="text-xs text-text-secondary">
            Dengan menekan "Bayar Sekarang", kamu menyetujui Syarat & Ketentuan
            kami. Pembayaran baru akan diproses setelah kamu mengkonfirmasi di
            langkah ini.
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/checkout/step2")}
            className="w-24 h-12 border border-border rounded-xl text-sm font-medium text-text-primary bg-white hover:bg-surface transition-colors"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={handlePay}
            className="flex-1 h-12 rounded-xl btn-primary text-base font-medium flex items-center justify-center gap-2"
          >
            <Lock className="w-5 h-5" strokeWidth={2} />
            <span>Bayar {formatRp(total)} Sekarang</span>
          </button>
        </div>
      </div>
    </>
  );
>>>>>>> feat/newVersion
}
