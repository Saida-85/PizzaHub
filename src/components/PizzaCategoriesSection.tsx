"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Pizza, Leaf, Flame, Crown, UtensilsCrossed, Wine } from "lucide-react";

const CATEGORIES = [
  {
    name: "Classic Pizzas",
    description: "Timeless Margherita, Marinara & stone-baked Italian staples.",
    icon: Pizza,
  },
  {
    name: "Vegetarian Pizzas",
    description: "Garden-fresh vegetables, roasted peppers & creamy cheeses.",
    icon: Leaf,
  },
  {
    name: "Meat Lovers",
    description:
      "Bold pepperoni, smoky sausage, cured meats & savory drizzles.",
    icon: Flame,
  },
  {
    name: "Specialty / Gourmet Pizzas",
    description:
      "Chef-crafted creations, truffle oil, burrata & artisanal pairings.",
    icon: Crown,
  },
  {
    name: "Sides & Appetizers",
    description: "Garlic knots, baked wings, cheesy sticks & dipping sauces.",
    icon: UtensilsCrossed,
  },
  {
    name: "Beverages & Desserts",
    description: "Chilled craft sodas, Italian desserts & sweet finishes.",
    icon: Wine,
  },
];

export default function PizzaCategoriesSection() {
  return (
    <section className="w-full bg-[#0e181b] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4A359]/15">
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
            const queryHref = `/menu?category=${encodeURIComponent(category.name)}`;

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
                  className="h-full flex flex-col justify-between p-6 bg-[#132024] border border-[#D4A359]/20 hover:border-[#E05A2B] transition-all group"
                >
                  <div>
                    <div className="w-11 h-11 rounded-sm bg-[#0B1315] border border-[#D4A359]/40 flex items-center justify-center mb-5 group-hover:border-[#E05A2B] transition-colors">
                      <Icon className="w-5 h-5 text-[#D4A359] group-hover:text-[#E05A2B] transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#D4A359] transition-colors">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  <span className="mt-6 inline-block text-xs uppercase tracking-[0.16em] text-[#D4A359] font-semibold">
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
