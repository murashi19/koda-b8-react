import CardImg1 from "@/assets/card-img.png";
import CardImg2 from "@/assets/card2-img.png";

const promos = [
  {
    id: 1,
    image: CardImg1,
    gradient: "linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0.6) 70%)",
    label: "Fashion Wanita",
    title: "Diskon s/d 50%",
    cta: "Belanja Sekarang",
  },
  {
    id: 2,
    image: CardImg2,
    gradient:
      "linear-gradient(to left, rgba(28,57,142,0), rgba(28,57,142,0.8) 70%)",
    label: "Elektronik Pilihan",
    title: "Harga Terbaik",
    cta: "Lihat Produk",
  },
];

export default function CardPromotion() {
  return (
    <section className="w-full container-page px-4 xl:px-0 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
      {promos.map(({ id, image, gradient, label, title, cta }) => (
        <div
          key={id}
          className="h-48 flex items-center px-8 rounded-2xl bg-cover bg-center shadow-sm hover:shadow-lg transition-shadow duration-300"
          style={{
            backgroundImage: `${gradient}, url(${image})`,
          }}
        >
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-sm text-white/80">{label}</span>
            <span className="text-xl font-bold text-white leading-7">
              {title}
            </span>
            <span className="w-fit px-4 py-2 text-sm font-medium text-white border border-white/80 rounded-full cursor-pointer hover:bg-white hover:text-secondary transition-colors duration-300">
              {cta}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
