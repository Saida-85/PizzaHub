import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Total orders", value: 0 },
  { label: "Pending", value: 0 },
  { label: "Accepted", value: 0 },
  { label: "Rejected", value: 0 },
];

export default function DashboardPage() {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.28em] text-[#D4A359]">
        Your pizza nights
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">Overview</h1>
          <p className="mt-1 text-sm text-slate-400">
            A quick look at your orders.
          </p>
        </div>
        <Button
          asChild
          className="rounded-none bg-[#E05A2B] hover:bg-[#c84b20] text-white px-6 text-xs uppercase tracking-[0.2em] font-semibold"
        >
          <Link href="/menu" className="flex items-center gap-2">
            Find a pizza <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="border border-[#D4A359]/20 bg-[#132024] p-5"
          >
            <p className="text-[11px] uppercase tracking-wider text-slate-400">
              {s.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
