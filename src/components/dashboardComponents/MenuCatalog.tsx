'use client';

/* ============================================================================
   STYLE MOD v2 — the stateful wrapper for the Menu Catalog section.

   v2 REMOVES the search + filtering logic on purpose (you implement it —
   steps below). What remains working:
     - pagination (page state, 6 per page, over the FULL item list)
     - the active-category pill highlight (visual only)
     - the "Popular" badge via the `popular` flag in the data

   Undo v2: uncomment the OLD blocks (search state + filter + filtered
   paging + 4-field header call), delete the new lines. The v1 layout of
   this wrapper also exists in git-adjacent form in MenuCatalogHeader.undo.md
   notes; the wrapper itself has no undo file — inline OLD blocks are the
   undo path.
   ============================================================================ */

import { useState } from "react";
import type { StaticImageData } from "next/image";
import MenuCatalogHeader from "./MenuCatalogHeader";
import MenuCatalogGrid, { type MenuItem } from "./MenuCatalogGrid";

/* STYLE MOD v2 — real photo placeholders per category:
     Burgers   -> burger-photo.png (the [CITYPNG] 3000x3000) alternating with
                  hero-image.png
     Drinks    -> strawberry-shake.png (_Pngtree strawberry shake)
     Sides     -> fries-photo.png (_Pngtree french fries)
     Desserts  -> cupcake.svg (SVG icon, placeholder for now)
   Originals still live in the workspace root folder. (undo: delete imports
   + image field values in the data below) */
import burgerPhoto from "@/assets/burger-photo.png";
import heroImage from "@/assets/hero-image.png";
import friesPhoto from "@/assets/fries-photo.png";
import shakePhoto from "@/assets/strawberry-shake.png";
import cupcakeIcon from "@/assets/cupcake.svg";

/* ===================== OLD (v1 — header call shape) =====================
   The header used to receive search too:
   <MenuCatalogHeader
       search={search}
       onSearchChange={handleSearchChange}
       activeCategory={activeCategory}
       onCategoryChange={handleCategoryChange}
   />
========================================================================== */

/* STYLE MOD — mock data (now with per-item artwork + stock counts)
   (undo: delete image/stock fields to go back to the v1 shape) */
const menuItems: MenuItem[] = [
    {
        id: 1,
        name: "Classic Burger",
        description: "Beef, cheddar, lettuce, tomato, house sauce",
        price: 8.99,
        category: "Burgers",
        image: burgerPhoto,
        stock: 86,
        popular: true,
    },
    {
        id: 2,
        name: "Bacon Burger",
        description: "Beef, bacon, cheddar, lettuce, tomato",
        price: 10.99,
        category: "Burgers",
        image: heroImage,
        stock: 86,
    },
    {
        id: 3,
        name: "Mushroom Burger",
        description: "Beef, sautéed mushrooms, cheddar, lettuce",
        price: 9.99,
        category: "Burgers",
        image: burgerPhoto,
        stock: 86,
    },
    {
        id: 4,
        name: "Chicken Burger",
        description: "Crispy chicken, lettuce, tomato, special sauce",
        price: 7.99,
        category: "Burgers",
        image: heroImage,
        stock: 86,
    },
    {
        id: 5,
        name: "Veggie Burger",
        description: "Plant-based patty, lettuce, tomato, vegan sauce",
        price: 8.49,
        category: "Burgers",
        image: burgerPhoto,
        stock: 86,
    },
    {
        id: 6,
        name: "French Fries",
        description: "Crispy golden fries",
        price: 2.99,
        category: "Sides",
        image: friesPhoto,
        stock: 86,
    },
    {
        id: 7,
        name: "Onion Rings",
        description: "Crispy breaded onion rings",
        price: 3.99,
        category: "Sides",
        image: friesPhoto,
        stock: 86,
    },
    {
        id: 8,
        name: "Soft Drink",
        description: "Chilled refreshing drink",
        price: 1.99,
        category: "Drinks",
        image: shakePhoto,
        stock: 86,
    },
    {
        id: 9,
        name: "Chocolate Milkshake",
        description: "Rich and creamy milkshake",
        price: 4.99,
        category: "Desserts",
        image: cupcakeIcon,
        stock: 86,
    },
];

const PAGE_SIZE = 6;

export default function MenuCatalog() {
    const [page, setPage] = useState(1);

    /* STYLE MOD v2 — activeCategory is now VISUAL ONLY: it drives the pill
       highlight. Nothing filters on it yet, by request.
       (undo: this state is shared with the OLD logic below) */
    const [activeCategory, setActiveCategory] = useState("All Items");

    /* ================= HOW TO IMPLEMENT FILTERING + SEARCH =================
       1. Add search state here:
            const [search, setSearch] = useState("");
       2. Filter FIRST by category (pills), THEN by search — combine both:
            const filtered = menuItems.filter((item) => {
                const matchesCategory =
                    activeCategory === "All Items" ||
                    item.category === activeCategory;
                const query = search.trim().toLowerCase();
                const matchesSearch =
                    query === "" ||
                    item.name.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query);
                return matchesCategory && matchesSearch;
            });
       3. Swap the paging source below from menuItems to `filtered`.
       4. Reset to page 1 whenever search/category changes (so users never
          sit on an empty page): setSearch/setActiveCategory handlers also
          call setPage(1).
       5. Header plumbing: pass search={search} onSearchChange={setSearch}
          to <MenuCatalogHeader> and re-add those props to its type Props
          (the OLD block in MenuCatalogHeader.tsx shows the exact shape).
       ==================================================================== */

    /* ==================== OLD (v1 — filter + handlers) ====================

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        return menuItems.filter((item) => {
            const matchesCategory =
                activeCategory === "All Items" || item.category === activeCategory;
            const matchesSearch =
                query === "" ||
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });
    }, [search, activeCategory]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    ======================================================================== */

    /* STYLE MOD v2 — category handler now only sets the visual highlight.
       (undo: uncomment this v1 body — it also reset pagination)
       function handleCategoryChange(category: string) {
           setActiveCategory(category);
       }
       v1 body was:
           setActiveCategory(category);
           setPage(1);
    */
    function handleCategoryChange(category: string) {
        setActiveCategory(category);
    }

    /* STYLE MOD v2 — pagination now slices the FULL list, because `filtered`
       no longer exists. (undo: point these two lines back at `filtered`
       instead of menuItems — the OLD lines are in the comment above) */
    const totalPages = Math.max(1, Math.ceil(menuItems.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const paged = menuItems.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE,
    );

    /* ============ OLD (v1 — filtered paging, for reference) ============
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
    ==================================================================== */

    return (
        // STYLE MOD — horizontal padding matches the dashboard navbar's rhythm
        // (undo: delete section's horizontal padding classes)
        <section className="space-y-7 px-6 lg:px-10">
            <MenuCatalogHeader
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
            />
            {/* OLD (v1 — header also received the search props):
                    search={search}
                    onSearchChange={handleSearchChange}
            */}
            <MenuCatalogGrid
                items={paged}
                page={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </section>
    );
}
