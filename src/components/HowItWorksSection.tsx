"use client";

import Link from "next/link";
import { Pizza, ArrowRight, Flame, CupSoda, IceCreamBowl } from "lucide-react";
import { Button } from "@/components/ui/button";

// IMPORTANT: Replace these 4 viewer links with the direct image URLs
// (Right-click the image on ImgBB -> "Copy image address" -> starts with https://i.ibb.co/...)
const COLLAGE_IMAGES = {
  pizzaPrimary: "https://i.ibb.co/1fLc0jHT/download-45.jpg",
  pizzaSecondary: "https://i.ibb.co/Xrg1QMCV/download-52.jpg",
  drinks: "https://i.ibb.co/HfhxckJk/download-51.jpg",
  dessert:
    "https://i.ibb.co/pFDz6TK/Gourmet-Ice-Cream-Dessert-Platter-Elegant-Fine-Dining-Dessert.jpg",
};

export default function HowItWorksSection() {
  return (
    <section className="relative w-full bg-[#0B1315] py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-[#D4A359]/20">
      {/* Subtle radial texture glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,rgba(224,90,43,0.08),transparent_55%)]"
      />

      {/* Decorative floating pizza slices on top-left & bottom-right corners */}
      <img
        src="/bannerPizza.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none hidden xl:block absolute -left-24 top-10 w-44 h-44 object-contain rotate-45 opacity-85 drop-shadow-[0_18px_25px_rgba(0,0,0,0.8)]"
      />
      <img
        src="/bannerPizza.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none hidden xl:block absolute -right-20 -bottom-16 w-52 h-52 object-contain -rotate-12 opacity-85 drop-shadow-[0_18px_25px_rgba(0,0,0,0.8)]"
      />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-12 items-center">
        {/* LEFT COLUMN: Layered Editorial Photo Collage (Pizza, Drinks, Dessert & Brand Card) */}
        <div className="lg:col-span-6 relative mx-auto w-full max-w-[540px] h-[470px] sm:h-[530px]">
          {/* Frame 1 (Back-Left Tall Card): Pizza #1 */}
          <div className="absolute left-0 sm:left-2 top-8 w-[46%] h-[68%] bg-[#f8fafc] p-2 sm:p-2.5 shadow-[0_20px_45px_rgba(0,0,0,0.75)] z-10">
            <img
              src={COLLAGE_IMAGES.pizzaPrimary}
              alt="Artisanal wood-fired pizza"
              className="w-full h-full object-cover bg-[#132024]"
            />
          </div>

          {/* Frame 2 (Center-Top Overlapping Card): Pizza #2 */}
          <div className="absolute left-[31%] top-0 w-[48%] h-[58%] bg-[#f8fafc] p-2 sm:p-2.5 shadow-[0_24px_50px_rgba(0,0,0,0.85)] z-20">
            <img
              src={COLLAGE_IMAGES.pizzaSecondary}
              alt="Hand-stretched gourmet crust"
              className="w-full h-full object-cover bg-[#132024]"
            />
          </div>

          {/* Card 3 (Bottom-Left Dark Brand Stamp Card): PizzaHub Badge */}
          <div className="absolute left-[11%] bottom-4 w-[42%] h-[36%] bg-[#070C0E] border border-[#D4A359]/40 shadow-[0_20px_45px_rgba(0,0,0,0.9)] z-30 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-[9px] uppercase tracking-[0.32em] text-[#D4A359]">
              Artisanal
            </span>
            <div className="my-1.5 flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold tracking-[0.16em] text-white uppercase">
                Pizza<span className="text-[#D4A359]">Hub</span>
              </span>
            </div>
            <div className="w-7 h-7 rounded-full border border-[#E05A2B]/70 bg-[#132024] flex items-center justify-center my-1">
              <Pizza className="w-3.5 h-3.5 text-[#E05A2B] -rotate-12" />
            </div>
            <span className="text-[8px] uppercase tracking-[0.24em] text-slate-400 mt-1">
              Pizzas • Drinks • Desserts
            </span>
          </div>

          {/* Card 4 (Bottom-Right Foreground Wide Card): Craft Drinks & Sweet Desserts Split */}
          <div className="absolute right-0 sm:right-2 bottom-10 w-[56%] h-[42%] bg-[#132024] border-2 border-[#D4A359]/50 shadow-[0_25px_55px_rgba(0,0,0,0.9)] z-40 grid grid-cols-2 overflow-hidden">
            <div className="relative h-full border-r border-[#D4A359]/30 group">
              <img
                src={COLLAGE_IMAGES.drinks}
                alt="Chilled craft beverages"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 bg-[#0B1315]/85 backdrop-blur-xs px-2 py-0.5 text-[9px] uppercase tracking-widest text-[#D4A359] border border-[#D4A359]/30">
                Drinks
              </span>
            </div>
            <div className="relative h-full group">
              <img
                src={COLLAGE_IMAGES.dessert}
                alt="Artisanal sweet desserts"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 right-2 bg-[#0B1315]/85 backdrop-blur-xs px-2 py-0.5 text-[9px] uppercase tracking-widest text-[#D4A359] border border-[#D4A359]/30">
                Desserts
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PizzaHub Editorial Copy + How It Works Flow */}
        <div className="lg:col-span-6 flex flex-col items-start text-left lg:pl-6">
          <span className="text-xs uppercase tracking-[0.28em] text-[#D4A359] font-semibold mb-3">
            The Full Table Experience
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-[1.12]">
            Wood-Fired Pies,{" "}
            <span className="text-[#D4A359]">Chilled Drinks</span> &amp; Sweet
            Finishes
          </h2>

          <p className="mt-5 text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            PizzaHub brings the best local kitchens to one menu. Pair a
            hand-stretched pizza with a crispy side, a cold drink and a homemade
            dessert, then order it all in minutes.
          </p>

          {/* 3 Compact How-It-Works Highlights */}
          <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full border-y border-[#D4A359]/20 py-5">
            <div className="flex items-start gap-2.5">
              <Flame className="w-4 h-4 text-[#E05A2B] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">
                  1. BROWSE
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Pizzas, sides, drinks and desserts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CupSoda className="w-4 h-4 text-[#D4A359] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">
                  2. ORDER
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Choose a delivery date and address.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <IceCreamBowl className="w-4 h-4 text-[#E05A2B] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">
                  3. ENJOY
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Get it fresh, straight to your door.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              className="bg-[#E05A2B] hover:bg-[#c84b20] text-white rounded-none px-7 py-6 text-xs uppercase tracking-[0.2em] font-semibold transition-all"
            >
              <Link href="/menu" className="flex items-center gap-2.5">
                Explore Full Menu
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
