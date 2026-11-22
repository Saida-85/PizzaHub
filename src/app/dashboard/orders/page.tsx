import Link from "next/link";
import { Button } from "@/components/ui/button";
import CustomerOrders from "@/components/CustomerOrders";
import PageHeader from "@/components/PageHeader";
import { toOrder } from "@/lib/adapters";
import { serverApi } from "@/lib/server-api";
import { requireRole } from "@/lib/session";
import { primaryBtn } from "@/lib/styles";

export const metadata = { title: "My Orders | PizzaHub" };

export default async function MyOrdersPage() {
  await requireRole("customer");

  const { orders: raw } = await serverApi<{ orders: unknown[] }>(
    "/api/orders/my",
  );
  const orders = raw.map(toOrder);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your pizza nights"
        title="My Orders"
        description="Track your orders and cancel the ones that are still pending."
        action={
          <Button asChild className={`${primaryBtn} px-6 py-6`}>
            <Link href="/menu">Find a pizza</Link>
          </Button>
        }
      />
      <CustomerOrders initialOrders={orders} />
    </div>
  );
}
