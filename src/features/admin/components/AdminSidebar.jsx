import { useNavigate, useLocation } from "react-router-dom";

// react-icons
import { MdExitToApp } from "react-icons/md";

import { navItems } from "@/features/admin/data/navItems";

export default function Sidebar({ className }) {
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<aside className={className}>
			{/* Logo */}
			<div className='flex items-center gap-3 px-6 py-6 border-b border-white/10'>
				<div className='w-9 h-9 bg-primary rounded-xl flex items-center justify-center font-bold text-white text-sm'>B</div>
				<span className='font-semibold text-sm whitespace-nowrap'>BeliMudah Admin</span>
			</div>

			{/* Nav */}
			<nav className='flex flex-col gap-2 p-5 flex-1'>
				{navItems.map((item) => {
					const Icon = item.icon;

					const isActive = item.route === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.route);

					return (
						<button
							key={item.id}
							onClick={() => navigate(item.route)}
							className={`flex items-center gap-3 px-3.5 py-3.5 rounded-xl text-sm transition-colors cursor-pointer text-left ${isActive ? "bg-primary text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>
							<Icon className='text-[18px] shrink-0' />
							<span className='whitespace-nowrap'>{item.label}</span>
						</button>
					);
				})}
			</nav>

			{/* Footer */}
			<div className='p-5'>
				<button
					onClick={() => navigate("/")}
					className='flex items-center gap-3 text-white/50 text-sm hover:text-white transition-colors cursor-pointer'>
					<MdExitToApp className='text-[18px] shrink-0' />
					<span className='whitespace-nowrap'>Kembali ke Toko</span>
				</button>
			</div>
		</aside>
	);
}
