import StarRating from "../StarsRate";

const ratingOptions = [5, 4, 3];

export default function BrowseFilter({ brands, selectedBrands, onBrandChange, selectedRating, onRatingChange, inStock, onStockChange, priceMax, onPriceChange }) {
	return (
		<aside className='w-64 shrink-0 flex flex-col gap-6'>
			{/* Harga */}
			<div>
				<h3 className='font-medium mb-2'>Harga</h3>
				<input
					type='range'
					min='0'
					max='20000000'
					step='50000'
					value={priceMax}
					onChange={(e) => onPriceChange(Number(e.target.value))}
					className='w-full'
				/>
				<div className='flex justify-between text-sm'>
					<span>Rp 0</span>
					<span>Rp {priceMax.toLocaleString("id-ID")}</span>
				</div>
			</div>

			{/* Merek */}
			<div>
				<h3 className='font-medium mb-2'>Merek</h3>
				<div className='flex flex-col gap-2'>
					{brands.map((brand) => (
						<label
							key={brand}
							className='flex items-center gap-2 cursor-pointer'>
							<input
								type='checkbox'
								checked={selectedBrands.includes(brand)}
								onChange={() => onBrandChange(brand)}
							/>
							<span>{brand}</span>
						</label>
					))}
				</div>
			</div>

			{/* Rating */}
			<div>
				<h3 className='font-medium mb-2'>Rating Minimum</h3>
				<div className='flex flex-col gap-2 '>
					{ratingOptions.map((rating) => (
						<label
							key={rating}
							className='flex items-center gap-2 cursor-pointer'>
							<input
								className='cursor-pointer'
								type='radio'
								name='rating'
								checked={selectedRating === rating}
								onChange={() => onRatingChange(rating)}
							/>
							<StarRating
								className='w-3.5 h-3.5'
								rating={rating}
							/>
							<span>Ke bawah</span>
						</label>
					))}
				</div>
			</div>

			{/* Stock */}
			<div>
				<h3 className='font-medium mb-2'>Ketersediaan</h3>
				<label className='flex items-center gap-2 cursor-pointer'>
					<input
						type='checkbox'
						checked={inStock}
						onChange={onStockChange}
					/>
					<span>Stok tersedia</span>
				</label>
			</div>
		</aside>
	);
}
