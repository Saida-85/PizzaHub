import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Crown, MapPin, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryLabel } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import { outlineBtn } from "@/lib/styles";
import type { MenuItem } from "@/lib/mock-data";

export default function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <article className="group flex h-full flex-col border border-[#D4A359]/20 bg-[#132024] transition-colors hover:border-[#D4A359]/60">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0B1315]">
        <Image
          src={item.images[0]}
          alt={item.itemName}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 border border-[#D4A359]/40 bg-[#0B1315]/85 px-2.5 py-1 text-[10px] uppercase tracking-widest text-[#D4A359]">
          {categoryLabel(item.category)}
        </span>
        {item.vendorIsPremium && (
          <span className="absolute right-3 top-3 flex items-center gap-1 bg-[#E05A2B] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
            <Crown className="h-3 w-3" /> Premium
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-bold leading-snug text-white">
            {item.itemName}
          </h3>
          <span className="shrink-0 text-lg font-extrabold text-[#D4A359]">
            {formatPrice(item.price)}
          </span>
        </div>

        <ul className="mt-3 space-y-1.5 text-xs text-slate-400">
          <li className="flex items-center gap-2">
            <Store className="h-3.5 w-3.5 shrink-0 text-[#E05A2B]" />
            <span className="truncate">{item.vendorName}</span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#E05A2B]" />
            <span className="truncate">{item.location}</span>
          </li>
        </ul>

        <Button asChild className={`${outlineBtn} mt-5 w-full py-5`}>
          <Link
            href={`/menu/${item._id}`}
            className="flex items-center justify-center gap-2"
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
