import { Suspense } from "react";
import MenuBrowser from "@/components/MenuBrowser";
import MenuGridSkeleton from "@/components/MenuGridSkeleton";
import PageHeader from "@/components/PageHeader";
import { toItem } from "@/lib/adapters";
import { serverApi } from "@/lib/server-api";

export const metadata = {
  title: "Browse Menu | PizzaHub",
  description: "Search pizzas, sides, drinks and desserts from local kitchens.",
};

type SearchParams = Promise<{
  search?: string;
  category?: string;
  location?: string;
  sort?: string;
}>;

export default async function MenuPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  // Same four query params the API understands: /api/menu-items?search=&category=&location=&sort=
  const qs = new URLSearchParams();
  for (const key of ["search", "category", "location", "sort"] as const) {
    const value = sp[key];
    if (typeof value === "string" && value) qs.set(key, value);
  }
  const query = qs.toString();

  const [filtered, all] = await Promise.all([
    serverApi<{ items: unknown[] }>(
      `/api/menu-items${query ? `?${query}` : ""}`,
      { auth: false },
    ),
    // Unfiltered list, only used to fill the location dropdown
    serverApi<{ items: unknown[] }>("/api/menu-items", { auth: false }),
  ]);

  const items = filtered.items.map((i) => toItem(i));
  const locations = [
    ...new Set(all.items.map((i) => toItem(i).location)),
  ].sort();

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <PageHeader
        eyebrow="The full menu"
        title="Browse the menu"
        description="Pizzas, sides, drinks and desserts from local kitchens near you."
      />
      <div className="mt-10">
        <Suspense fallback={<MenuGridSkeleton />}>
          <MenuBrowser items={items} locations={locations} />
        </Suspense>
      </div>
    </section>
  );
}
