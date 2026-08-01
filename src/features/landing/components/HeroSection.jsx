import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import Bghero from "@/assets/bg-hero.png";

function HeroSection() {
  return (
    <section className="w-full pt-8">
      <div className="container-page px-4 xl:px-0">
        <div className="relative overflow-hidden rounded-3xl bg-secondary">
          {/* Soft background shapes (Tailwind only) */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-10 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative z-10 grid md:grid-cols-2 items-center gap-8 px-6 py-12 md:px-14 md:py-16">
            {/* Copy */}
            <div className="flex flex-col items-start gap-5">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Diskon hingga 40% minggu ini
              </span>
              <h1 className="font-display text-3xl md:text-[42px] leading-tight md:leading-[1.1] font-bold text-white">
                Belanja Elektronik Pilihan, Harga Bersahabat
              </h1>
              <p className="text-base md:text-lg text-white/70 max-w-md">
                Laptop, smartphone, headphone, dan ribuan produk lainnya —
                dikurasi dan dikirim langsung ke depan pintumu.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/browse-product"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-primary text-sm font-semibold"
                >
                  Lihat Promo
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/browse-product"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white text-sm font-semibold border border-white/20 hover:bg-white/20 transition-colors duration-300"
                >
                  Jelajahi Kategori
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative hidden md:flex justify-end">
              <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img
                  src={Bghero}
                  alt="Promo produk elektronik"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
