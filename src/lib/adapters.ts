/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MenuItem, Order, PlatformUser, Transaction } from "@/lib/mock-data";

const iso = (d: unknown) => (d ? new Date(d as string).toISOString() : new Date().toISOString());

export function toItem(s: any, vendorFallback = "Local Pizzeria"): MenuItem {
  return {
    _id: String(s._id),
    itemName: s.itemName,
    category: s.category,
    description: s.description,
    price: Number(s.price),
    location: s.location,
    images: s.images ?? [],
    status: s.status,
    vendorId: String(s.vendorId),
    vendorName: s.vendor?.name ?? vendorFallback,
    vendorIsPremium: s.vendor?.subscriptionPlan === "premium",
    createdAt: iso(s.createdAt),
  };
}

export function toOrder(s: any): Order {
  return {
    _id: String(s._id),
    itemId: String(s.itemId),
    itemName: s.item?.itemName ?? "Removed item",
    itemImage: s.item?.images?.[0] ?? "/bannerPizza.png",
    vendorId: String(s.vendorId),
    vendorName: s.vendor?.name ?? "Restaurant",
    customerName: s.customer?.name ?? "Customer",
    customerEmail: s.customer?.email ?? "",
    deliveryDate: s.deliveryDate,
    deliveryAddress: s.deliveryAddress,
    message: s.message ?? "",
       status: s.status,
    createdAt: iso(s.createdAt),
    statusUpdatedAt: s.statusUpdatedAt ? iso(s.statusUpdatedAt) : null,
  };
}

export function toUser(s: any): PlatformUser {
  return {
    _id: String(s._id ?? s.id),
    name: s.name ?? "",
    email: s.email ?? "",
    role: s.role ?? "customer",
    isBlocked: Boolean(s.isBlocked),
    subscriptionPlan: s.subscriptionPlan === "premium" ? "premium" : "free",
    createdAt: iso(s.createdAt),
  };
}

export function toTransaction(s: any): Transaction {
  return {
    _id: String(s._id),
    vendorName: s.vendor?.name ?? "Vendor",
    vendorEmail: s.vendor?.email ?? "",
    plan: "premium",
    amount: Number(s.amount),
    currency: String(s.currency ?? "usd").toUpperCase(),
    status: s.status === "succeeded" ? "paid" : s.status === "failed" ? "failed" : "pending",
    createdAt: iso(s.createdAt),
  };
}