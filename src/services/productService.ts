import { createClient } from "@/lib/supabase/client";

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