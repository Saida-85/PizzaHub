import { requireRole } from "@/lib/session";
import PageHeader from "@/components/PageHeader";
import ProfileForm from "@/components/ProfileForm";

export const metadata = {
  title: "Admin Profile | PizzaHub",
};

export default async function AdminProfilePage() {
  const session = await requireRole("admin");

  const user = session.user as {
    name: string;
    email: string;
    image?: string | null;
    role?: string;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administrator account"
        title="Profile Settings"
        description="Manage your admin name and profile picture."
      />

      <ProfileForm
        initialUser={{
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          role: user.role ?? "admin",
        }}
      />
    </div>
  );
}
