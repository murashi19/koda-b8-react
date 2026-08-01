import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import category from "@/features/products/data/category";
import products from "@/features/products/data/products";

function CategorySection() {
  const categoriesWithCount = category.map((category) => ({
    ...category,
    totalProduct: products.filter(
      (product) => product.category === category.name,
    ).length,
  }));
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
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
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
