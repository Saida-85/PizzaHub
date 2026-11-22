import { panel } from "@/lib/styles";

interface Datum {
  label: string;
  value: number;
}

export function BarChart({ title, data }: { title: string; data: Datum[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={`${panel} p-5 h-full`}>
      <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
        {title}
      </h2>
      <div
        className="mt-6 flex h-44 items-end gap-3"
        role="img"
        aria-label={`${title}: ${data.map((d) => `${d.label} ${d.value}`).join(", ")}`}
      >
        {data.map((d) => (
          <div
            key={d.label}
            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            <span className="text-xs font-semibold text-slate-300">
              {d.value}
            </span>
            <div
              className="w-full max-w-10 bg-gradient-to-t from-[#E05A2B] to-[#D4A359]"
              style={{ height: `${Math.max((d.value / max) * 100, 4)}%` }}
            />
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BreakdownBars({
  title,
  rows,
}: {
  title: string;
  rows: (Datum & { color?: string })[];
}) {
  const total = Math.max(
    rows.reduce((sum, r) => sum + r.value, 0),
    1,
  );

  return (
    <div className={`${panel} p-5 h-full`}>
      <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
        {title}
      </h2>
      <ul className="mt-5 space-y-4">
        {rows.map((r) => (
          <li key={r.label}>
            <div className="flex justify-between text-xs text-slate-300">
              <span className="uppercase tracking-wider">{r.label}</span>
              <span>{r.value}</span>
            </div>
            <div className="mt-1.5 h-2 w-full bg-[#0B1315]">
              <div
                className="h-full"
                style={{
                  width: `${(r.value / total) * 100}%`,
                  backgroundColor: r.color ?? "#D4A359",
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
