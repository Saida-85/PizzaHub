"use client";

import { useState } from "react";
import { Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { primaryBtn } from "@/lib/styles";

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const { url } = await api.post<{ url: string }>(
        "/api/payments/create-checkout-session",
      );
      if (!url) throw new Error("No checkout URL returned.");
      window.location.href = url;
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "Could not start checkout. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className={`${primaryBtn} w-full px-8 py-6`}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Starting checkout...
        </>
      ) : (
        <>
          <Crown className="mr-2 h-4 w-4" /> Upgrade to Premium
        </>
      )}
    </Button>
  );
}
