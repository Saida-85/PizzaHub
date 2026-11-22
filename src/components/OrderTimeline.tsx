import { Check, Circle, Clock, X } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { OrderStatus } from "@/lib/mock-data";

type StepState = "done" | "current" | "upcoming" | "failed";

interface Step {
  label: string;
  note: string;
  state: StepState;
}

function buildSteps(
  status: OrderStatus,
  createdAt: string,
  statusUpdatedAt: string | null,
): Step[] {
  const changed = statusUpdatedAt
    ? formatDate(statusUpdatedAt)
    : "Status updated";
  const steps: Step[] = [
    { label: "Order placed", note: formatDate(createdAt), state: "done" },
  ];

  if (status === "pending") {
    steps.push(
      {
        label: "Restaurant is reviewing",
        note: "Waiting for a response",
        state: "current",
      },
      {
        label: "Accepted or rejected",
        note: "The result will appear here",
        state: "upcoming",
      },
    );
  } else if (status === "accepted") {
    steps.push({
      label: "Accepted by the restaurant",
      note: changed,
      state: "done",
    });
  } else if (status === "rejected") {
    steps.push({
      label: "Rejected by the restaurant",
      note: changed,
      state: "failed",
    });
  } else {
    steps.push({ label: "Cancelled by you", note: changed, state: "failed" });
  }
  return steps;
}

const DOT: Record<StepState, string> = {
  done: "border-emerald-400 bg-emerald-400/15 text-emerald-300",
  current: "border-amber-400 bg-amber-400/15 text-amber-300",
  upcoming: "border-slate-600 text-slate-600",
  failed: "border-red-400 bg-red-400/15 text-red-300",
};

const ICON: Record<StepState, typeof Check> = {
  done: Check,
  current: Clock,
  upcoming: Circle,
  failed: X,
};

export default function OrderTimeline({
  status,
  createdAt,
  statusUpdatedAt,
}: {
  status: OrderStatus;
  createdAt: string;
  statusUpdatedAt: string | null;
}) {
  const steps = buildSteps(status, createdAt, statusUpdatedAt);

  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-slate-500">
        Order timeline
      </p>
      <ol className="mt-3" aria-label="Order status timeline">
        {steps.map((s, i) => {
          const Icon = ICON[s.state];
          const last = i === steps.length - 1;
          return (
            <li key={s.label} className="relative pb-5 pl-10 last:pb-0">
              {!last && (
                <span
                  aria-hidden="true"
                  className="absolute left-[13px] top-7 h-[calc(100%-1.5rem)] w-px bg-[#D4A359]/25"
                />
              )}
              <span
                className={`absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border ${DOT[s.state]}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <p
                className={`text-sm font-semibold ${
                  s.state === "upcoming" ? "text-slate-500" : "text-white"
                }`}
              >
                {s.label}
              </p>
              <p className="text-xs text-slate-400">{s.note}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
