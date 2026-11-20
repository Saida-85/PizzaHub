"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock, Award, Utensils } from "lucide-react";

const BENEFITS = [
  {
    title: "Verified Local Pizzerias",
    description:
      "Every restaurant partner and menu item is reviewed so you order from trusted kitchens.",
    icon: ShieldCheck,
  },
  {
    title: "Real-Time Order Tracking",
    description:
      "Schedule your delivery date and address, cancel pending orders easily, and track status updates.",
    icon: Clock,
  },
  {
    title: "Premium Artisanal Spotlights",
    description:
      "Discover featured gourmet kitchens and signature pies crafted with fresh ingredients.",
    icon: Award,
  },
  {
    title: "Full Menu Variety",
    description:
      "From hand-stretched classics and meat lovers to sides, drinks, and desserts in one place.",
    icon: Utensils,
  },
];

export default function WhyChooseSection() {
  return (
    <section className="w-full bg-[#0B1315] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4A359]/15">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-[#D4A359] mb-2">
            The PizzaHub Standard
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Choose PizzaHub?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Built for pizza lovers and local restaurants with transparent
            ordering and quality at every step.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="h-full bg-[#070C0E] border border-[#D4A359]/20 p-6 flex flex-col"
              >
                <Icon className="w-6 h-6 text-[#E05A2B] mb-4" />
                <h3 className="text-base font-bold text-white">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed flex-1">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
