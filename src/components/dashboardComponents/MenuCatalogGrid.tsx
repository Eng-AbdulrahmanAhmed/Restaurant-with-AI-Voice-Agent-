'use client';

/* ============================================================================
   STYLE MOD v2 — card redesign to match the new reference image:

   Card structure (top to bottom):
     1. Row: category chip (soft orange pill, uppercase) + "Popular" badge
        (solid orange pill with star) — replaced the floating "Most Popular"
        ribbon from v1.
     2. Row: square photo (real PNGs now, see data) + name / description /
        big orange price.
     3. Divider.
     4. Row: stock chip "N Item" + fan-favorite star toggle (left) and
        edit / delete icon buttons (right) — replaced the v1 "Edit" pill.

   Every previous piece is kept as a commented OLD block so undoing is:
   uncomment the OLD block, delete the new one.

   Undo for the whole file: this file didn't exist before the catalog build;
   also restore dashboard/page.tsx + MenuCatalog.tsx (undo notes there).
   ============================================================================ */

import Image from "next/image";
import type { StaticImageData } from "next/image";
import {
  Pencil,
  ChevronRight,
  Star,
  Trash2,
  Ban,
} from "lucide-react";

/* ============ OLD (v1 — ribbon artwork, unused in v2) ============
import starIcon from "@/assets/star.svg";
================================================================== */

/* ===================== OLD (v1 — category artwork) =====================
import burgerIcon from "@/assets/burger.svg";
import friesIcon from "@/assets/fries.svg";
import cupIcon from "@/assets/cup.svg";
import cupcakeIcon from "@/assets/cupcake.svg";
======================================================================== */

/* STYLE MOD v2 — real photo placeholders (burger CITYPNG + hero-image for
   Burgers, shake for Drinks, fries photo for Sides, SVG icons for Desserts)
   (undo: delete imports + per-item image field, uncomment OLD artwork) */
import burgerPhoto from "@/assets/burger-photo.png";
import heroImage from "@/assets/hero-image.png";
import friesPhoto from "@/assets/fries-photo.png";
import shakePhoto from "@/assets/strawberry-shake.png";
import cupcakeIcon from "@/assets/cupcake.svg";

/* ============ OLD (v1 — item shape + artwork map) ============
export type MenuItem = {
    id: number;
    name: string;
    description: string;
    price: number;
    category: "Burgers" | "Sides" | "Drinks" | "Desserts";
    popular?: boolean;
};

const categoryImage: Record<MenuItem["category"], StaticImageData> = {
    Burgers: burgerIcon,
    Sides: friesIcon,
    Drinks: cupIcon,
    Desserts: cupcakeIcon,
};
=============================================================== */

/* STYLE MOD v2 — item shape now carries its own artwork + stock count for the
   bottom toolbar chip. (undo: uncomment OLD shape above and delete these two
   fields) */
export type MenuItem = {
    id: number;
    name: string;
    description: string;
    price: number;
    category: "Burgers" | "Sides" | "Drinks" | "Desserts";
    image: StaticImageData;
    stock: number;
    popular?: boolean;
};

