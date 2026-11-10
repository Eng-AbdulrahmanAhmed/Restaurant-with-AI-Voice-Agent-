'use client';

/* ADD ITEM / EDIT ITEM CONTEXT — shared popup state.
   The popup itself is still styling-only (no create/update product logic).
   The navbar opens it in ADD mode; each product card opens it in EDIT mode
   with the current item's values pre-filled. */

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import AddItemModal from "./AddItemModal";
import type { MenuItem } from "@/types/types";
import { DEFAULT_CATEGORIES, getCategories } from "@/services/productService";

type AddItemContextValue = {
    openAddItem: () => void;
    openEditItem: (item: MenuItem) => void;
    close: () => void;
};

const AddItemContext = createContext<AddItemContextValue>({
    openAddItem: () => {},
    openEditItem: () => {},
    close: () => {},
});

export function useAddItem() {
    return useContext(AddItemContext);
}

export default function AddItemProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    // Current item in EDIT mode; null when the popup is in ADD mode.
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    // Every category in the database, so the form can offer all of them.
    const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

    useEffect(() => {
        let active = true;

        getCategories()
            .then((names) => {
                if (active && names.length) setCategories(names);
            })
            .catch((error) => console.error("Could not load categories:", error));

        return () => {
            active = false;
        };
    }, []);

    const value: AddItemContextValue = {
        openAddItem: () => {
            setEditingItem(null);
            setOpen(true);
        },
        openEditItem: (item) => {
            setEditingItem(item);
            setOpen(true);
        },
        close: () => setOpen(false),
    };

    return (
        <AddItemContext.Provider value={value}>
            {children}
            <AddItemModal
                /* key forces a fresh mount per target so pre-filled
                   values always match the currently edited product */
                key={editingItem?.id ?? "add"}
                open={open}
                item={editingItem}
                categories={categories}
                onClose={() => setOpen(false)}
            />
        </AddItemContext.Provider>
    );
}
