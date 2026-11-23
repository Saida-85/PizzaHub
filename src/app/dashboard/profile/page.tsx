import { requireRole } from "@/lib/session";
import PageHeader from "@/components/PageHeader";
import ProfileForm from "@/components/ProfileForm";

export const metadata = {
  title: "Customer Profile | PizzaHub",
};

export default async function ProfilePage() {
  const session = await requireRole("customer");

  const user = session.user as {
    name: string;
    email: string;
    image?: string | null;
    role?: string;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your account"
        title="Profile Settings"
        description="Manage your personal information and profile image."
      />

      <ProfileForm
        initialUser={{
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          role: user.role ?? "customer",
        }}
      />
    </div>
  );
}
