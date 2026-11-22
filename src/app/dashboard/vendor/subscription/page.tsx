import { Check, Crown } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import UpgradeButton from "@/components/UpgradeButton";
import { FREE_PLAN_LIMIT, PREMIUM_PRICE } from "@/lib/mock-data";
import { getPlan, requireRole } from "@/lib/session";

export const metadata = { title: "Subscription | PizzaHub" };

const FREE_FEATURES = [
  `Up to ${FREE_PLAN_LIMIT} active menu items`,
  "Basic vendor dashboard",
  "Order management",
];
const PREMIUM_FEATURES = [
  "Unlimited active menu items",
  "Premium badge on your listings",
  "Featured placement on the homepage",
  "Everything in Free",
];

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm text-slate-300">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#D4A359]" />
      {children}
    </li>
  );
}

export default async function SubscriptionPage() {
  const session = await requireRole("vendor");
  const isPremium = getPlan(session.user) === "premium";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Vendor workspace"
        title="Subscription"
        description="Choose the plan that fits your kitchen."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex h-full flex-col border border-[#D4A359]/20 bg-[#132024] p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold uppercase tracking-tight text-white">
              Free
            </h2>
            {!isPremium && (
              <span className="border border-[#D4A359]/40 px-2.5 py-1 text-[10px] uppercase tracking-widest text-[#D4A359]">
                Current plan
              </span>
            )}
          </div>
          <p className="mt-4 text-4xl font-extrabold text-white">
            $0
            <span className="text-base font-medium text-slate-400">
              {" "}
              / month
            </span>
          </p>
          <ul className="mt-6 flex-1 space-y-3">
            {FREE_FEATURES.map((f) => (
              <Feature key={f}>{f}</Feature>
            ))}
          </ul>
        </div>

        <div className="flex h-full flex-col border-2 border-[#E05A2B] bg-[#132024] p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-tight text-white">
              <Crown className="h-5 w-5 text-[#D4A359]" /> Premium
            </h2>
            {isPremium && (
              <span className="bg-[#E05A2B] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
                Current plan
              </span>
            )}
          </div>
          <p className="mt-4 text-4xl font-extrabold text-white">
            ${PREMIUM_PRICE}
            <span className="text-base font-medium text-slate-400">
              {" "}
              / month
            </span>
          </p>
          <ul className="mt-6 flex-1 space-y-3">
            {PREMIUM_FEATURES.map((f) => (
              <Feature key={f}>{f}</Feature>
            ))}
          </ul>
          <div className="mt-8">
            {isPremium ? (
              <p className="text-sm text-emerald-300">
                You&apos;re on Premium. Thank you!
              </p>
            ) : (
              <>
                <UpgradeButton />
                <p className="mt-3 text-center text-xs text-slate-400">
                  Premium turns on only after Stripe confirms your payment.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
