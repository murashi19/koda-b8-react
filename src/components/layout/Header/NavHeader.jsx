import { Link } from "react-router-dom";
import {
  MdOutlineComputer,
  MdOutlineCheckroom,
  MdOutlineKitchen,
  MdOutlineMenuBook,
} from "react-icons/md";
import { PiSparkle } from "react-icons/pi";
import { IoFootballOutline } from "react-icons/io5";

import category from "@/features/products/data/category";

const categoryIcons = {
  elektronik: MdOutlineComputer,
  fashion: MdOutlineCheckroom,
  "rumah-dapur": MdOutlineKitchen,
  kecantikan: PiSparkle,
  olahraga: IoFootballOutline,
  "buku-dan-alat-tulis": MdOutlineMenuBook,
};

function NavHeader() {
  return (
    <nav className="hidden w-full border-b border-border bg-white lg:block">
      <div className="container-page flex min-w-0 items-center justify-center px-4 xl:px-0">
        <ul className="flex min-w-0 items-center justify-center gap-4 py-3 text-sm text-text-secondary xl:gap-8">
          <li>
            <Link
              to="/browse-product"
              className="flex items-center gap-2 text-text-primary font-semibold whitespace-nowrap"
            >
              <span>Semua Kategori</span>
            </Link>
          </li>

          {category.map((item) => {
            const Icon = categoryIcons[item.slug];

            return (
              <li key={item.id}>
                <Link
                  to={`/browse-product/${item.slug}`}
                  className="flex items-center gap-2 hover:text-primary transition-colors duration-300 whitespace-nowrap"
                >
                  {Icon && <Icon size={18} />}
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}

          <li className="">
            <Link
              to="/browse-product"
              className="flex items-center gap-1.5 text-accent font-semibold hover:text-accent-dark transition-colors duration-300 whitespace-nowrap"
            >
              🔥 Promo
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavHeader;
