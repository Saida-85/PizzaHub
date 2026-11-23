import { notFound } from "next/navigation";
import MenuItemForm from "@/components/MenuItemForm";
import PageHeader from "@/components/PageHeader";
import { toItem } from "@/lib/adapters";
import ApiErrorState from "@/components/ApiErrorState";
import { serverApiSafe } from "@/lib/server-api";
import { getPlan, requireRole } from "@/lib/session";

export const metadata = { title: "Edit Menu Item | PizzaHub" };

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireRole("vendor");
  const vendor = session.user as unknown as {
    name: string;
    businessName?: string;
  };

  // /vendor/my only returns this vendor's items, so someone else's id is "not found".
  const res = await serverApiSafe<{ items: unknown[] }>(
    "/api/menu-items/vendor/my",
  );
  if (!res.ok) return <ApiErrorState status={res.status} message={res.error} />;
  const { items } = res.data;
  const found = items
    .map((i) => toItem(i, vendor.businessName || vendor.name))
    .find((i) => i._id === id);
  if (!found) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Vendor workspace"
        title="Edit Menu Item"
        description={found.itemName}
      />
      <MenuItemForm mode="edit" initial={found} plan={getPlan(session.user)} />
    </div>
  );
}
