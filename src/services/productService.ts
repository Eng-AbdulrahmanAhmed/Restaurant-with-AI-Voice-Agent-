import { createClient } from "@/lib/supabase/client";

/** Shown until (or if) the categories table cannot be read. */
export const DEFAULT_CATEGORIES = ["Burgers", "Sides", "Drinks", "Desserts"];

/** Canonical display order; any other category is appended alphabetically. */
const CORE_CATEGORY_ORDER = DEFAULT_CATEGORIES;

/**
 * Every category that exists in the database, core ones first.
 * Keeps the dashboard filters and the item form in sync with the table
 * instead of a hard-coded list that drifts (e.g. Chicken, Pizza).
 */
export async function getCategories(): Promise<string[]> {
    const supabase = createClient();

    const { data, error } = await supabase.from("categories").select("name");

    if (error) {
        throw error;
    }

    const names = [
        ...new Set(
            (data ?? [])
                .map((row) => (row.name ?? "").trim())
                .filter(Boolean)
        ),
    ];

    const core = CORE_CATEGORY_ORDER.filter((name) => names.includes(name));
    const extra = names
        .filter((name) => !CORE_CATEGORY_ORDER.includes(name))
        .sort((a, b) => a.localeCompare(b));

    return [...core, ...extra];
}

export async function getProducts({
    page = 1,
    MAX_PRODUCT_PER_PAGE = 6,
    category,
    search
}: {
    page?: number;
    MAX_PRODUCT_PER_PAGE?: number;
    category?: string,
    search?: string,
} = {}) {
    const supabase = createClient();


    

    // Calculate LIMIT and OFFSET
    const from = (page - 1) * MAX_PRODUCT_PER_PAGE;
    const to = from + MAX_PRODUCT_PER_PAGE - 1;

   let query = supabase
    .from("products")
    .select(`
        id,
        name,
        description,
        image_url,
        is_available,
        preparation_time,
        categories!inner (
            name
        ),
        product_variants (
            id,
            name,
            price,
            is_available,
            calories
        )
    `, { count: "exact" })
    .eq("is_available", true);

    // Search by product name OR description (case-insensitive)
    if (search?.trim()) {
        const term = search.trim();

        query = query.or(
            `name.ilike.%${term}%,description.ilike.%${term}%`
        );
    }

    // Filter by category
    if (category && category !== "All Items") {
        query = query.eq("categories.name", category);
    }

    // Apply pagination
    const { data, count, error } = await query.range(from, to);

    if (error) {
        throw error;
    }

    const products = data.flatMap((product) => {
        const variants = (product.product_variants ?? [])
            .filter((variant) => variant.is_available)
            .map((variant) => ({
                id: String(variant.id),
                name: variant.name ?? "Regular",
                price: Number(variant.price),
                calories:
                    variant.calories != null ? Number(variant.calories) : null,
            }))
            .sort((a, b) => a.price - b.price);

        if (!variants.length) return [];

        const cheapest = variants[0];

        // Handle both full URLs and relative Storage paths.
        const storedImage = product.image_url?.trim();

        const imageUrl = storedImage
            ? storedImage.startsWith("http")
                ? storedImage
                : supabase.storage
                    .from("product-images")
                    .getPublicUrl(storedImage).data.publicUrl
            : null;

        return [{
            id: product.id,
            name: product.name,
            description: product.description,
            price: cheapest.price,
            category:
                (product.categories as unknown as { name: string } | null)?.name
                ?? "Uncategorized",
            image: imageUrl,
            variants,
        }];
    });

    return {
        products,
        totalCount: count ?? 0,
    };
}