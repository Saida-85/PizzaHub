import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Crown, MapPin, Store } from "lucide-react";
import ItemGallery from "@/components/ItemGallery";
import OrderForm from "@/components/OrderForm";
import { toItem } from "@/lib/adapters";
import { categoryLabel } from "@/lib/categories";
import { formatDate, formatPrice } from "@/lib/format";
import { ApiError, serverApi } from "@/lib/server-api";
import { getServerSession } from "@/lib/session";

export default async function ItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Private route: logged-out visitors go to Sign In.
  const session = await getServerSession();
  if (!session) redirect("/signin");

  const item = await serverApi<{ item: unknown }>(`/api/menu-items/${id}`, {
    auth: false,
  })
    .then((r) => toItem(r.item))
    .catch((e) => {
      if (e instanceof ApiError && (e.status === 404 || e.status === 400))
        notFound();
      throw e;
    });

  const user = session.user as unknown as { id: string; role?: string };
  let blockedReason: string | null = null;
  if (user.role === "admin") {
    blockedReason = "Admin accounts can't place customer orders.";
  } else if (user.role === "vendor" && item.vendorId === user.id) {
    blockedReason = "This is your own item, so you can't order it.";
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href="/menu"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-[#D4A359]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to menu
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ItemGallery images={item.images} name={item.itemName} />

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4A359]">
            {categoryLabel(item.category)}
          </span>
          <h1 className="mt-2 text-3xl font-extrabold uppercase leading-[1.12] tracking-tight text-white sm:text-4xl">
            {item.itemName}
          </h1>
          <p className="mt-4 text-3xl font-extrabold text-[#D4A359]">
            {formatPrice(item.price)}
          </p>

          <ul className="mt-5 space-y-2 text-sm text-slate-300">
            <li className="flex items-center gap-2">
              <Store className="h-4 w-4 text-[#E05A2B]" />
              {item.vendorName}
              {item.vendorIsPremium && (
                <span className="ml-1 inline-flex items-center gap-1 bg-[#E05A2B] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                  <Crown className="h-3 w-3" /> Premium
                </span>
              )}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#E05A2B]" />
              {item.location}
            </li>
          </ul>

          <p className="mt-6 text-sm leading-relaxed text-slate-300 sm:text-base">
            {item.description}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Listed on {formatDate(item.createdAt)}
          </p>

          <div className="mt-8">
            <OrderForm
              itemId={item._id}
              itemName={item.itemName}
              blockedReason={blockedReason}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
