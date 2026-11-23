import { Heart } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import MenuItemCard from "@/components/MenuItemCard";
import PageHeader from "@/components/PageHeader";
import { toItem } from "@/lib/adapters";
import ApiErrorState from "@/components/ApiErrorState";
import { serverApiSafe } from "@/lib/server-api";
import { requireRole } from "@/lib/session";

export const metadata = { title: "Favorites | PizzaHub" };

export default async function FavoritesPage() {
  await requireRole("customer");

  const res = await serverApiSafe<{ items: unknown[] }>("/api/favorites");
  if (!res.ok) return <ApiErrorState status={res.status} message={res.error} />;
  const { items: raw } = res.data;
  const items = raw.map((i) => toItem(i));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your pizza nights"
        title="Favorites"
        description="Pizzas, sides and drinks you saved for later."
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          text="Tap the heart on any menu item to save it here."
          action={{ href: "/menu", label: "Browse the menu" }}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
