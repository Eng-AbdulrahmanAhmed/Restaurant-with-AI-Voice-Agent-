
"use client";

/* ============================================================================
   STYLE MOD v2 — redesigned to match the new reference image:

   1. Badge, heading and description are CENTERED; heading is two-tone
      ("Manage Our" charcoal + "Menu Items" orange).
      (undo: OLD centered-block commented inline further down + full v1 in
      MenuCatalogHeader.undo.md)
   2. Search input + category pills now sit in ONE white rounded bar.
      (undo: OLD split row commented inline further down)
   3. Filter icons all render at 16px — LayoutGrid stepped 17 -> 16 so every
      icon is the exact same size.
      (undo: width={16} -> {17} on the lucide icon, and the OLD pill row)
   4. SEARCH WIRING REMOVED ON PURPOSE — you implement it. The steps are
      documented in the comment right above the input. Filtering was also
      removed from MenuCatalog.tsx (steps there too).
      (undo: the OLD wired version of every removed piece is kept as a
      commented block — uncomment it, delete the new one, done)
   ============================================================================ */

import { Utensils, Search, LayoutGrid, Hamburger, Salad, CupSoda, IceCreamBowl } from "lucide-react";
import Image from "next/image";
import type { StaticImageData } from "next/image";

/* STYLE MOD — category artwork + the navbar-aligned lucide icon
    (undo: delete imports + new categories array, restore old string array) */
import burgerIcon from "@/assets/burger.svg";
import friesIcon from "@/assets/fries.svg";
import cupIcon from "@/assets/cup.svg";
import cupcakeIcon from "@/assets/cupcake.svg";

type Category = {
  label: string;
  icon?: StaticImageData;
  lucideIcon?: typeof LayoutGrid;
};

const categories: Category[] = [
  { label: "All Items", lucideIcon: LayoutGrid }, // STYLE MOD — same icon as navbar "Menu Items"
  { label: "Burgers", lucideIcon: Hamburger },
  { label: "Sides", lucideIcon: Salad },
  { label: "Drinks", lucideIcon: CupSoda },
  { label: "Desserts", lucideIcon: IceCreamBowl },
];

/* ===================== OLD (v1 — with search wiring) =====================
type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
};

export default function MenuCatalogHeader({
  search,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}: Props) {
========================================================================== */

/* STYLE MOD — search/onSearchChange props dropped while the search logic is
   unwired; category props stay so the pills still highlight. Add the two
   fields back to type Props when you implement search (step 2 below).
   (undo: uncomment the OLD block above) */
type Props = {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
};

