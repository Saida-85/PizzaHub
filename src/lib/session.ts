
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

type Role = "customer" | "vendor" | "admin";

const HOME: Record<Role, string> = {
  customer: "/dashboard",
  vendor: "/dashboard/vendor",
  admin: "/dashboard/admin",
};

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireSession() {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  const user = session.user as unknown as {
    isBlocked?: boolean;
  };

  if (user.isBlocked) {
    redirect("/signin");
  }

  return session;
}

export async function requireRole(role: Role) {
  const session = await requireSession();

  const user = session.user as unknown as {
    role?: string;
  };

  const actual: Role =
    user.role === "admin" || user.role === "vendor"
      ? user.role
      : "customer";

  if (actual !== role) {
    redirect(HOME[actual]);
  }

  return session;
}

export function getPlan(
  user: unknown
): "free" | "premium" {
  const u = user as {
    subscriptionPlan?: string;
    subscriptionExpiresAt?: string | Date | null;
  };

  if (u.subscriptionPlan !== "premium") {
    return "free";
  }

  if (
    u.subscriptionExpiresAt &&
    new Date(u.subscriptionExpiresAt) < new Date()
  ) {
    return "free";
  }

  return "premium";
}
