import PageHeader from "@/components/PageHeader";
import VendorItems from "@/components/VendorItems";
import { toItem } from "@/lib/adapters";
import ApiErrorState from "@/components/ApiErrorState";
import { serverApiSafe } from "@/lib/server-api";
import { getPlan, requireRole } from "@/lib/session";

export const metadata = { title: "My Menu Items | PizzaHub" };

export default async function VendorItemsPage() {
  const session = await requireRole("vendor");
  const vendor = session.user as unknown as {
    name: string;
    businessName?: string;
  };
  const res = await serverApiSafe<{ items: unknown[] }>(
    "/api/menu-items/vendor/my",
  );
  if (!res.ok) return <ApiErrorState status={res.status} message={res.error} />;
  const { items: raw } = res.data;
  const items = raw.map((i) => toItem(i, vendor.businessName || vendor.name));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Vendor workspace"
        title="My Menu Items"
        description="Manage what customers can order. Items go live after admin approval."
      />
      <VendorItems initialItems={items} plan={getPlan(session.user)} />
    </div>
  );
}
