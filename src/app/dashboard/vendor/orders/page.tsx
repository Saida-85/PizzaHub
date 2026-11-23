import PageHeader from "@/components/PageHeader";
import VendorOrders from "@/components/VendorOrders";
import { toOrder } from "@/lib/adapters";
import ApiErrorState from "@/components/ApiErrorState";
import { serverApiSafe } from "@/lib/server-api";

export const metadata = { title: "Customer Orders | PizzaHub" };

export default async function VendorOrdersPage() {
  const res = await serverApiSafe<{ orders: unknown[] }>("/api/orders/vendor");
  if (!res.ok) return <ApiErrorState status={res.status} message={res.error} />;
  const { orders: raw } = res.data;
  const orders = raw.map(toOrder);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Vendor workspace"
        title="Customer Orders"
        description="Accept or reject pending orders. Each order can be decided once."
      />
      <VendorOrders initialOrders={orders} />
    </div>
  );
}
