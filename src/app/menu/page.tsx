import { Suspense } from "react";
import MenuBrowser from "@/components/MenuBrowser";
import MenuGridSkeleton from "@/components/MenuGridSkeleton";
import PageHeader from "@/components/PageHeader";
import { toItem } from "@/lib/adapters";
import ApiErrorState from "@/components/ApiErrorState";
import { serverApiSafe } from "@/lib/server-api";

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
    serverApiSafe<{ items: unknown[] }>(
      `/api/menu-items${query ? `?${query}` : ""}`,
      { auth: false },
    ),
    // Unfiltered list, only used to fill the location dropdown
    serverApiSafe<{ items: unknown[] }>("/api/menu-items", { auth: false }),
  ]);

  if (!filtered.ok || !all.ok) {
    const failed = !filtered.ok
      ? filtered
      : (all as Extract<typeof all, { ok: false }>);
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <ApiErrorState status={failed.status} message={failed.error} />
      </section>
    );
  }

  const items = filtered.data.items.map((i) => toItem(i));
  const locations = [
    ...new Set(all.data.items.map((i) => toItem(i).location)),
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
