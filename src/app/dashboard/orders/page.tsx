import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyOrdersPage() {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.28em] text-[#D4A359]">
        Your pizza nights
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-white">My Orders</h1>
      <p className="mt-1 text-sm text-slate-400">
        Your orders and all the good stuff in one place.
      </p>

      <div className="mt-8 border border-[#D4A359]/20 bg-[#132024]">
        <div className="flex items-center justify-between gap-4 p-5 border-b border-[#D4A359]/20">
          <div>
            <h2 className="text-lg font-semibold text-white">Your orders</h2>
            <p className="text-xs text-slate-400">
              All the good stuff you&apos;ve ordered.
            </p>
          </div>
          <Button
            asChild
            className="rounded-none bg-[#E05A2B] hover:bg-[#c84b20] text-white px-5 text-xs uppercase tracking-[0.2em] font-semibold"
          >
            <Link href="/menu">Find a pizza</Link>
          </Button>
        </div>

        {/* Empty state (replace with real orders later) */}
        <div className="p-10 text-center text-sm text-slate-400">
          No orders yet. Browse the menu and place your first order.
        </div>
      </div>
    </div>
  );
}
