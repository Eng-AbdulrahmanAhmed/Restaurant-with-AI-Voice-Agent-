import { createClient } from "@/lib/supabase/client";

export async function getProducts({
    page = 1,
    MAX_PRODUCT_PER_PAGE = 6
}: {
    page?: number;
    MAX_PRODUCT_PER_PAGE?: number;
} = {}) {
    const supabase = createClient();

    // Calculate LIMIT and OFFSET
    const from = (page - 1) * MAX_PRODUCT_PER_PAGE;
    const to = from + MAX_PRODUCT_PER_PAGE - 1;

    const { data, count, error } = await supabase
        .from("products")
        .select(`
            id,
            name,
            description,
            image_url,
            is_available,
            categories (
                name
            ),
            product_variants (
                price,
                is_available
            )
        `, { count: "exact" })
        .eq("is_available", true)
        .range(from, to);

    if (error) {
        throw error;
    }

    const products = data.flatMap((product) => {
        const availableVariant = product.product_variants.find(
            (variant) => variant.is_available
        );

        if (!availableVariant) return [];

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
            price: Number(availableVariant.price),
            category:
                (product.categories as unknown as { name: string } | null)?.name
                ?? "Uncategorized",
            image: imageUrl,
        }];
    });

    return {
        products,
        totalCount: count ?? 0,
    };
}