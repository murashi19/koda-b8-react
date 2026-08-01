import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BsBellFill } from "react-icons/bs";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";

// Yup Schema
const searchSchema = yup.object({
	query: yup
		.string()
		.trim()
		.max(100, "Pencarian maksimal 100 karakter")
		.matches(/^[a-zA-Z0-9\s\-_.#]*$/, "Karakter tidak valid")
		.required("Masukkan kata kunci pencarian"),
});

// SearchBar
function SearchBar({ onSearch }) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({ resolver: yupResolver(searchSchema) });

	const onSubmit = (data) => {
		onSearch(data.query.trim());
		reset();
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='flex flex-col gap-1'>
			<div className='flex items-center gap-2'>
				<div className='relative'>
					<FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[15px]' />
					<input
						{...register("query")}
						type='text'
						placeholder='Cari pesanan, produk, pelanggan...'
						className={`w-64 h-9 rounded-lg border pl-9 pr-3 text-sm text-text-primary bg-surface outline-none transition-colors ${errors.query ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"}`}
					/>
				</div>
				<button
					type='submit'
					className='h-9 px-4 text-sm font-medium btn-primary rounded-lg'>
					Cari
				</button>
			</div>
			{errors.query && <p className='text-xs text-red-500 ml-1'>{errors.query.message}</p>}
		</form>
	);
}

export default function Header({ onToggleSidebar, onSearch, title = "Admin", avatarInitial = "A", adminName = "Admin" }) {
	const [searchResult, setSearchResult] = useState(null);

	const handleSearch = (query) => {
		onSearch?.(query);
		setSearchResult(`Hasil pencarian untuk: "${query}"`);
		setTimeout(() => setSearchResult(null), 3000);
	};

	return (
		<>
			<header className='h-18 bg-white border-b border-border flex items-center justify-between px-8 shrink-0'>
				{/* Left */}
				<div className='flex items-center gap-4'>
					<button
						onClick={onToggleSidebar}
						className='p-1.5 rounded-lg hover:bg-surface transition-colors cursor-pointer'>
						<FiMenu className='text-[18px]' />
					</button>
					<span className='font-medium text-text-primary'>{title}</span>
				</div>

				{/* Right */}
				<div className='flex items-center gap-4'>
					<SearchBar onSearch={handleSearch} />

					{/* Notification */}
					<button className='relative p-1.5 rounded-lg hover:bg-surface transition-colors cursor-pointer'>
						<BsBellFill className='text-[18px] text-text-secondary' />
						<span className='absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full' />
					</button>

					{/* Avatar */}
					<div className='flex items-center gap-2'>
						<div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm'>{avatarInitial}</div>
						<span className='text-sm font-medium text-text-primary'>{adminName}</span>
					</div>
				</div>
			</header>

			{/* Search Toast */}
			{searchResult && (
				<div className='mx-8 mt-4 flex items-center justify-between bg-primary-light border border-primary rounded-xl px-4 py-3 text-sm text-primary'>
					<span>{searchResult}</span>
					<button onClick={() => setSearchResult(null)}>
						<FiX className='text-[16px]' />
					</button>
				</div>
			)}
		</>
	);
}
