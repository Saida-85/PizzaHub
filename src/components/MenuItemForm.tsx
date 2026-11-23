"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/categories";
import { FREE_PLAN_LIMIT, type MenuItem } from "@/lib/mock-data";
import {
  inputClass,
  labelClass,
  outlineBtn,
  panel,
  primaryBtn,
  textareaClass,
} from "@/lib/styles";

interface MenuItemFormProps {
  mode: "create" | "edit";
  initial?: MenuItem;
  activeCount?: number;
  plan?: "free" | "premium";
}

const selectClass = `${inputClass} [&>option]:bg-[#132024]`;

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export default function MenuItemForm({
  mode,
  initial,
  activeCount = 0,
  plan = "free",
}: MenuItemFormProps) {
  const router = useRouter();
  const [itemName, setItemName] = useState(initial?.itemName ?? "");
  const [category, setCategory] = useState<string>(initial?.category ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.images[0] ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initial?.images[0] ?? null,
  );
  const [loading, setLoading] = useState(false);
  const blobRef = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    },
    [],
  );

  const limitReached =
    mode === "create" && plan === "free" && activeCount >= FREE_PLAN_LIMIT;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!picked.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (picked.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller.");
      return;
    }
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    const url = URL.createObjectURL(picked);
    blobRef.current = url;
    setFile(picked);
    setImageUrl("");
    setPreview(url);
  };

  const handleImageUrlChange = (value: string) => {
    setImageUrl(value);
    if (file) {
      setFile(null);
    }
    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current);
      blobRef.current = null;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      setPreview(initial?.images[0] ?? null);
      return;
    }
    setPreview(isValidHttpUrl(trimmed) ? trimmed : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNumber = Number(price);
    const trimmedUrl = imageUrl.trim();

    if (itemName.trim().length < 3)
      return void toast.error("Item name must be at least 3 characters.");
    if (!category) return void toast.error("Please choose a category.");
    if (!(priceNumber > 0))
      return void toast.error("Enter a price greater than 0.");
    if (!location.trim())
      return void toast.error("Please enter the area or city.");
    if (description.trim().length < 20)
      return void toast.error("Description must be at least 20 characters.");

    if (mode === "create" && !file && !trimmedUrl)
      return void toast.error(
        "Please upload an item image or paste an ImgBB / image URL.",
      );
    if (trimmedUrl && !isValidHttpUrl(trimmedUrl))
      return void toast.error(
        "Please enter a valid http(s) image URL (such as a direct ImgBB or image address).",
      );

    setLoading(true);
    try {
      let images = initial?.images ?? [];
      if (file) {
        const fd = new FormData();
        fd.append("image", file);
        const up = await api.post<{ url: string }>("/api/upload", fd);
        images = [up.url];
      } else if (trimmedUrl) {
        images = [trimmedUrl];
      }

      const payload = {
        itemName: itemName.trim(),
        category,
        description: description.trim(),
        price: priceNumber,
        location: location.trim(),
        images,
      };
      if (mode === "create") await api.post("/api/menu-items", payload);
      else await api.patch(`/api/menu-items/${initial?._id}`, payload);

      toast.success(
        mode === "create"
          ? "Item submitted! It will appear on the menu after admin approval."
          : "Item updated successfully.",
      );
      router.push("/dashboard/vendor/items");
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "Could not save the item. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (limitReached) {
    return (
      <div className={`${panel} p-6 sm:p-8`}>
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
          Free plan limit reached
        </h2>
        <p className="mt-2 max-w-xl text-sm text-slate-300">
          You have {activeCount} of {FREE_PLAN_LIMIT} active items. Upgrade to
          Premium to publish unlimited items.
        </p>
        <Button asChild className={`${primaryBtn} mt-5 px-6 py-5`}>
          <Link href="/dashboard/vendor/subscription">Upgrade to Premium</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${panel} grid gap-6 p-5 sm:p-8 lg:grid-cols-2`}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="itemName" className={labelClass}>
            Item name
          </Label>
          <input
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Truffle Margherita"
            required
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category" className={labelClass}>
              Category
            </Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className={selectClass}
            >
              <option value="" disabled>
                Choose a category
              </option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className={labelClass}>
              Price (USD)
            </Label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="18.50"
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className={labelClass}>
            Location (area / city)
          </Label>
          <input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Gulshan, Dhaka"
            required
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className={labelClass}>
            Description
          </Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the crust, toppings and what makes it special."
            required
            className={textareaClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="space-y-2">
          <Label htmlFor="image" className={labelClass}>
            Item image{" "}
            {mode === "create" ? "" : "(leave empty to keep the current one)"}
          </Label>
          <label
            htmlFor="image"
            className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden border border-dashed border-[#D4A359]/40 bg-[#0B1315] text-center transition-colors hover:border-[#D4A359]"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Selected item preview"
                onError={() => setPreview(null)}
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <ImagePlus className="h-8 w-8 text-[#D4A359]" />
                <span className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-300">
                  Click to upload an image
                </span>
                <span className="mt-1 text-[11px] text-slate-500">
                  JPG or PNG, up to 5 MB
                </span>
              </>
            )}
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="sr-only"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl" className={labelClass}>
            Or paste ImgBB / Google image address
          </Label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            placeholder="https://i.ibb.co/... or direct image URL"
            className={inputClass}
          />
          <p className="text-[11px] text-slate-400">
            Tip: Right-click a photo and choose &ldquo;Copy image address&rdquo;
            (not a webpage or Google search link).
          </p>
        </div>

        {mode === "create" && (
          <p className="text-xs text-slate-400">
            New items start as <span className="text-amber-300">pending</span>{" "}
            and show on the public menu only after an admin approves them.
            {plan === "free" &&
              ` Free plan: ${activeCount} of ${FREE_PLAN_LIMIT} active items used.`}
          </p>
        )}

        <div className="mt-auto flex flex-wrap gap-3">
          <Button
            type="submit"
            disabled={loading}
            className={`${primaryBtn} px-8 py-6`}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : mode === "create" ? (
              "Submit Item"
            ) : (
              "Save Changes"
            )}
          </Button>
          <Button
            asChild
            variant="outline"
            className={`${outlineBtn} px-6 py-6`}
          >
            <Link href="/dashboard/vendor/items">Cancel</Link>
          </Button>
        </div>
      </div>
    </form>
  );
}
