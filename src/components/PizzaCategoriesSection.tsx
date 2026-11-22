"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Pizza, Leaf, Flame, Crown, UtensilsCrossed, Wine } from "lucide-react";

const CATEGORIES = [
  {
    name: "Classic Pizzas",
    description: "Timeless Margherita, Marinara & stone-baked Italian staples.",
    icon: Pizza,
    image:
      "https://i.ibb.co.com/KcQjfrhj/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg",
  },
  {
    name: "Vegetarian Pizzas",
    description: "Garden-fresh vegetables, roasted peppers & creamy cheeses.",
    icon: Leaf,
    image:
      "https://i.ibb.co.com/S4G8Kdj3/Herb-Garden-Zucchini-Pizza-Love-and-Lemons.jpg",
  },
  {
    name: "Meat Lovers",
    description:
      "Bold pepperoni, smoky sausage, cured meats & savory drizzles.",
    icon: Flame,
    image: "https://i.ibb.co.com/hJGGY4ds/Cast-Iron-Skillet-Pizza.jpg",
  },
  {
    name: "Specialty / Gourmet Pizzas",
    description:
      "Chef-crafted creations, truffle oil, burrata & artisanal pairings.",
    icon: Crown,
    image: "https://i.ibb.co.com/gLfYPQMD/image.jpg",
  },
  {
    name: "Sides & Appetizers",
    description: "Garlic knots, baked wings, cheesy sticks & dipping sauces.",
    icon: UtensilsCrossed,
    image:
      "https://i.ibb.co.com/pFDz6TK/Gourmet-Ice-Cream-Dessert-Platter-Elegant-Fine-Dining-Dessert.jpg",
  },
  {
    name: "Beverages & Desserts",
    description: "Chilled craft sodas, Italian desserts & sweet finishes.",
    icon: Wine,
    image: "https://i.ibb.co.com/TD2Rt6RS/Drink-photography.jpg",
  },
];

export default function PizzaCategoriesSection() {
  // Menu filters use these values, not the display names.
  const CATEGORY_VALUES: Record<string, string> = {
    "Classic Pizzas": "classic",
    "Vegetarian Pizzas": "vegetarian",
    "Meat Lovers": "meat-lovers",
    "Specialty / Gourmet Pizzas": "specialty",
    "Sides & Appetizers": "sides",
    "Beverages & Desserts": "beverages-desserts",
  };
  return (
    <section className="w-full bg-[#0B1315] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4A359]/15">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-[#D4A359] mb-2">
            Explore By Style
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Pizza Categories
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Filter local pizzeria menus by crust style, dietary preference, or
            craving.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category, idx) => {
            const Icon = category.icon;
            const queryHref = `/menu?category=${CATEGORY_VALUES[category.name]}`;

            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="h-full"
              >
                <Link
                  href={queryHref}
                  className="relative h-full min-h-[250px] flex flex-col justify-between p-6 bg-[#0B1315] border border-[#D4A359]/25 hover:border-[#E05A2B] transition-all group overflow-hidden"
                >
                  {/* Background Photo */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-65 brightness-105 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                  />

                  {/* Balanced Dark Gradient Overlay for Readability */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#070C0E]/85 via-[#0B1315]/50 to-[#0B1315]/25 group-hover:from-[#070C0E]/80 group-hover:via-[#0B1315]/40 transition-colors"
                  />

                  {/* Foreground Content */}
                  <div className="relative z-10">
                    <div className="w-11 h-11 rounded-sm bg-[#0B1315]/85 backdrop-blur-xs border border-[#D4A359]/50 flex items-center justify-center mb-5 group-hover:border-[#E05A2B] transition-colors">
                      <Icon className="w-5 h-5 text-[#D4A359] group-hover:text-[#E05A2B] transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#D4A359] transition-colors drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-100 leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                      {category.description}
                    </p>
                  </div>

                  <span className="relative z-10 mt-6 inline-block text-xs uppercase tracking-[0.16em] text-[#D4A359] font-semibold group-hover:text-white transition-colors drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                    Browse Category →
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
