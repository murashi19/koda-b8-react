/* eslint-disable react-hooks/set-state-in-effect */
<<<<<<< HEAD
import { useState, useContext, useEffect } from "react";
import { FaHeart } from "react-icons/fa";

// Components
import Header from "../../components/Header";
import ButtonMessage from "../../components/ButtonMessage";
import ProductCard from "../../components/ProductCard";
import Footer from "../../components/Footer";
import ProfileSidebar from "../../components/Profile/ProfileSidebar";

// Context
import WishlistContext from "../../context/WishlistContext";
=======
import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";

// Components
import Header from "@/components/layout/Header/index";
import ButtonMessage from "@/components/common/ButtonMessage";
import ProductCard from "@/features/products/components/ProductCard";
import Footer from "@/components/layout/Footer";
import ProfileSidebar from "@/features/profile/components/ProfileSidebar";

// Hooks (Redux)
import useWishlist from "@/features/wishlist/useWishlist";
>>>>>>> feat/newVersion
import { animateScroll } from "react-scroll";

const ITEMS_PER_PAGE = 6; // kelipatan 3 biar grid cols-3 nya rapi

export default function Wishlist() {
<<<<<<< HEAD
	const { wishlist } = useContext(WishlistContext);
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(wishlist.length / ITEMS_PER_PAGE);
	const paginatedProducts = wishlist.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

	// Kalau halaman aktif jadi kosong setelah produk dihapus dari wishlist, mundur satu halaman
	useEffect(() => {
		if (currentPage > totalPages && totalPages > 0) {
			setCurrentPage(totalPages);
		}
	}, [currentPage, totalPages]);
	useEffect(() => {
		animateScroll.scrollToTop({
			duration: 700,
			smooth: "easeInOutQuart",
		});
	}, [currentPage]);

	return (
		<>
			<Header />
			<ButtonMessage />
			<main className='min-h-screen max-w-[1728px] mx-auto'>
				<div className='max-w-6xl mx-auto grid grid-cols-4 gap-8 px-4 py-8'>
					{/* Left: Profile Sidebar */}
					<ProfileSidebar activeNav='wishlist' />

					{/* Right: Wishlist */}
					<div className='col-span-3 flex flex-col gap-4 bg-white border border-black/10 rounded-2xl p-5'>
						<h2 className='text-xl font-medium text-gray-900'>Wishlist ({wishlist.length})</h2>

						{wishlist.length === 0 ? (
							<div className='flex flex-col items-center justify-center py-16 gap-3 text-gray-400'>
								<FaHeart
									className='w-12 h-12'
									strokeWidth={1}
								/>
								<p className='text-sm'>Belum ada produk di wishlist kamu.</p>
							</div>
						) : (
							<>
								{/* Product Grid */}
								<div className='grid grid-cols-3 gap-4'>
									{paginatedProducts.map((product) => (
										<ProductCard
											key={product.id}
											product={product}
										/>
									))}
								</div>

								{/* Pagination */}
								{totalPages > 1 && (
									<div className='flex items-center justify-center gap-2 pt-4 border-t border-black/10'>
										<button
											onClick={() => setCurrentPage((p) => p - 1)}
											disabled={currentPage === 1}
											className='px-3 py-1.5 text-sm rounded-lg border border-black/10 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'>
											← Prev
										</button>

										{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
											<button
												key={page}
												onClick={() => setCurrentPage(page)}
												className={`w-8 h-8 text-sm rounded-lg transition-colors ${currentPage === page ? "bg-[#1a73e8] text-white font-semibold" : "border border-black/10 text-gray-500 hover:bg-gray-50"}`}>
												{page}
											</button>
										))}

										<button
											onClick={() => setCurrentPage((p) => p + 1)}
											disabled={currentPage === totalPages}
											className='px-3 py-1.5 text-sm rounded-lg border border-black/10 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'>
											Next →
										</button>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
=======
  const { wishlist } = useWishlist();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(wishlist.length / ITEMS_PER_PAGE);
  const paginatedProducts = wishlist.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Kalau halaman aktif jadi kosong setelah produk dihapus dari wishlist, mundur satu halaman
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  useEffect(() => {
    animateScroll.scrollToTop({
      duration: 700,
      smooth: "easeInOutQuart",
    });
  }, [currentPage]);

  return (
    <>
      <Header />
      <ButtonMessage />
      <main className="min-h-screen bg-surface">
        <div className="container-page grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 px-4 xl:px-0 py-8">
          {/* Left: Profile Sidebar */}
          <ProfileSidebar activeNav="wishlist" />

          {/* Right: Wishlist */}
          <div className="lg:col-span-3 flex flex-col gap-4 card-base p-5 shadow-sm">
            <h2 className="font-display text-xl font-bold text-text-primary">
              Wishlist ({wishlist.length})
            </h2>

            {wishlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-text-secondary">
                <FaHeart className="w-12 h-12" strokeWidth={1} />
                <p className="text-sm">Belum ada produk di wishlist kamu.</p>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4 border-t border-border">
                    <button
                      onClick={() => setCurrentPage((p) => p - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-sm rounded-lg border border-border text-text-secondary hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 text-sm rounded-lg transition-colors ${currentPage === page ? "bg-primary text-white font-semibold" : "border border-border text-text-secondary hover:bg-surface"}`}
                        >
                          {page}
                        </button>
                      ),
                    )}

                    <button
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-sm rounded-lg border border-border text-text-secondary hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
>>>>>>> feat/newVersion
}
