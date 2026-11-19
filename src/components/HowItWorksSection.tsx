"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    step: "01",
    title: "Browse & Filter",
    description:
      "Search pizzas by name, filter by category or location, and inspect item details.",
  },
  {
    step: "02",
    title: "Place Your Order",
    description:
      "Choose your delivery date, address, and special instructions for the kitchen.",
  },
  {
    step: "03",
    title: "Kitchen Confirmation",
    description:
      "Vendors review and accept or reject incoming orders while you track progress.",
  },
  {
    step: "04",
    title: "Hot Delivery",
    description:
      "Enjoy fresh, oven-baked pizza delivered right to your doorstep.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="w-full bg-[#0e181b] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4A359]/15">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-[#D4A359] mb-2">
            Simple & Fast
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How PizzaHub Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="h-full bg-[#132024] border border-[#D4A359]/20 p-6 flex flex-col"
            >
              <span className="text-2xl font-mono font-extrabold text-[#D4A359] mb-3">
                {item.step}
              </span>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed flex-1">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
