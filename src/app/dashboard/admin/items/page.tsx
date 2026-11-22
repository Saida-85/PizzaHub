import AdminItems from "@/components/AdminItems";
import PageHeader from "@/components/PageHeader";
import { toItem } from "@/lib/adapters";
import { serverApi } from "@/lib/server-api";

export const metadata = { title: "Manage Menu Items | PizzaHub" };

export default async function ManageItemsPage() {
  const { items } = await serverApi<{ items: unknown[] }>(
    "/api/admin/menu-items",
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin workspace"
        title="Manage Menu Items"
        description="Approve or reject new items. Only approved items appear on the public menu."
      />
      <AdminItems initialItems={items.map((i) => toItem(i))} />
    </div>
  );
}
