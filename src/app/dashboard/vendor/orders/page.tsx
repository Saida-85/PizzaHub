import PageHeader from "@/components/PageHeader";
import VendorOrders from "@/components/VendorOrders";
import { toOrder } from "@/lib/adapters";
import { serverApi } from "@/lib/server-api";

export const metadata = { title: "Customer Orders | PizzaHub" };

export default async function VendorOrdersPage() {
  const { orders: raw } = await serverApi<{ orders: unknown[] }>(
    "/api/orders/vendor",
  );
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
