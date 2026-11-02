
// import { createClient } from "@/lib/supabase/client";





import { createClient } from "@/lib/supabase/client";

export async function getProducts() {
    const supabase = createClient();

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
        .eq("is_available", true);

    if (error) {
        throw error;
    }

    const products = data.flatMap((product) => {
        const availableVariant = product.product_variants.find(
            (variant) => variant.is_available
        );

        if (!availableVariant) return [];

        const imageUrl = product.image_url
            ? supabase.storage
                .from("product-images")
                .getPublicUrl(product.image_url).data.publicUrl
            : null;

        return [{
            id: product.id,
            name: product.name,
            description: product.description,
            price: Number(availableVariant.price),
            category: (product.categories as unknown as { name: string } | null)?.name ?? "Uncategorized",
            image: imageUrl,
        }];
    });

    return {
        products,
        totalCount: count ?? 0,
    };
}























// export async function getProducts() {
//     const supabase = createClient();
    
//     const { data, error } = await supabase
//         .from("products")
//         .select(`
//             id,
//             name,
//             description,
//             image_url,
//             is_available,
//             categories (
//                 name
//             ),
//             product_variants (
//                 price,
//                 is_available
//             )
//         `)
//         .eq("is_available", true);

//     if (error) {
//         throw error;
//     }

//     return data.flatMap((product) => {
//         // Find the first available variant.
//         const availableVariant = product.product_variants.find(
//             (variant) => variant.is_available
//         );

//         // Don't display products without an available variant.
//         if (!availableVariant) {
//             return [];
//         }

//         // Convert the stored Storage path into a public image URL.
//         const imageUrl = product.image_url
//             ? supabase.storage
//                 .from("product-images")
//                 .getPublicUrl(product.image_url).data.publicUrl
//             : null;

//         return [{
//             id: product.id,
//             name: product.name,
//             description: product.description,
//             price: Number(availableVariant.price),
//             category: (product.categories as unknown as { name: string } | null)?.name ?? "Uncategorized",
//             image: imageUrl,
//         }];
//     });
// }
