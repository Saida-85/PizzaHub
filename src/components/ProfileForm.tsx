"use client";

import { useEffect, useState } from "react";
import { Loader2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authClient, useSession } from "@/lib/auth-client";
import { inputClass, labelClass, panel, primaryBtn } from "@/lib/styles";

interface ProfileUser {
  name: string;
  email: string;
  image?: string | null;
  role?: string;
  businessName?: string | null;
}

interface ProfileFormProps {
  showBusinessName?: boolean;
  initialUser?: ProfileUser;
}

export default function ProfileForm({
  showBusinessName = false,
  initialUser,
}: ProfileFormProps) {
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const currentUser = (initialUser ?? session?.user) as ProfileUser | undefined;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [business, setBusiness] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    setName(currentUser.name ?? "");
    setEmail(currentUser.email ?? "");
    setImage(currentUser.image ?? "");
    setBusiness(currentUser.businessName ?? "");
    setInitialized(true);
  }, [
    currentUser?.name,
    currentUser?.email,
    currentUser?.image,
    currentUser?.businessName,
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      toast.error("Please enter at least 2 characters for your name.");
      return;
    }

    if (image.trim()) {
      try {
        new URL(image.trim());
      } catch {
        toast.error("Please enter a valid profile image URL.");
        return;
      }
    }

    setLoading(true);

    try {
      const updateData = {
        name: name.trim(),
        image: image.trim() || null,
        ...(showBusinessName ? { businessName: business.trim() } : {}),
      };

      const { error } = await authClient.updateUser(
        updateData as Parameters<typeof authClient.updateUser>[0],
      );

      if (error) {
        toast.error(error.message || "Could not update your profile.");
        return;
      }

      toast.success("Profile updated successfully.");

      router.refresh();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Something went wrong while updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending && !initialUser) {
    return (
      <div
        className={`${panel} flex h-72 max-w-2xl items-center justify-center`}
      >
        <Loader2 className="h-7 w-7 animate-spin text-[#D4A359]" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={`${panel} max-w-2xl p-8`}>
        <p className="text-sm text-slate-400">
          Your session could not be loaded. Please sign in again.
        </p>
      </div>
    );
  }

  if (!initialized && !initialUser) {
    return <div className={`${panel} h-72 max-w-2xl animate-pulse`} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${panel} max-w-2xl space-y-5 p-5 sm:p-8`}
    >
      {/* Profile preview */}
      <div className="flex items-center gap-4">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt="Profile"
            className="h-16 w-16 rounded-full border border-[#D4A359]/40 object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E05A2B] text-white">
            <UserRound className="h-7 w-7" />
          </div>
        )}

        <div>
          <p className="font-semibold text-white">{name || "Your name"}</p>
          <p className="text-[11px] uppercase tracking-wider text-[#D4A359]">
            {currentUser.role ?? "customer"} account
          </p>
        </div>
      </div>

      {/* Full name */}
      <div className="space-y-2">
        <Label htmlFor="profile-name" className={labelClass}>
          Full name
        </Label>

        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          className={inputClass}
          placeholder="Enter your full name"
        />
      </div>

      {/* Vendor business name */}
      {showBusinessName && (
        <div className="space-y-2">
          <Label htmlFor="profile-business" className={labelClass}>
            Restaurant / business name
          </Label>

          <input
            id="profile-business"
            type="text"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            className={inputClass}
            placeholder="Enter your restaurant name"
          />
        </div>
      )}

      {/* Profile image */}
      <div className="space-y-2">
        <Label htmlFor="profile-image" className={labelClass}>
          Profile image URL
          <span className="normal-case text-slate-500"> (optional)</span>
        </Label>

        <input
          id="profile-image"
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className={inputClass}
          placeholder="https://i.ibb.co/..."
        />
      </div>

      {/* Email and role */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-email" className={labelClass}>
            Email
          </Label>

          <input
            id="profile-email"
            type="email"
            value={email}
            disabled
            className={`${inputClass} opacity-60`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-role" className={labelClass}>
            Account type
          </Label>

          <input
            id="profile-role"
            value={currentUser.role ?? "customer"}
            disabled
            className={`${inputClass} capitalize opacity-60`}
          />
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Your email, account role and subscription cannot be changed here.
      </p>

      {/* Save button */}
      <Button
        type="submit"
        disabled={loading}
        className={`${primaryBtn} px-8 py-6`}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
}
