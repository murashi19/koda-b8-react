import ImgHero from "@/assets/bg-hero.png";
import ImgFashion from "@/assets/bg-fashion.png";
import ImgHome from "@/assets/bg-home.png";
import ImgBeauty from "@/assets/bg-beauty.png";
import ImgSport from "@/assets/bg-sport.png";
import ImgBook from "@/assets/bg-book.png";

export const category = [
  {
    id: 1,
    slug: "elektronik",
    name: "Elektronik",
    image: ImgHero,
    totalProduct: 7,
  },
  {
    id: 2,
    slug: "fashion",
    name: "Fashion",
    image: ImgFashion,
    totalProduct: 5,
  },
  {
    id: 3,
    slug: "rumah-dapur",
    name: "Rumah & Dapur",
    image: ImgHome,
    totalProduct: 4,
  },
  {
    id: 4,
    slug: "kecantikan",
    name: "Kecantikan",
    image: ImgBeauty,
    totalProduct: 2,
  },
  {
    id: 5,
    slug: "olahraga",
    name: "Olahraga",
    image: ImgSport,
    totalProduct: 3,
  },
  {
    id: 6,
    slug: "buku-dan-alat-tulis",
    name: "Buku & Alat Tulis",
    image: ImgBook,
    totalProduct: 2,
  },
];

export default category;
