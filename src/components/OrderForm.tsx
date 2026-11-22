"use client";

import { useState } from "react";
import { Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import {
  inputClass,
  labelClass,
  panel,
  primaryBtn,
  textareaClass,
} from "@/lib/styles";

interface OrderFormProps {
  itemId: string;
  itemName: string;
  blockedReason?: string | null;
}

export default function OrderForm({
  itemId,
  itemName,
  blockedReason,
}: OrderFormProps) {
  const [minDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (blockedReason) {
    return (
      <div
        className={`${panel} flex items-start gap-3 p-5 text-sm text-slate-300`}
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#D4A359]" />
        {blockedReason}
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || date < minDate) {
      toast.error("Please choose a delivery date that is today or later.");
      return;
    }
    if (address.trim().length < 10) {
      toast.error("Please enter your full delivery address.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/orders", {
        itemId,
        deliveryDate: date,
        deliveryAddress: address.trim(),
        message: message.trim(),
      });
      toast.success(
        `Order placed for ${itemName}. The vendor will review it shortly.`,
      );
      setDate("");
      setAddress("");
      setMessage("");
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "Could not place your order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${panel} space-y-4 p-5 sm:p-6`}
      data-item-id={itemId}
    >
      <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
        Place your order
      </h2>

      <div className="space-y-2">
        <Label htmlFor="date" className={labelClass}>
          Delivery date
        </Label>
        <input
          id="date"
          type="date"
          min={minDate}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className={`${inputClass} scheme-dark`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className={labelClass}>
          Delivery address
        </Label>
        <textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="House, road, area, city"
          required
          className={`${textareaClass} min-h-20`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className={labelClass}>
          Special instructions{" "}
          <span className="normal-case text-slate-500">(optional)</span>
        </Label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Extra cheese, ring the bell twice..."
          className={`${textareaClass} min-h-20`}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className={`${primaryBtn} w-full py-6`}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing order...
          </>
        ) : (
          "Place Order"
        )}
      </Button>
      <p className="text-center text-xs text-slate-400">
        No online payment needed. The vendor confirms your order first.
      </p>
    </form>
  );
}
