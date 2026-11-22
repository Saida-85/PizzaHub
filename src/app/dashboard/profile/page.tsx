import PageHeader from "@/components/PageHeader";
import ProfileForm from "@/components/ProfileForm";
import { requireSession } from "@/lib/session";

export const metadata = { title: "Profile Settings | PizzaHub" };

export default async function ProfilePage() {
  await requireSession();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your account"
        title="Profile Settings"
        description="Update your name and profile image."
      />
      <ProfileForm />
    </div>
  );
}
