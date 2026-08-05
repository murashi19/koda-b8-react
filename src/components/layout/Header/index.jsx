import TopHeader from "@/components/layout/Header/TopHeader";
import MainHeader from "@/components/layout/Header/MainHeader";
import NavHeader from "@/components/layout/Header/NavHeader";

function Header() {
	return (
		<div className='sticky top-0 z-40 shadow-sm'>
			<TopHeader />
			<MainHeader />
			<NavHeader />
		</div>
	);
}

export default Header;
