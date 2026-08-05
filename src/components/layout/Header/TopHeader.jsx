import { MapPin, Phone, Truck } from "lucide-react";

function TopHeader() {
	return (
		<div className='w-full bg-secondary text-white'>
			<div className='container-page hidden md:flex items-center justify-between px-4 xl:px-0 py-2 text-xs'>
				<div className='flex items-center gap-2 text-white/80'>
					<MapPin className='w-3.5 h-3.5' />
					<span>Kirim ke: Jakarta Selatan</span>
				</div>
				<div className='flex items-center gap-6'>
					<div className='flex items-center gap-2 text-white/80'>
						<Phone className='w-3.5 h-3.5' />
						<span>0800-1234-5678 (Gratis)</span>
					</div>
					<div className='flex items-center gap-2 text-white/80'>
						<Truck className='w-3.5 h-3.5' />
						<span>Gratis Ongkir di atas Rp 100.000</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TopHeader;
