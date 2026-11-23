import DashboardSidebar from "@/components/DashboardSidebar";
import { requireSession } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const u = session.user as unknown as {
    name?: string;
    image?: string | null;
    role?: string;
  };
  const role: "customer" | "vendor" | "admin" =
    u.role === "admin" || u.role === "vendor" ? u.role : "customer";

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col md:flex-row">
      <DashboardSidebar
        user={{ name: u.name || "User", role, image: u.image ?? null }}
      />
      <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">{children}</div>
    </div>
  );
}
export const maxDuration = 60;