type Props = {
    items: MenuItem[];
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function MenuCatalogGrid({
    items,
    page,
    totalPages,
    onPageChange,
}: Props) {
    return (
        <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                    /* ================= OLD (v1 card) =================
                    <article
                        key={item.id}
                        className="relative flex items-center gap-4 rounded-xl border border-[#F0E8DE] bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                        {item.popular && (
                            <span
                                className="absolute -top-3 left-4 z-10 inline-flex items-center gap-1.5
                                           rounded-full bg-orange px-3 py-1 text-[11px] font-bold text-cream shadow-sm"
                            >
                                <Image src={starIcon} alt="" width={12} height={12} />
                                Most Popular
                            </span>
                        )}

                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-cream">
                            <Image
                                src={categoryImage[item.category]}
                                alt={item.name}
                                width={56}
                                height={56}
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-bold text-[#292524]">
                                {item.name}
                            </h3>
                            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[#8B8178]">
                                {item.description}
                            </p>

                            <div className="mt-2 flex items-end justify-between">
                                <p className="text-sm font-extrabold text-[#F97316]">
                                    ${item.price.toFixed(2)}
                                </p>
                                <button
                                    type="button"
                                    title={`Edit ${item.name}`}
                                    className="flex h-8 items-center gap-1.5 rounded-full bg-orange px-3.5
                                               text-[11px] font-semibold text-cream transition-all duration-200
                                               hover:bg-deep-burnt focus-visible:outline-2
                                               focus-visible:outline-offset-2 focus-visible:outline-orange"
                                >
                                    <Pencil size={13} strokeWidth={2.5} />
                                    Edit
                                </button>
                            </div>
                        </div>
                    </article>
                    ================================================== */

                    /* STYLE MOD v2 — card per the reference: chip + badge row,
                        photo row with big price, divider, manage toolbar */
                    <article
                        key={item.id}
                        className="flex flex-col rounded-2xl border border-[#F0E8DE] bg-white p-5 shadow-sm
                                   transition-shadow hover:shadow-md"
                    >
                        {/* STYLE MOD v2 — category chip (left) + Popular badge (right)
                            (undo: delete this div) */}
                        <div className="flex items-center justify-between">
                            <span
                                className="rounded-full bg-orange/10 px-3 py-1 text-[10px] font-extrabold
                                           uppercase tracking-wider text-[#F97316]"
                            >
                                {item.category}
                            </span>
                            {item.popular && (
                                <span
                                    className="inline-flex items-center gap-1 rounded-full bg-[#F97316]
                                               px-3 py-1 text-[11px] font-bold text-white"
                                >
                                    <Star size={12} fill="currentColor" strokeWidth={0} />
                                    Popular
                                </span>
                            )}
                        </div>

                        {/* STYLE MOD v2 — square photo + name/description/price column,
                            big orange price like the reference (undo: delete div) */}
                        <div className="mt-4 flex items-center gap-4">
                            <div
                                className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={96}
                                    height={96}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="truncate text-lg font-extrabold text-[#292524]">
                                    {item.name}
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-[#8B8178]">
                                    {item.description}
                                </p>
                                <p className="mt-2 text-xl font-extrabold text-[#F97316]">
                                    ${item.price.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* STYLE MOD v2 — divider between the item info and the
                            manage toolbar (undo: delete) */}
                        <hr className="my-4 border-[#F0E8DE]/70" />

                        {/* STYLE MOD v2 — manage toolbar: stock chip + favorite star
                            toggle left, edit/delete icon buttons right
                            (undo: delete div) */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 ">
                                <span
                                    className="group inline-flex items-center gap-1.5 rounded-full bg-[#F5F5F4]
                                               px-3 py-1.5 text-[11px] font-semibold text-[#78716C]
                                               hover:bg-red-50 group-hover:text-red-600"
                                >
                                    <Ban size={13} strokeWidth={2.5} className="group-hover:stroke-red-600 "/>
                                    <span className="group-hover:text-red-600">{item.stock} Item</span>
                                </span>

                                {/* STYLE MOD — favorite star: filled amber for fan
                                    favorites, muted otherwise; click logic comes later
                                    (undo: delete button) */}
                                <button
                                    type="button"
                                    title="Mark as fan favorite"
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg
                                                transition-colors duration-200 ${
                                                    item.popular
                                                        ? "bg-amber-100 text-amber-500 hover:bg-amber-200"
                                                        : "bg-stone-100 text-stone-300 hover:text-stone-400"
                                                }`}
                                >
                                    <Star size={16} fill="currentColor" strokeWidth={0} />
                                </button>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    title={`Edit ${item.name}`}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg
                                               text-stone-400 transition-colors duration-200
                                               hover:bg-orange/10 hover:text-[#F97316]"
                                >
                                    <Pencil size={16} strokeWidth={2} />
                                </button>
                                <button
                                    type="button"
                                    title={`Delete ${item.name}`}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg
                                               text-stone-400 transition-colors duration-200
                                               hover:bg-red-50 hover:text-red-500"
                                >
                                    <Trash2 size={16} strokeWidth={2} />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}

                {items.length === 0 && (
                    <p
                        className="col-span-full rounded-xl border border-dashed border-[#EDE7DD] bg-white/60
                                   py-10 text-center text-sm text-[#A8A29E]"
                    >
                        No menu items match your search.
                    </p>
                )}
            </div>

            {/* STYLE MOD — pagination row, wired to real pages; hidden entirely
                when there's only one page. (undo: delete this div) */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => onPageChange(p)}
                            aria-current={p === page ? "page" : undefined}
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold
                                        transition-all duration-200 ${
                                            p === page
                                                ? "bg-orange text-white shadow-sm"
                                                : "border border-[#EDE7DD] bg-white text-[#78716C] hover:text-[#F97316]"
                                        }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        type="button"
                        title="Next page"
                        disabled={page === totalPages}
                        onClick={() => onPageChange(page + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EDE7DD]
                                   bg-white text-[#78716C] transition-all duration-200 hover:text-[#F97316]
                                   disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronRight size={15} />
                    </button>
                </div>
            )}
        </div>
    );
}
