import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <span className="text-xs uppercase tracking-[0.28em] text-[#D4A359] font-semibold">
          {eyebrow}
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white leading-[1.12]">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