export default function MenuCatalogHeader({
  activeCategory,
  onCategoryChange,
}: Props) {
  return (
    // STYLE MOD v2 — section is the same, spacing widened to space-y-8
    // (undo: space-y-8 -> space-y-6)
    <section className="space-y-8">
      {/* ============== OLD (v1 — left-aligned header) ==============
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F97316] px-4 py-2 text-xs font-bold tracking-wide text-white">
          <Utensils size={15} strokeWidth={2.5} />
          <span>Menu Catalog Database</span>
        </div>

        <h1 className="font-display text-4xl font-black tracking-tight text-ink">
          Manage Our Menu Items
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brown">
          Add new recipes, modify prices, update availability, or mark
          customer fan favorites live on the website.
        </p>
      </div>
      ============================================================ */}

      {/* STYLE MOD v2 — badge, heading, description all centered like the
          reference. Badge is now a soft orange-tint pill instead of solid
          orange. (undo: delete this div, uncomment the OLD block above) */}
      <div className="flex flex-col items-center space-y-3 text-center">
        <span
          className="inline-flex items-center gap-2 rounded-full bg-orange/10 px-4 py-2
                     text-xs font-bold tracking-wide text-orange-deep"
        >
          <Utensils size={15} strokeWidth={2.5} />
          Menu Catalog Database
        </span>

        <h1 className="font-display text-4xl font-black tracking-tight text-ink">
          Manage Our <span className="italic text-orange">Menu Items</span>
        </h1>

        <p className="max-w-2xl text-sm leading-relaxed text-brown">
          Add new recipes, modify prices, update availability, or mark
          customer fan favorites live on the website.
        </p>
      </div>

      {/* ===================== OLD (v1 — split row) =====================
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]"
          />
          <input
            type="text"
            placeholder="Search menu items..."
            className="h-11 w-full rounded-xl border border-[#EDE7DD] bg-white pl-10 pr-4 text-sm text-[#292524] outline-none transition focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map(({ label, icon, lucideIcon }) => (
            <button
              key={label}
              onClick={() => onCategoryChange(label)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                activeCategory === label
                  ? "bg-ink text-cream shadow-[0_8px_18px_-8px_rgba(36,23,8,0.6)]"
                  : "border border-[#EDE7DD] bg-white text-[#78716C] hover:border-orange-200 hover:text-[#F97316]"
              }`}
            >
              {lucideIcon ? (
                (() => {
                  const Icon = lucideIcon;
                  return <Icon size={17} strokeWidth={2} />;
                })()
              ) : (
                <Image src={icon as StaticImageData} alt="" width={16} height={16} />
              )}
              {label}
            </button>
          ))}
        </div>
      </div>
      ================================================================= */}

      {/* STYLE MOD v2 — search + filters share one white rounded bar, pills
          left / search right, exactly like the reference. Borderless pills;
          only the active one gets the orange fill. All icons 16px.
          (undo: delete this div, uncomment the OLD split row above) */}
      <div
        className="flex flex-col gap-4 rounded-[1.75rem] border border-ink/10 bg-white p-2.5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)]
                   lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map(({ label, icon, lucideIcon }) => (
            <button
              key={label}
              onClick={() => onCategoryChange(label)}
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold
                          transition-all duration-200 ${
                            activeCategory === label
                              ? "bg-ink text-cream shadow-[0_8px_18px_-8px_rgba(36,23,8,0.6)]"
                              : "text-ink/70 hover:bg-orange/10 hover:text-orange"
                          }`}
            >
              {/* STYLE MOD v2 — every icon renders in a 16px box: SVG images
                  at width/height 16, lucide at size 16 (was 17).
                  (undo: size={16} -> size={17}) */}
              {lucideIcon ? (
                (() => {
                  const Icon = lucideIcon;
                  return <Icon size={22} height={22} strokeWidth={2} />;
                })()
              ) : (
                /* STYLE MOD — artwork icons have their orange baked into the SVG
                    file, so on the orange active pill they vanish. brightness-0
                    invert flattens the image to pure white on the active pill —
                    same behavior as lucide icons, which already go white via
                    currentColor. Sizes untouched. (undo: delete className) */
                <Image
                  src={icon as StaticImageData}
                  alt=""
                  width={22}
                  height={22}
                  className={`h-5 w-5 ${activeCategory === label ? "brightness-0 invert" : ""}`}
                />
              )}
              {label}
            </button>
          ))}
        </div>

        {/* ================= SEARCH (logic unwired — steps below) =================
           HOW TO IMPLEMENT LIVE SEARCH:
           1. In MenuCatalog.tsx add state:
                const [search, setSearch] = useState("");
           2. Pass it down:
                <MenuCatalogHeader search={search} onSearchChange={setSearch} ... />
              and re-add to type Props (the OLD block above shows the shape).
           3. Wire this input — replace it with the OLD version right below.
           4. Filter the items in MenuCatalog by name/description (trim +
              lowercase). The OLD v1 filter, commented in MenuCatalog.tsx,
              already does exactly this when combined with the old category
              filter.
           ==================================================================== */}
        <div className="relative w-full shrink-0 lg:w-72">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-brown/50"
          />
          <input
            type="text"
            placeholder="Search dishes..."
            className="h-10 w-full rounded-full border border-ink/10 bg-cream pl-10 pr-4
                       text-sm text-ink placeholder:text-brown/50 outline-none transition
                       focus:border-orange focus:bg-white focus:ring-2 focus:ring-orange/30"
          />
          {/* ============= OLD (v1 — wired search input) =============
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search menu items..."
            className="h-11 w-full rounded-xl border border-[#EDE7DD] bg-white pl-10 pr-4 text-sm text-[#292524] outline-none transition focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
          />
          ========================================================== */}
        </div>

      </div>
    </section>
  );
}