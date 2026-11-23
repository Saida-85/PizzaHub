"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { outlineBtn, primaryBtn } from "@/lib/styles";

type Status = "checking" | "active" | "delayed";

interface OverviewResponse {
  stats: {
    subscriptionPlan: string;
    subscriptionExpiresAt: string | null;
  };
}

const MAX_TRIES = 10;
const INTERVAL_MS = 2000;

// Premium is switched on by the Stripe webhook, not by this page.
// This only asks the server whether the webhook has arrived yet.
export default function PaymentStatus() {
  const [status, setStatus] = useState<Status>("checking");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const check = async () => {
      try {
        const { stats } = await api.get<OverviewResponse>(
          "/api/vendor/overview",
        );
        if (cancelled) return;
        if (stats.subscriptionPlan === "premium") {
          setExpiresAt(stats.subscriptionExpiresAt);
          setStatus("active");
          return;
        }
      } catch {
        // Ignore and try again
      }

      tries += 1;
      if (tries >= MAX_TRIES) {
        if (!cancelled) setStatus("delayed");
        return;
      }
      timer = setTimeout(check, INTERVAL_MS);
    };

    void check();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const icon =
    status === "active" ? (
      <Check className="h-7 w-7 text-emerald-300" />
    ) : status === "delayed" ? (
      <Clock className="h-7 w-7 text-[#D4A359]" />
    ) : (
      <Loader2 className="h-7 w-7 animate-spin text-[#D4A359]" />
    );

  const eyebrow =
    status === "active"
      ? "Premium activated"
      : status === "delayed"
        ? "Still confirming"
        : "Payment received";

  const title = status === "active" ? "You're Premium!" : "Thank you!";

  const text =
    status === "active"
      ? `Stripe confirmed your payment. Unlimited menu items, the Premium badge and featured placement are now on${
          expiresAt ? ` until ${formatDate(expiresAt)}` : ""
        }.`
      : status === "delayed"
        ? "Your payment went through, but the confirmation from Stripe is taking longer than usual. Premium turns on automatically as soon as it arrives. Check your subscription page in a minute."
        : "We're confirming your payment with Stripe. Your Premium plan switches on as soon as the confirmation arrives, usually within a few seconds.";

  return (
    <section className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4A359]/40 bg-[#132024]">
        {icon}
      </span>
      <span className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#D4A359]">
        {eyebrow}
      </span>
      <h1 className="mt-2 text-3xl font-extrabold uppercase leading-[1.12] tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
      <p
        className="mt-4 text-sm leading-relaxed text-slate-300"
        aria-live="polite"
      >
        {text}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className={`${primaryBtn} px-8 py-6`}>
          <Link href="/dashboard/vendor/subscription">View subscription</Link>
        </Button>
        <Button asChild variant="outline" className={`${outlineBtn} px-8 py-6`}>
          <Link href="/dashboard/vendor">Go to dashboard</Link>
        </Button>
      </div>
    </section>
  );
}
