import Header from "../components/Header";
import ButtonMessage from "../components/ButtonMessage";
import Footer from "../components/Footer";

// CONTENT MAIN
import BrowseMain from "../components/Browse/BrowseMain";

function BrowseProduct() {
	return (
		<>
			<Header className='fixed' />
			<ButtonMessage />
			<main>
				<BrowseMain />
			</main>
			<Footer />
		</>
	);
}

export default BrowseProduct;
