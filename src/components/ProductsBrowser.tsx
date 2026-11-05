"use client";

import { MAX_PRODUCT_PER_PAGE } from "@/Consts";
import { getProducts } from "@/services/productService";
import MenuCatalogGrid from "@/components/dashboardComponents/MenuCatalogGrid";
import { useState, useEffect } from "react";
import { type MenuItem } from "@/types/types";
import MenuCatalogHeader from "@/components/dashboardComponents/MenuCatalogHeader";
import PaginationControls from "./pagination/paginationControls";

export default function ProductsBrowser({ page }: { page: number }) {
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  function handleCategoryChange(category: string) {
    setActiveCategory(category);
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / MAX_PRODUCT_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        const { products, totalCount } = await getProducts({
          page,
          MAX_PRODUCT_PER_PAGE,
        });
        setTotalCount(totalCount);
        setProducts(products);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Could not load menu items. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [page]);

  return (
    <section className="space-y-7 px-6 pt-10 pb-12 lg:px-10">
      <MenuCatalogHeader
      // activeCategory={activeCategory}
      // onCategoryChange={handleCategoryChange}
      />

      {loading ? (
        <p className="py-10 text-center text-sm text-brown">
          Loading menu items...
        </p>
      ) : error ? (
        <p className="py-10 text-center text-sm text-tomato">{error}</p>
      ) : (
        <MenuCatalogGrid menuItems={products} />
      )}

      <PaginationControls page={safePage} totalPages={totalPages} />
    </section>
  );
}