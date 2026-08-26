import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import category from "@/features/products/data/category";
import { fetchProducts } from "@/features/products/productsSlice";
import { fetchCategories } from "@/features/categories/categoriesSlice";
import { categorySlug } from "@/utils/category";

function CategorySection() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const categories = useSelector((state) => state.categories.items);
  const categoryStatus = useSelector((state) => state.categories.status);

  useEffect(() => {
    // State produk juga dipakai halaman admin yang bersifat server-paginated.
    // Selalu muat ulang katalog penuh saat landing dibuka agar snapshot halaman
    // admin tidak membuat produk customer terpotong.
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (categoryStatus === "idle") dispatch(fetchCategories());
  }, [categoryStatus, dispatch]);

  const categoriesWithCount = categories.map((backendCategory) => {
    const displayCategory = category.find(
      (item) => item.name.toLowerCase() === backendCategory.name.toLowerCase(),
    );

    return {
      id: backendCategory.id,
      name: backendCategory.name,
      slug:
        displayCategory?.slug ?? categorySlug(backendCategory.name),
      image: displayCategory?.image,
      totalProduct: products.filter(
        (product) => product.category === backendCategory.name,
      ).length,
    };
  });
  return (
    <section>
      <div className="container-page px-4 xl:px-0">
        {/* Header kategori */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary">
            Belanja Berdasarkan Kategori
          </h2>
          <Link
            to="/browse-product"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-300"
          >
            Lihat Semua
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* List kategori */}
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesWithCount.map(
            ({ id, slug, name, image, totalProduct }) => (
              <li key={id}>
                <Link
                  to={`/browse-product/${slug}`}
                  className="group flex flex-col items-center gap-3 bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-1 ring-border group-hover:ring-primary/40 transition-all duration-300">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center bg-primary-light text-xl font-semibold text-primary">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-text-primary text-center">
                    {name}
                  </span>
                  <span className="text-xs text-text-secondary -mt-2">
                    {totalProduct} Produk
                  </span>
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}

export default CategorySection;
