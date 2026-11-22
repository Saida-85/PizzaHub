"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import MenuItemCard from "@/components/MenuItemCard";
import { CATEGORIES } from "@/lib/categories";
import { inputClass, outlineBtn, panel } from "@/lib/styles";
import type { MenuItem } from "@/lib/mock-data";

type Sort = "default" | "price_asc" | "price_desc";

const selectClass = `${inputClass} [&>option]:bg-[#132024]`;

// Filters live in the URL: /menu?search=&category=&location=&sort=price_asc
export default function MenuBrowser({
  items,
  locations,
}: {
  items: MenuItem[];
  locations: string[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(params.get("search") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "all");
  const [location, setLocation] = useState(params.get("location") ?? "all");
  const [sort, setSort] = useState<Sort>(
    (params.get("sort") as Sort) ?? "default",
  );

  useEffect(() => {
    const qs = new URLSearchParams();
    if (search.trim()) qs.set("search", search.trim());
    if (category !== "all") qs.set("category", category);
    if (location !== "all") qs.set("location", location);
    if (sort !== "default") qs.set("sort", sort);
    const query = qs.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [search, category, location, sort, pathname, router]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = items.filter(
      (i) =>
        (!term || i.itemName.toLowerCase().includes(term)) &&
        (category === "all" || i.category === category) &&
        (location === "all" || i.location === location),
    );
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [items, search, category, location, sort]);

  const reset = () => {
    setSearch("");
    setCategory("all");
    setLocation("all");
    setSort("default");
  };

  return (
    <div>
      <div
        className={`${panel} grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]`}
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pizzas, sides, drinks..."
            aria-label="Search by name"
            className={`${inputClass} pl-10`}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className={selectClass}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-label="Filter by location"
          className={selectClass}
        >
          <option value="all">All locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          aria-label="Sort by price"
          className={selectClass}
        >
          <option value="default">Sort: Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-slate-400">
        {visible.length} {visible.length === 1 ? "item" : "items"} found
      </p>

      {visible.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={SearchX}
            title="No items match your filters"
            text="Try a different search, category or location."
          />
          <div className="mt-4 text-center">
            <Button onClick={reset} className={`${outlineBtn} px-6 py-5`}>
              Reset filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
