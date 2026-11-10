'use client';

/* ADD ITEM POPUP — modal styling only (not wired to any create-product
   logic yet). Darkened backdrop + centered scrollable panel. The trigger
   lives in DashboardNavbar, which owns the open/close toggle. */

import { useEffect, useState } from "react";
import { Plus, X, ImagePlus } from "lucide-react";
import type { MenuItem } from "@/types/types";

type VariantRow = { id: string; name: string; price: string; calories: string };

function initialRows(item?: MenuItem | null): VariantRow[] {
  if (item?.variants?.length) {
    return item.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      price: String(variant.price),
      calories: variant.calories != null ? String(variant.calories) : "",
    }));
  }
  return [{ id: "new-1", name: "", price: "", calories: "" }];
}

type Props = {
    open: boolean;
    onClose: () => void;
    /** When set, the popup runs in EDIT mode and pre-fills with this item. */
    item?: MenuItem | null;
};

export default function AddItemModal({ open, onClose, item }: Props) {
    const editing = item != null;
    const [variantRows, setVariantRows] = useState<VariantRow[]>(() => initialRows(item));

    useEffect(() => {
      const timeoutId = window.setTimeout(() => setVariantRows(initialRows(item)), 0);
      return () => window.clearTimeout(timeoutId);
    }, [item]);

    const updateVariant = (id: string, patch: Partial<VariantRow>) => {
        setVariantRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
    };

    const removeVariant = (id: string) => {
        setVariantRows((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
    };

    const addVariant = () => {
        setVariantRows((prev) => [
            ...prev,
            {
                id: `new-${Date.now()}-${prev.length}`,
                name: "",
                price: "",
                calories: "",
            },
        ]);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-[2px]">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[1.75rem] bg-white shadow-[0_30px_80px_-30px_rgba(36,23,8,0.6)]">
                {/* Popup header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-white/95 px-6 py-4 backdrop-blur">
                    <div>
                        <h3 className="font-display text-lg font-bold text-ink">
                            {editing ? `Edit ${item.name}` : "Add New Menu Item"}
                        </h3>
                        <p className="text-[11px] text-brown/70">
                            {editing
                                ? "See the product's current info and edit what you need"
                                : "Fill in the product details below"}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close add item popup"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-brown/60 transition hover:bg-cream hover:text-ink"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form body — display only for now */}
                <form className="space-y-5 px-6 py-5">
                    {/* Image upload */}
                    <div>
                        <label
                            htmlFor="add-item-image"
                            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown"
                        >
                            Product Image
                        </label>
                        <label
                            htmlFor="add-item-image"
                            className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed
                                       border-ink/15 bg-cream/60 px-4 py-4 transition
                                       hover:border-orange/60 hover:bg-cream"
                        >
                            {editing && item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-10 w-10 shrink-0 rounded-xl border border-ink/10 object-cover"
                                />
                            ) : (
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange/10 text-orange">
                                    <ImagePlus size={18} />
                                </span>
                            )}
                            <span className="min-w-0">
                                <span className="block text-xs font-bold text-ink">
                                    {editing ? "Replace product image" : "Click to upload an image"}
                                </span>
                                <span className="block truncate text-[11px] text-brown/60">
                                    PNG, JPG or WEBP - up to 2MB
                                </span>
                            </span>
                            <input
                                id="add-item-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Name */}
                    <div>
                        <label
                            htmlFor="add-item-name"
                            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown"
                        >
                            Name
                        </label>
                        <input
                            id="add-item-name"
                            type="text"
                            defaultValue={item?.name ?? ""}
                            placeholder="e.g. Classic Smash Burger"
                            className="h-10 w-full rounded-full border border-ink/10 bg-cream px-4 text-xs
                                       font-medium text-ink outline-none transition placeholder:text-brown/50
                                       focus:border-orange focus:bg-white focus:ring-2 focus:ring-orange/30"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="add-item-description"
                            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown"
                        >
                            Description
                        </label>
                        <textarea
                            id="add-item-description"
                            rows={3}
                            defaultValue={item?.description ?? ""}
                            placeholder="Short, tasty description of the dish..."
                            className="w-full resize-none rounded-2xl border border-ink/10 bg-cream p-3.5 text-xs
                                       font-medium text-ink outline-none transition placeholder:text-brown/50
                                       focus:border-orange focus:bg-white focus:ring-2 focus:ring-orange/30"
                        />
                    </div>

                    {/* Category + Price + Stock */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label
                                htmlFor="add-item-category"
                                className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown"
                            >
                                Category
                            </label>
                            <select
                                id="add-item-category"
                                defaultValue={
                                    item?.category != null &&
                                    ["Burgers", "Sides", "Drinks", "Desserts"].includes(item.category)
                                        ? item.category
                                        : "Burgers"
                                }
                                className="h-10 w-full rounded-full border border-ink/10 bg-cream px-3 text-xs
                                           font-medium text-ink outline-none transition focus:border-orange
                                           focus:bg-white focus:ring-2 focus:ring-orange/30"
                            >
                                <option>Burgers</option>
                                <option>Sides</option>
                                <option>Drinks</option>
                                <option>Desserts</option>
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="add-item-price"
                                className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown"
                            >
                                Price
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-brown/70">
                                    $
                                </span>
                                <input
                                    id="add-item-price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    defaultValue={item?.price ?? undefined}
                                    placeholder="0.00"
                                    className="h-10 w-full rounded-full border border-ink/10 bg-cream pl-8 pr-3 text-xs
                                               font-medium text-ink outline-none transition placeholder:text-brown/50
                                               focus:border-orange focus:bg-white focus:ring-2 focus:ring-orange/30"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="add-item-stock"
                                className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown"
                            >
                                Stock
                            </label>
                            <input
                                id="add-item-stock"
                                type="number"
                                min="0"
                                defaultValue={item?.stock ?? undefined}
                                placeholder="0"
                                className="h-10 w-full rounded-full border border-ink/10 bg-cream px-4 text-xs
                                           font-medium text-ink outline-none transition placeholder:text-brown/50
                                           focus:border-orange focus:bg-white focus:ring-2 focus:ring-orange/30"
                            />
                        </div>
                    </div>

                    {/* Variants */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown">
                            Variants
                        </label>
                        <div className="space-y-2">
                            {variantRows.map((row) => (
                                <div
                                    key={row.id}
                                    className="flex flex-wrap items-center gap-2 rounded-2xl border border-ink/10 bg-cream/60 p-2"
                                >
                                    <input
                                        type="text"
                                        value={row.name}
                                        onChange={(e) => updateVariant(row.id, { name: e.target.value })}
                                        aria-label="Variant name"
                                        placeholder="Regular"
                                        className="h-9 min-w-0 flex-1 basis-32 rounded-xl border border-ink/10 bg-white px-2 text-xs font-medium text-ink outline-none transition placeholder:text-brown/50 focus:border-orange focus:bg-white focus:ring-2 focus:ring-orange/30"
                                    />
                                    <div className="relative">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-brown/70">$</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={row.price}
                                            onChange={(e) => updateVariant(row.id, { price: e.target.value })}
                                            aria-label="Variant price"
                                            placeholder="0.00"
                                            className="h-9 w-20 rounded-xl border border-ink/10 bg-white pl-5 pr-2 text-xs font-medium text-ink outline-none transition placeholder:text-brown/50 focus:border-orange focus:bg-white focus:ring-2 focus:ring-orange/30"
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        value={row.calories}
                                        onChange={(e) => updateVariant(row.id, { calories: e.target.value })}
                                        aria-label="Variant calories"
                                        placeholder="kcal"
                                        className="h-9 w-20 rounded-xl border border-ink/10 bg-white px-2 text-xs font-medium text-ink outline-none transition placeholder:text-brown/50 focus:border-orange focus:bg-white focus:ring-2 focus:ring-orange/30"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(row.id)}
                                        aria-label="Remove variant"
                                        className="flex h-9 w-9 items-center justify-center rounded-xl text-brown/60 transition hover:bg-tomato/10 hover:text-tomato"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addVariant}
                                className="flex items-center gap-1.5 rounded-full border border-orange/40 bg-orange/10 px-3 py-1.5 text-[11px] font-bold text-orange-deep transition hover:bg-orange hover:text-cream"
                            >
                                <Plus size={12} strokeWidth={2.8} />
                                Add Variant
                            </button>
                        </div>
                    </div>

                    {/* Flags */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-ink/10 bg-cream/60 px-4 py-3">
                        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-brown">
                            <input
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 accent-orange"
                            />
                            Available
                        </label>
                        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-brown">
                            <input
                                type="checkbox"
                                defaultChecked={item?.popular ?? false}
                                className="h-4 w-4 accent-orange"
                            />
                            Popular
                        </label>
                        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-brown">
                            <input
                                type="checkbox"
                                defaultChecked={item?.spicy ?? false}
                                className="h-4 w-4 accent-orange"
                            />
                            Spicy
                        </label>
                    </div>

                    {/* Popup actions */}
                    <div className="flex items-center justify-end gap-2.5 border-t border-ink/10 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-10 rounded-full border border-ink/10 bg-white px-5 text-xs
                                       font-bold text-brown transition hover:border-ink/30 hover:text-ink"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="flex h-10 items-center gap-1.5 rounded-full bg-orange px-6 text-xs
                                       font-extrabold uppercase tracking-wider text-cream
                                       shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)] transition-all
                                       hover:-translate-y-0.5 hover:bg-orange-deep active:translate-y-0"
                        >
                            <Plus size={15} strokeWidth={2.8} />
                            {editing ? "Save Changes" : "Add Item"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
