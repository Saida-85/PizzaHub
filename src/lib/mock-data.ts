import type { CategoryValue } from "./categories";

export type ItemStatus = "pending" | "approved" | "rejected" | "inactive";
export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";
export type Role = "customer" | "vendor" | "admin";

export interface MenuItem {
  _id: string;
  itemName: string;
  category: CategoryValue;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ItemStatus;
  vendorId: string;
  vendorName: string;
  vendorIsPremium: boolean;
  createdAt: string;
}

export interface Order {
  _id: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  vendorId: string;
  vendorName: string;
  customerName: string;
  customerEmail: string;
  deliveryDate: string;
  deliveryAddress: string;
  message: string;
  status: OrderStatus;
  createdAt: string;
}

export interface PlatformUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isBlocked: boolean;
  subscriptionPlan: "free" | "premium";
  createdAt: string;
}

export interface Transaction {
  _id: string;
  vendorName: string;
  vendorEmail: string;
  plan: "premium";
  amount: number;
  currency: string;
  status: "paid" | "failed" | "pending";
  createdAt: string;
}

export const FREE_PLAN_LIMIT = 3;
export const PREMIUM_PRICE = 19;