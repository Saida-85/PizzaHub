"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { useFavorites } from "@/lib/favorites";

interface FavoriteButtonProps {
  itemId: string;
  className?: string;
}

export default function FavoriteButton({
  itemId,
  className = "",
}: FavoriteButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as { id: string; role?: string } | undefined;

  const isCustomer = !!user && (user.role ?? "customer") === "customer";
  const { ids, toggle } = useFavorites(isCustomer ? user.id : undefined);

  // Vendors and admins can't save favorites
  if (user && !isCustomer) return null;

  const active = ids.has(itemId);

  const handleClick = async () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    try {
      const nowFavorite = await toggle(itemId);
      toast.success(
        nowFavorite ? "Added to favorites" : "Removed from favorites",
      );
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not update your favorites.",
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#D4A359]/40 bg-[#0B1315]/85 transition-colors hover:border-[#E05A2B] ${className}`}
    >
      <Heart
        className={`h-4 w-4 ${
          active ? "fill-[#E05A2B] text-[#E05A2B]" : "text-white"
        }`}
      />
    </button>
  );
}
