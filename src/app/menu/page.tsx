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

export default async function MenuPage() {
  const { items: raw } = await serverApi<{ items: unknown[] }>(
    "/api/menu-items",
    { auth: false },
  );
  const items = raw.map((i) => toItem(i));
  const locations = [...new Set(items.map((i) => i.location))].sort();

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
