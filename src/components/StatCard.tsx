import type { LucideIcon } from "lucide-react";
import { panel } from "@/lib/styles";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  hint?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: StatCardProps) {
  return (
    <div className={`${panel} p-5 h-full`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>
        {Icon && <Icon className="w-4 h-4 text-[#D4A359] shrink-0" />}
      </div>
      <p className="mt-3 text-3xl font-extrabold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
