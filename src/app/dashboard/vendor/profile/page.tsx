import PageHeader from "@/components/PageHeader";
import ProfileForm from "@/components/ProfileForm";

export const metadata = { title: "Vendor Profile | PizzaHub" };

export default function VendorProfilePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Vendor workspace"
        title="Profile Settings"
        description="Update your restaurant details and profile image."
      />
      <ProfileForm showBusinessName />
    </div>
  );
}
