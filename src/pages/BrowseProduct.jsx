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
}

export default BrowseProduct;
