import { createClient } from "@/lib/supabase/client";
import type { MenuProduct } from "@/types/types";
import burgerPhoto from "@/assets/burger-photo.png";
import heroImage from "@/assets/hero-image.png";
import friesPhoto from "@/assets/fries-photo.png";
import strawberryShake from "@/assets/strawberry-shake.png";
import cupcakeArt from "@/assets/cupcake.svg";

/* Fallback artwork when the DB doesn't return a product image.
   Matches the previous hardcoded resolver exactly. */
const BURGER_ART = [burgerPhoto, heroImage];
const ART_BY_CATEGORY: Record<MenuProduct["category"], string> = {
  Burgers: burgerPhoto.src,
  Sides: friesPhoto.src,
  Drinks: strawberryShake.src,
  Desserts: cupcakeArt.src,
};

function getBurgerArt(index: number) {
  return BURGER_ART[index % BURGER_ART.length].src;
}

function firstKnown(variants: { calories: number | null }[]) {
  const found = variants.find((variant) => variant.calories != null);
  return found?.calories ?? null;
}

function countIsTrue(value?: boolean | null) {
  return Boolean(value);
}

export async function getPublicMenuProducts(): Promise<MenuProduct[]> {
  const supabase = createClient();

  const { data, error } = await supabase
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
    `)
    .eq("is_available", true)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data.flatMap((product) => {
    const rawVariants = (product.product_variants ?? [])
      .filter((variant) => variant.is_available)
      .map((variant) => ({
        id: String(variant.id),
        name: variant.name ?? "Regular",
        price: Number(variant.price),
        calories: variant.calories != null ? Number(variant.calories) : null,
      }))
      .sort((a, b) => a.price - b.price);

    if (!rawVariants.length) return [];

    const primary = rawVariants.find((v) => v.calories != null) ?? rawVariants[0];

    const rawCategory = (product.categories as unknown as { name: string } | null)?.name ?? "Uncategorized";
    const normalizedCategory =
      rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1).toLowerCase();
    const category = (["Burgers", "Sides", "Drinks", "Desserts"].includes(normalizedCategory)
      ? normalizedCategory
      : "Burgers") as MenuProduct["category"];

    const storedImage = (product.image_url || "").trim();
    const imageUrl = storedImage
      ? storedImage.startsWith("http")
        ? storedImage
        : supabase.storage
            .from("product-images")
            .getPublicUrl(storedImage).data.publicUrl
      : category === "Burgers"
        ? getBurgerArt(Number(product.id.replace(/\D/g, "").slice(0, 1)) || 0)
        : ART_BY_CATEGORY[category];

    const prepMinutes =
      typeof product.preparation_time === "number" ? product.preparation_time : null;
    const prepTime = prepMinutes !== null ? `${prepMinutes} min` : "10-12 min";
    const calories = firstKnown(rawVariants);
    const caloriesLabel = calories !== null ? `${calories} kcal` : "—";
    const lowerName = (product.name || "").toLowerCase();

    return [{
      id: String(product.id),
      name: product.name,
      category,
      description: product.description ?? "No description available.",
      price: primary.price,
      image: imageUrl,
      calories: caloriesLabel,
      prepTime,
      variants: rawVariants,
      popular: countIsTrue((product as any).is_popular),
      spicy: countIsTrue((product as any).is_spicy) || lowerName.includes("spicy") || lowerName.includes("chipotle") || lowerName.includes("buffalo"),
      aliases: lowerName.split(/\s+/).filter(Boolean),
      ingredients: lowerName.split(/\s+/).filter(Boolean),
    }];
  });
}
