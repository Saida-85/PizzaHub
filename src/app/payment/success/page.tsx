import PaymentStatus from "@/components/PaymentStatus";
import { requireRole } from "@/lib/session";

export const metadata = { title: "Payment Success | PizzaHub" };

export default async function PaymentSuccessPage() {
  // Only vendors pay for Premium
  await requireRole("vendor");
  return <PaymentStatus />;
}
