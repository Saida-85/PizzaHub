const STYLES: Record<string, string> = {
  pending: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  approved: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  accepted: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  paid: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  rejected: "border-red-400/40 bg-red-400/10 text-red-300",
  failed: "border-red-400/40 bg-red-400/10 text-red-300",
  cancelled: "border-slate-400/40 bg-slate-400/10 text-slate-300",
  inactive: "border-slate-400/40 bg-slate-400/10 text-slate-300",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
        STYLES[status] ?? STYLES.inactive
      }`}
    >
      {status}
    </span>
  );
}
