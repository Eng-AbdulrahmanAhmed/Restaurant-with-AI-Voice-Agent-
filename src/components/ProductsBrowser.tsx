"use client";

import { MAX_PRODUCT_PER_PAGE } from "@/Consts";
import { getProducts } from "@/services/productService";
import MenuCatalogGrid from "@/components/menuComponents/MenuCatalogGrid";
import { useState, useEffect } from "react";
import { type MenuItem } from "@/types/types";
import MenuCatalogHeader from "@/components/menuComponents/MenuCatalogHeader";
import PaginationControls from "./pagination/paginationControls";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function ProductsBrowser({ page , search , category }: { page: number , search:string , category:string }) {
  // const [activeCategory, setActiveCategory] = useState("All Items");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchInput, setSearchInput] = useState(search || "");
  
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleCategoryChange(category: string) {

    const params = new URLSearchParams(searchParams.toString());

    if (category === "All Items") {
        params.delete("category");
    } else {
        params.set("category", category);
    }

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  } 

  // const [searchInput, setSearchInput] = useState(search || "");

useEffect(() => {
  const timeout = setTimeout(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchInput.trim()) {
      params.set("search", searchInput.trim());
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  return () => clearTimeout(timeout);
}, [searchInput]);


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
          search,
          category
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
  }, [page , category , search]);

  return (
    <section className="space-y-7 px-6 pt-10 pb-12 lg:px-10">
      <MenuCatalogHeader
        activeCategory={category || "All Items"}
        onCategoryChange={handleCategoryChange}
        search={searchInput}
        onSearchChange={setSearchInput} 
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: MAX_PRODUCT_PER_PAGE }).map((_, index) => (
            <div
              key={index}
              aria-hidden="true"
              className="flex flex-col rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)]"
            >
              {/* Badges */}
              <div className="flex items-center justify-between gap-2">
                <div className="h-6 w-20 animate-pulse rounded-full bg-cream-deep" />
                <div className="h-6 w-16 animate-pulse rounded-full bg-cream-deep" />
              </div>

              {/* Image + text */}
              <div className="mt-4 flex items-center gap-4">
                <div className="h-24 w-24 shrink-0 animate-pulse rounded-xl bg-cream-deep" />
                <div className="min-w-0 flex-1">
                  <div className="h-5 w-2/3 animate-pulse rounded-md bg-cream-deep" />
                  <div className="mt-1 h-3 w-full animate-pulse rounded-md bg-cream-deep" />
                  <div className="mt-1 h-3 w-5/6 animate-pulse rounded-md bg-cream-deep" />
                  <div className="mt-2 h-6 w-14 animate-pulse rounded-md bg-cream-deep" />
                </div>
              </div>

              <div className="my-4 h-px bg-ink/10" />

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="h-7 w-16 animate-pulse rounded-full bg-cream-deep" />
                <div className="flex items-center gap-1">
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-cream-deep" />
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-cream-deep" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="py-10 text-center text-sm text-tomato">{error}</p>
      ) : (
        <>
          <MenuCatalogGrid menuItems={products} />
          <PaginationControls currentPage={safePage} totalPages={totalPages} />
        </>
      )}

    </section>
  );
}