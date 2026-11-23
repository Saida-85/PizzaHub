import AdminUsers from "@/components/AdminUsers";
import PageHeader from "@/components/PageHeader";
import { toUser } from "@/lib/adapters";
import ApiErrorState from "@/components/ApiErrorState";
import { serverApiSafe } from "@/lib/server-api";

export const metadata = { title: "Manage Users | PizzaHub" };

export default async function ManageUsersPage() {
  const res = await serverApiSafe<{ users: unknown[] }>("/api/admin/users");
  if (!res.ok) return <ApiErrorState status={res.status} message={res.error} />;
  const { users } = res.data;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin workspace"
        title="Manage Users"
        description="Search every account and block anyone who breaks the rules."
      />
      <AdminUsers initialUsers={users.map(toUser)} />
    </div>
  );
}
