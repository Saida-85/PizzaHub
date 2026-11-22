import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col md:flex-row">
      <DashboardSidebar />
      <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">{children}</div>
    </div>
  );
}
