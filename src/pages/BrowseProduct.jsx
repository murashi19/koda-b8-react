<<<<<<< HEAD
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
=======
import Header from "@/components/layout/Header/index";
import ButtonMessage from "@/components/common/ButtonMessage";
import Footer from "@/components/layout/Footer";

// CONTENT MAIN
import BrowseMain from "@/features/products/components/BrowseMain";

function BrowseProduct() {
  return (
    <>
      <Header className="fixed" />
      <ButtonMessage />
      <main>
        <BrowseMain />
      </main>
      <Footer />
    </>
  );
>>>>>>> feat/newVersion
}

export default BrowseProduct;
