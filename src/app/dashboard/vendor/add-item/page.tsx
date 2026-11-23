import MenuItemForm from "@/components/MenuItemForm";
import PageHeader from "@/components/PageHeader";
import ApiErrorState from "@/components/ApiErrorState";
import { serverApiSafe } from "@/lib/server-api";
import { getPlan, requireRole } from "@/lib/session";

export const metadata = { title: "Add Menu Item | PizzaHub" };

export default async function AddItemPage() {
  const session = await requireRole("vendor");
  const res = await serverApiSafe<{ items: { status: string }[] }>(
    "/api/menu-items/vendor/my",
  );
  if (!res.ok) return <ApiErrorState status={res.status} message={res.error} />;
  const { items } = res.data;
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
