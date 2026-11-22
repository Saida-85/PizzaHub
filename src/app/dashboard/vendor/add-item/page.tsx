import MenuItemForm from "@/components/MenuItemForm";
import PageHeader from "@/components/PageHeader";
import { serverApi } from "@/lib/server-api";
import { getPlan, requireRole } from "@/lib/session";

export const metadata = { title: "Add Menu Item | PizzaHub" };

export default async function AddItemPage() {
  const session = await requireRole("vendor");
  const { items } = await serverApi<{ items: { status: string }[] }>(
    "/api/menu-items/vendor/my",
  );
  const activeCount = items.filter(
    (i) => i.status === "approved" || i.status === "pending",
  ).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Vendor workspace"
        title="Add Menu Item"
        description="Tell customers what you're serving. An admin reviews every new item."
      />
      <MenuItemForm
        mode="create"
        activeCount={activeCount}
        plan={getPlan(session.user)}
      />
    </div>
  );
}
