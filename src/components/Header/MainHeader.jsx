import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, User, ShoppingCart, Heart, TextAlignJustify, ChevronDown } from "lucide-react";
import { useState, useEffect, useContext, useRef } from "react";

import AuthContext from "../../context/AuthContext";
import CartContext from "../../context/CartContext";
import WishlistContext from "../../context/WishlistContext";

import LogoHeader from "../../assets/logo-header.png";

function MainHeader() {
	const [query, setQuery] = useState("");
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);
	const navigate = useNavigate();

	const { auth } = useContext(AuthContext);
	const { cart } = useContext(CartContext);
	const { wishlist } = useContext(WishlistContext);

	const isLoggedIn = auth && auth.isLogin;

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSearch = (e) => {
		e.preventDefault();
		if (query.trim()) {
			navigate(`/browse-product?q=${encodeURIComponent(query.trim())}`);
		}
	};

	const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
	const wishlistCount = wishlist.length;

	return (
		<>
			<div className='w-screen max-w-7xl mx-auto flex justify-between py-5 items-center gap-10'>
				{/* LOGO */}
				<Link
					className='w-max flex justify-start items-center cursor-pointer'
					to='/'>
					<img
						className='w-45'
						src={LogoHeader}
						alt='Logo BeliMudah'
					/>
				</Link>

				{/* SEARCH */}
				<div className='w-3/4 justify-start items-center'>
					<div className='w-full'>
						<form
							id='search-bar'
							onSubmit={handleSearch}
							className='w-full flex flex-row justify-start items-center border border-gray-400 rounded-2xl'>
							<input
								className='w-full py-3 px-5 rounded-l-2xl outline-hidden'
								type='text'
								placeholder='Cari produk, merek, kategori...'
								value={query}
								onChange={(e) => setQuery(e.target.value)}
							/>
							<button
								className='w-max py-3 px-5 bg-blue-500 text-white rounded-r-2xl hover:bg-blue-600 transition-colors'
								type='submit'>
								<Search />
							</button>
						</form>
					</div>
				</div>

				<div className='w-1/4 flex flex-row gap-5 items-center'>
					{/* Notification */}
					<button
						onClick={() => navigate("/")}
						className='relative p-1 hover:text-blue-600 transition-colors cursor-pointer'>
						<Bell className='w-5 h-5' />
					</button>

					{/* User — kondisional */}
					{isLoggedIn ? (
						<button
							onClick={() => navigate("/profile/edit-profile")}
							className='flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer'>
							<User className='w-5 h-5' />
							<span id='user-name'>{auth?.name}</span>
						</button>
					) : (
						<div
							ref={dropdownRef}
							className='relative'>
							<button
								onClick={() => setDropdownOpen((prev) => !prev)}
								className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer
                ${dropdownOpen ? "bg-blue-50  text-blue-600" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"}`}>
								<div className='w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center'>
									<User className='w-4 h-4 text-gray-500' />
								</div>
								<span className='text-sm font-medium hidden lg:block'>Akun</span>
								<ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180 text-blue-600" : "text-gray-400"}`} />
							</button>

							{dropdownOpen && (
								<div className='absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150'>
									{/* Login */}
									<div className='p-2'>
										<button
											onClick={() => {
												navigate("/auth/login");
												setDropdownOpen(false);
											}}
											className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer'>
											<User className='w-4 h-4' />
											Masuk
										</button>
									</div>

									<div className='px-4 pb-1'>
										<div className='flex items-center gap-2'>
											<hr className='flex-1 border-gray-100' />
											<span className='text-[11px] text-gray-400'>atau</span>
											<hr className='flex-1 border-gray-100' />
										</div>
									</div>

									{/* Register */}
									<div className='px-2 pb-2'>
										<button
											onClick={() => {
												navigate("/auth/register");
												setDropdownOpen(false);
											}}
											className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer'>
											<span className='w-4 h-4 flex items-center justify-center rounded-full border border-blue-400 text-[10px] font-bold'>+</span>
											Daftar Sekarang
										</button>
									</div>
								</div>
							)}
						</div>
					)}

					{/* Wishlist */}
					<button
						onClick={() => navigate("/profile/wishlist")}
						className='relative p-1 hover:text-red-500 transition-colors cursor-pointer'>
						<Heart className='w-5 h-5' />
						{wishlistCount > 0 && (
							<span className='absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-medium leading-none'>{wishlistCount > 99 ? "99+" : wishlistCount}</span>
						)}
					</button>

					{/* Cart */}
					<button
						id='cart-icon'
						onClick={() => navigate("/cart")}
						className='relative p-1 hover:text-blue-600 transition-colors cursor-pointer'>
						<ShoppingCart className='w-5 h-5' />
						{cartCount > 0 && (
							<span className='absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-[#1a73e8] text-white text-[10px] font-medium leading-none'>{cartCount > 99 ? "99+" : cartCount}</span>
						)}
					</button>

					{/* Mobile menu — 768px */}
					<button
						id='all-icon'
						className='flex md:hidden p-1 hover:text-blue-600 transition-colors cursor-pointer'>
						<TextAlignJustify className='w-5 h-5' />
					</button>
				</div>
			</div>
		</>
	);
}

export default MainHeader;
