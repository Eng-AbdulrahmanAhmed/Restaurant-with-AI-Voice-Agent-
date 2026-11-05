This file documents the exact pre-STYLE-MOD version of
`MenuCatalogHeader.tsx` (kept separately so the component file itself stays
clean). To undo all edits, paste this over the whole file:

```tsx
"use client";

import { useState } from "react";
import { Utensils, Search } from "lucide-react";

const categories = [
  "All Items",
  "Burgers",
  "Sides",
  "Drinks",
  "Desserts",
];

export default function MenuCatalogHeader() {
  const [activeCategory, setActiveCategory] = useState("All Items");

  return (
    <section className="space-y-6">
      {/* Heading */}
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F97316] px-4 py-2 text-xs font-bold tracking-wide text-white">
          <Utensils size={15} strokeWidth={2.5} />
          <span>Menu Catalog Database</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-[#292524]">
          Manage Our Menu Items
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8B8178]">
          Add new recipes, modify prices, update availability, or mark
          customer fan favorites live on the website.
        </p>
      </div>

      {/* Search and Filters */}
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
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                activeCategory === category
                  ? "bg-[#F97316] text-white shadow-sm"
                  : "border border-[#EDE7DD] bg-white text-[#78716C] hover:border-orange-200 hover:text-[#F97316]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
```
