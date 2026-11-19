"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Store, Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface MenuItemCardData {
  _id: string;
  itemName: string;
  category: string;
  price: number;
  location: string;
  images: string[];
  vendorName: string;
  vendorIsPremium?: boolean;
}

const SAMPLE_FEATURED_ITEMS: MenuItemCardData[] = [
  {
    _id: "1",
    itemName: "San Marzano Truffle Margherita",
    category: "Classic Pizzas",
    price: 18.5,
    location: "Gulshan, Dhaka",
    images: ["/bannerPizza.png"],
    vendorName: "Forno Nero Artisanal",
    vendorIsPremium: true,
  },
  {
    _id: "2",
    itemName: "Smoked Pepperoni & Hot Honey",
    category: "Meat Lovers",
    price: 21.0,
    location: "Banani, Dhaka",
    images: ["/bannerPizza.png"],
    vendorName: "Ember & Crust",
    vendorIsPremium: true,
  },
  {
    _id: "3",
    itemName: "Charred Heirloom & Burrata",
    category: "Vegetarian Pizzas",
    price: 19.0,
    location: "Dhanmondi, Dhaka",
    images: ["/bannerPizza.png"],
    vendorName: "Verde Wood-Fired",
    vendorIsPremium: false,
  },
  {
    _id: "4",
    itemName: "Wild Mushroom & Prosciutto Bianco",
    category: "Specialty / Gourmet Pizzas",
    price: 23.5,
    location: "Agrabad, Chattogram",
    images: ["/bannerPizza.png"],
    vendorName: "Casa Della Pasta & Pizza",
    vendorIsPremium: true,
  },
  {
    _id: "5",
    itemName: "Roasted Garlic Knot & Marinara Flight",
    category: "Sides & Appetizers",
    price: 9.5,
    location: "Uttara, Dhaka",
    images: ["/bannerPizza.png"],
    vendorName: "Hearthside Kitchen",
    vendorIsPremium: false,
  },
  {
    _id: "6",
    itemName: "Blood Orange Spritz & Tiramisu Cup",
    category: "Beverages & Desserts",
    price: 11.0,
    location: "GEC Circle, Chattogram",
    images: ["/bannerPizza.png"],
    vendorName: "Dolce & Forno",
    vendorIsPremium: true,
  },
];

interface FeaturedMenuSectionProps {
  items?: MenuItemCardData[];
}

export default function FeaturedMenuSection({
  items = SAMPLE_FEATURED_ITEMS,
}: FeaturedMenuSectionProps) {
  const displayedItems = items.slice(0, 6);

  return (
    <section className="w-full bg-[#0B1315] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4A359]/15">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] uppercase text-[#D4A359] mb-2">
              Curated From Local Ovens
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Menu Items
            </h2>
          </div>

          <Button
            asChild
            variant="outline"
            className="rounded-none border-[#D4A359]/60 bg-transparent text-[#D4A359] hover:bg-[#E05A2B] hover:border-[#E05A2B] hover:text-white text-xs uppercase tracking-[0.16em] w-fit"
          >
            <Link href="/menu">View All Pizzas</Link>
          </Button>
        </div>

        {/* Equal Height & Width Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {displayedItems.map((item, index) => (
            <motion.article
              key={item._id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="h-full flex flex-col bg-[#132024] border border-[#D4A359]/20 hover:border-[#D4A359]/60 transition-colors overflow-hidden group"
            >
              {/* Uniform Image Container */}
              <div className="relative w-full aspect-[4/3] bg-[#0e181b] overflow-hidden shrink-0">
                <Image
                  src={item.images?.[0] || "/bannerPizza.png"}
                  alt={item.itemName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Badge className="rounded-none bg-[#0B1315]/90 text-[#D4A359] border border-[#D4A359]/40 text-[10px] uppercase tracking-wider">
                    {item.category}
                  </Badge>
                </div>
                {item.vendorIsPremium && (
                  <div className="absolute top-3 right-3">
                    <Badge className="rounded-none bg-[#E05A2B] text-white text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Premium
                    </Badge>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="flex-1 flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-white leading-snug line-clamp-1">
                      {item.itemName}
                    </h3>
                    <span className="text-lg font-mono font-bold text-[#D4A359] shrink-0">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Store className="w-3.5 h-3.5 text-[#E05A2B] shrink-0" />
                      <span className="truncate">{item.vendorName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-[#D4A359] shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button pinned to bottom */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <Button
                    asChild
                    className="w-full rounded-none bg-[#E05A2B] hover:bg-[#c84b20] text-white text-xs uppercase tracking-[0.16em] font-semibold"
                  >
                    <Link
                      href={`/menu/${item._id}`}
                      className="flex items-center justify-center gap-2"
                    >
                      <span>View Details</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
