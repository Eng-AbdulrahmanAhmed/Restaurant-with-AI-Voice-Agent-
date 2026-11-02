'use client';

import { useEffect, useState } from "react";
import MenuCatalogHeader from "./MenuCatalogHeader";
import MenuCatalogGrid, { type MenuItem } from "./MenuCatalogGrid";
import { getProducts } from "@/services/productService";

const PAGE_SIZE = 6;

export default function MenuCatalog() {
    const [products, setProducts] = useState<MenuItem[]>([]);
    const [page, setPage] = useState(1);
    const [activeCategory, setActiveCategory] = useState("All Items");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                setError(null);

                // const data = await getProducts();
                const {products} = await getProducts();
                
                setProducts(products);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Could not load menu items. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    function handleCategoryChange(category: string) {
        setActiveCategory(category);
        setPage(1);
    }

    const filteredProducts =
        activeCategory === "All Items"
            ? products
            : products.filter(
                (product) => product.category === activeCategory
            );

    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / PAGE_SIZE)
    );

    const safePage = Math.min(page, totalPages);

    const paged = filteredProducts.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    );

    return (
        <section className="space-y-7 px-6 lg:px-10">
            <MenuCatalogHeader
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
            />

            {loading ? (
                <p className="py-10 text-center text-sm text-brown">
                    Loading menu items...
                </p>
            ) : error ? (
                <p className="py-10 text-center text-sm text-tomato">
                    {error}
                </p>
            ) : (
                <MenuCatalogGrid
                    items={paged}
                    page={safePage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            )}
        </section>
    );
}
