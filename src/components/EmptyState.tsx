import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { primaryBtn } from "@/lib/styles";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  text: string;
  action?: { href: string; label: string };
}

export default function EmptyState({
  icon: Icon,
  title,
  text,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-[#D4A359]/30 bg-[#132024]/40 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D4A359]/40 bg-[#0B1315]">
        <Icon className="h-5 w-5 text-[#D4A359]" />
      </span>
      <h3 className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-white">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">{text}</p>
      {action && (
        <Button asChild className={`${primaryBtn} mt-6 px-6 py-5`}>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
