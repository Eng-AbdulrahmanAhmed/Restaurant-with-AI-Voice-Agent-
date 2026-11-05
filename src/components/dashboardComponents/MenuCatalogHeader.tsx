
"use client";


import { Utensils, Search, LayoutGrid, Hamburger, Salad, CupSoda, IceCreamBowl } from "lucide-react";
import Image from "next/image";
import type { StaticImageData } from "next/image";

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

type Props = {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
};

export default function MenuCatalogHeader() {
  // const activeCategory = 
  return (

    <section className="space-y-8">
      
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
      <div
        className="flex flex-col gap-4 rounded-[1.75rem] border border-ink/10 bg-white p-2.5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)]
                   lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map(({ label, icon, lucideIcon }) => (
            <button
              key={label}
              // onClick={() => onCategoryChange(label)}
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold
                          transition-all duration-200 `}
            >
              






              {lucideIcon ? (
                (() => {
                  const Icon = lucideIcon;
                  return <Icon size={22} height={22} strokeWidth={2} />;
                })()
              ) : (
                <Image
                  src={icon as StaticImageData}
                  alt=""
                  width={22}
                  height={22}
                  className={`h-5 w-5 `}
                />
              )}
              {label}
            </button>
          ))}
        </div>
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
          
        </div>

      </div>
    </section>
  );
}



// ${
//                             activeCategory === label
//                               ? "bg-ink text-cream shadow-[0_8px_18px_-8px_rgba(36,23,8,0.6)]"
//                               : "text-ink/70 hover:bg-orange/10 hover:text-orange"
//                           }