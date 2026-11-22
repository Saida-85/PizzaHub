"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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

function ProfileFields({
  user,
  showBusinessName,
}: {
  user: ProfileUser;
  showBusinessName: boolean;
}) {
  const [name, setName] = useState(user.name ?? "");
  const [image, setImage] = useState(user.image ?? "");
  const [business, setBusiness] = useState(user.businessName ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Please enter your name.");
      return;
    }

    setLoading(true);
    try {
      // The server ignores role / plan fields, so they can't be changed from here.
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
        ...(showBusinessName ? { businessName: business.trim() } : {}),
      } as Parameters<typeof authClient.updateUser>[0]);

      if (error) {
        toast.error(error.message || "Could not update your profile.");
        return;
      }
      toast.success("Profile updated successfully.");
    } catch {
      toast.error("Something went wrong while saving your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${panel} max-w-2xl space-y-5 p-5 sm:p-8`}
    >
      <div className="flex items-center gap-4">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className="h-16 w-16 rounded-full border border-[#D4A359]/40 object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E05A2B] text-xl font-bold text-white">
            {name.slice(0, 1).toUpperCase() || "P"}
          </div>
        )}
        <div>
          <p className="font-semibold text-white">{name || "Your name"}</p>
          <p className="text-[11px] uppercase tracking-wider text-[#D4A359]">
            {user.role ?? "customer"} account
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className={labelClass}>
          Full name
        </Label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      {showBusinessName && (
        <div className="space-y-2">
          <Label htmlFor="business" className={labelClass}>
            Restaurant / business name
          </Label>
          <input
            id="business"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="Forno Nero Artisanal"
            className={inputClass}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="image" className={labelClass}>
          Profile image URL{" "}
          <span className="normal-case text-slate-500">(optional)</span>
        </Label>
        <input
          id="image"
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://i.ibb.co/..."
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email" className={labelClass}>
            Email
          </Label>
          <input
            id="email"
            value={user.email}
            disabled
            className={`${inputClass} opacity-60`}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role" className={labelClass}>
            Role
          </Label>
          <input
            id="role"
            value={user.role ?? "customer"}
            disabled
            className={`${inputClass} capitalize opacity-60`}
          />
        </div>
      </div>
      <p className="text-xs text-slate-400">
        Your email, role and subscription can&apos;t be changed from this page.
      </p>

      <Button
        type="submit"
        disabled={loading}
        className={`${primaryBtn} px-8 py-6`}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
}

export default function ProfileForm({
  showBusinessName = false,
}: {
  showBusinessName?: boolean;
}) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div className={`${panel} h-72 max-w-2xl animate-pulse`} />;
  }
  if (!session) {
    return (
      <p className="text-sm text-slate-400">
        Please sign in to edit your profile.
      </p>
    );
  }

  const user = session.user as unknown as ProfileUser;
  return <ProfileFields user={user} showBusinessName={showBusinessName} />;
}
