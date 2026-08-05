<<<<<<< HEAD
import { CircleCheckBig, Truck, MapPin, Package, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";

const shippingLabels = {
	"jne-reg": "JNE Reguler",
	"jne-exp": "JNE Express",
	"same-day": "Same Day Delivery",
};

const orderStatuses = [
	{
		id: "received",
		icon: (
			<CircleCheckBig
				className='w-4.5 h-4.5 text-green-500'
				strokeWidth={2}
			/>
		),
		iconBg: "bg-green-100",
		label: "Pesanan Diterima",
		sub: "Baru saja",
		done: true,
	},
	{
		id: "packing",
		icon: (
			<Package
				className='w-4.5 h-4.5 text-gray-500'
				strokeWidth={2}
			/>
		),
		iconBg: "bg-gray-200",
		label: "Sedang Dikemas",
		sub: "Estimasi 1-2 jam",
		done: false,
	},
	{
		id: "shipping",
		icon: (
			<Truck
				className='w-4.5 h-4.5 text-gray-500'
				strokeWidth={2}
			/>
		),
		iconBg: "bg-gray-200",
		label: "Dalam Pengiriman",
		sub: "3-5 hari kerja",
		done: false,
	},
	{
		id: "delivered",
		icon: (
			<MapPin
				className='w-4.5 h-4.5 text-gray-500'
				strokeWidth={2}
			/>
		),
		iconBg: "bg-gray-200",
		label: "Terkirim",
		sub: "Estimasi mengikuti metode pengiriman",
		done: false,
	},
];

export default function CheckoutSuccess() {
	const navigate = useNavigate();
	const { data: orders } = useLocalStorage("orders");
	console.log("DEBUG orders:", orders);

	const order = orders[orders.length - 1];
	console.log("DEBUG order (terakhir):", order);
	if (!order) {
		return (
			<main className='min-h-screen max-w-[1728px] mx-auto flex flex-col items-center justify-center gap-4 px-4 py-12'>
				<p className='text-gray-500 text-sm'>Tidak ada pesanan yang ditemukan.</p>
				<button
					type='button'
					onClick={() => navigate("/")}
					className='px-5 py-2.5 rounded-xl bg-[#1a73e8] hover:bg-blue-500 text-white text-sm font-medium transition-colors'>
					Kembali Belanja
				</button>
			</main>
		);
	}

	return (
		<>
			<main className='min-h-screen max-w-[1728px] mx-auto'>
				<div className='flex flex-col items-center justify-start gap-8 px-4 py-12'>
					{/* Success Icon */}
					<div className='w-24 h-24 rounded-full bg-green-100 flex items-center justify-center'>
						<CircleCheckBig
							className='w-12 h-12 text-green-500'
							fill='#DCFCE7'
							strokeWidth={2}
						/>
					</div>

					{/* Success Text */}
					<div className='flex flex-col items-center gap-2.5 text-center'>
						<h1 className='text-2xl font-semibold text-gray-900'>Pesanan Berhasil! 🎉</h1>
						<span className='text-base font-normal text-gray-500'>Terimakasih telah berbelanja di BeliMudah. Pesananmu sedang diproses</span>
					</div>

					{/* Card: Order Info */}
					<div className='w-160 flex flex-col gap-4 bg-white border border-black/10 rounded-2xl p-4'>
						{/* Order Number & Total */}
						<div className='flex justify-between items-center'>
							<div className='flex flex-col gap-0.5'>
								<span className='text-sm font-normal text-gray-500'>No. Pesanan</span>
								<span className='text-base font-bold text-[#1a73e8]'>#{order?.id}</span>
							</div>
							<div className='flex flex-col items-end gap-0.5'>
								<span className='text-sm font-normal text-gray-500'>Total Pembayaran</span>
								<span className='text-base font-bold text-gray-900'>{order?.total}</span>
							</div>
						</div>

						{/* Divider */}
						<hr className='border-black/10' />

						{/* Shipping Info */}
						<div className='flex flex-col gap-3'>
							<div className='flex items-start gap-3'>
								<Truck
									className='w-4.5 h-4.5 text-[#1a73e8] shrink-0 mt-0.5'
									strokeWidth={2}
								/>
								<div className='flex flex-col'>
									<span className='text-sm text-gray-900'>{shippingLabels[order.shippingMethod] ?? "-"}</span>
									<span className='text-xs text-gray-500'>Pesanan dibuat: {order.date}</span>
								</div>
							</div>
							<div className='flex items-start gap-3'>
								<MapPin
									className='w-4.5 h-4.5 text-[#1a73e8] shrink-0 mt-0.5'
									strokeWidth={2}
								/>
								<div className='flex flex-col'>
									<span className='text-sm text-gray-900'>Alamat Pengiriman</span>
									<span className='text-xs text-gray-500'>
										{order.shipping?.alamat}, {order.shipping?.kota}, {order.shipping?.provinsi} {order.shipping?.kodePos}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Card: Order Status */}
					<div className='w-160 bg-white border border-black/10 rounded-2xl p-6 flex flex-col gap-4'>
						<h2 className='text-lg font-medium text-gray-900'>Status Pesanan</h2>

						<div className='flex flex-col gap-4 w-full'>
							{orderStatuses.map((status) => (
								<div
									key={status.id}
									className='flex items-center gap-4'>
									{/* Icon */}
									<div className={`w-9 h-9 rounded-full ${status.iconBg} flex items-center justify-center shrink-0`}>{status.icon}</div>
									{/* Label */}
									<div className='flex-1 flex flex-col'>
										<span className={`text-sm font-normal ${status.done ? "text-gray-900" : "text-gray-500"}`}>{status.label}</span>
										<span className='text-xs text-gray-500'>{status.sub}</span>
									</div>
									{/* Checkmark badge for done */}
									{status.done && <span className='text-xs text-green-600 bg-green-50 rounded-full px-2 py-0.5'>✓</span>}
								</div>
							))}
						</div>
					</div>

					{/* Action Buttons */}
					<div className='w-160 flex items-center gap-3'>
						{/* Lihat riwayat pesanan */}
						<button
							type='button'
							onClick={() => navigate("/profile/my-orders")}
							className='h-12.5 rounded-xl px-6 border border-[#1a73e8] text-gray-500 text-base font-medium flex items-center justify-center hover:bg-blue-50 transition-colors cursor-pointer'>
							Lihat Riwayat Pesanan
						</button>
						<button
							type='button'
							onClick={() => navigate("/")}
							className='h-12.5 rounded-xl px-6 text-[#1a73e8] text-base font-medium flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors cursor-pointer'>
							<span>Lanjut Belanja</span>
							<ArrowRight
								className='w-4.5 h-4.5'
								strokeWidth={2}
							/>
						</button>
					</div>
				</div>
			</main>
		</>
	);
=======
import {
  CircleCheckBig,
  Truck,
  MapPin,
  Package,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "@/hooks/useLocalStorage";

const shippingLabels = {
  "jne-reg": "JNE Reguler",
  "jne-exp": "JNE Express",
  "same-day": "Same Day Delivery",
};

const orderStatuses = [
  {
    id: "received",
    icon: (
      <CircleCheckBig className="w-4.5 h-4.5 text-success" strokeWidth={2} />
    ),
    iconBg: "bg-success-light",
    label: "Pesanan Diterima",
    sub: "Baru saja",
    done: true,
  },
  {
    id: "packing",
    icon: (
      <Package className="w-4.5 h-4.5 text-text-secondary" strokeWidth={2} />
    ),
    iconBg: "bg-border",
    label: "Sedang Dikemas",
    sub: "Estimasi 1-2 jam",
    done: false,
  },
  {
    id: "shipping",
    icon: <Truck className="w-4.5 h-4.5 text-text-secondary" strokeWidth={2} />,
    iconBg: "bg-border",
    label: "Dalam Pengiriman",
    sub: "3-5 hari kerja",
    done: false,
  },
  {
    id: "delivered",
    icon: (
      <MapPin className="w-4.5 h-4.5 text-text-secondary" strokeWidth={2} />
    ),
    iconBg: "bg-border",
    label: "Terkirim",
    sub: "Estimasi mengikuti metode pengiriman",
    done: false,
  },
];

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const { data: orders } = useLocalStorage("orders");
  console.log("DEBUG orders:", orders);

  const order = orders[orders.length - 1];
  console.log("DEBUG order (terakhir):", order);
  if (!order) {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4 px-4 py-12">
        <p className="text-text-secondary text-sm">
          Tidak ada pesanan yang ditemukan.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="px-5 py-2.5 rounded-xl btn-primary text-sm font-medium"
        >
          Kembali Belanja
        </button>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-surface">
        <div className="flex flex-col items-center justify-start gap-8 px-4 py-12">
          {/* Success Icon */}
          <div className="w-24 h-24 rounded-full bg-success-light flex items-center justify-center">
            <CircleCheckBig
              className="w-12 h-12 text-success"
              fill="#DCFCE7"
              strokeWidth={2}
            />
          </div>

          {/* Success Text */}
          <div className="flex flex-col items-center gap-2.5 text-center">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary">
              Pesanan Berhasil! 🎉
            </h1>
            <span className="text-base font-normal text-text-secondary">
              Terimakasih telah berbelanja di BeliMudah. Pesananmu sedang
              diproses
            </span>
          </div>

          {/* Card: Order Info */}
          <div className="w-full max-w-160 flex flex-col gap-4 card-base p-4 shadow-sm">
            {/* Order Number & Total */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-normal text-text-secondary">
                  No. Pesanan
                </span>
                <span className="text-base font-bold text-primary">
                  #{order?.id}
                </span>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-sm font-normal text-text-secondary">
                  Total Pembayaran
                </span>
                <span className="text-base font-bold text-text-primary">
                  {order?.total}
                </span>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-border" />

            {/* Shipping Info */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <Truck
                  className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5"
                  strokeWidth={2}
                />
                <div className="flex flex-col">
                  <span className="text-sm text-text-primary">
                    {shippingLabels[order.shippingMethod] ?? "-"}
                  </span>
                  <span className="text-xs text-text-secondary">
                    Pesanan dibuat: {order.date}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin
                  className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5"
                  strokeWidth={2}
                />
                <div className="flex flex-col">
                  <span className="text-sm text-text-primary">
                    Alamat Pengiriman
                  </span>
                  <span className="text-xs text-text-secondary">
                    {order.shipping?.alamat}, {order.shipping?.kota},{" "}
                    {order.shipping?.provinsi} {order.shipping?.kodePos}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Order Status */}
          <div className="w-full max-w-160 card-base p-6 flex flex-col gap-4 shadow-sm">
            <h2 className="font-display text-lg font-bold text-text-primary">
              Status Pesanan
            </h2>

            <div className="flex flex-col gap-4 w-full">
              {orderStatuses.map((status) => (
                <div key={status.id} className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-full ${status.iconBg} flex items-center justify-center shrink-0`}
                  >
                    {status.icon}
                  </div>
                  {/* Label */}
                  <div className="flex-1 flex flex-col">
                    <span
                      className={`text-sm font-normal ${status.done ? "text-text-primary" : "text-text-secondary"}`}
                    >
                      {status.label}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {status.sub}
                    </span>
                  </div>
                  {/* Checkmark badge for done */}
                  {status.done && (
                    <span className="text-xs text-success bg-success-light rounded-full px-2 py-0.5">
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-160 flex flex-wrap items-center gap-3">
            {/* Lihat riwayat pesanan */}
            <button
              type="button"
              onClick={() => navigate("/profile/my-orders")}
              className="h-12.5 rounded-xl px-6 border border-primary text-text-secondary text-base font-medium flex items-center justify-center hover:bg-primary-light transition-colors cursor-pointer"
            >
              Lihat Riwayat Pesanan
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="h-12.5 rounded-xl px-6 text-primary text-base font-medium flex items-center justify-center gap-2 hover:bg-primary-light transition-colors cursor-pointer"
            >
              <span>Lanjut Belanja</span>
              <ArrowRight className="w-4.5 h-4.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </main>
    </>
  );
>>>>>>> feat/newVersion
}
