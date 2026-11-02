
'use client';

import Image from "next/image";
import { useState } from "react";
import {
  Pencil,
  ChevronRight,
  Star,
  Trash2,
  Ban,
} from "lucide-react";

export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  stock?: number | null;
  popular?: boolean;
};

type Props = {
  items: MenuItem[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function ProductImage({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream-deep">
      {src && !loaded && (
        <div className="absolute inset-0 animate-pulse bg-orange/10" />
      )}

      {src ? (
        <Image
          src={src}
          alt={alt}
          width={96}
          height={96}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-brown/40">
          No image
        </div>
      )}
    </div>
  );
}

export default function MenuCatalogGrid({
  items,
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="mb-8 space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const outOfStock = item.stock === 0;

          return (
            <article
              key={item.id}
              className="flex flex-col rounded-[1.75rem] border border-ink/10 bg-white p-5
                         shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)]
                         transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_32px_-22px_rgba(36,23,8,0.45)]"
            >
              {/* Category + Popular badge */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className="rounded-full bg-orange/10 px-3 py-1 text-[10px] font-extrabold
                             uppercase tracking-wider text-orange-deep"
                >
                  {item.category}
                </span>

                {item.popular && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-orange
                               px-3 py-1 text-[11px] font-bold text-white"
                  >
                    <Star size={12} fill="currentColor" strokeWidth={0} />
                    Popular
                  </span>
                )}
              </div>

              {/* Product information */}
              <div className="mt-4 flex items-center gap-4">
                <ProductImage src={item.image} alt={item.name} />

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-lg font-bold text-ink">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-brown">
                    {item.description || "No description available."}
                  </p>

                  <p className="mt-2 font-display text-xl font-bold text-orange">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <hr className="my-4 border-ink/10" />

              {/* Stock + favorite + actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`group inline-flex items-center gap-1.5 rounded-full
                                px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                                  outOfStock
                                    ? "bg-tomato/10 text-tomato"
                                    : "bg-cream-deep text-brown hover:bg-tomato/10 hover:text-tomato"
                                }`}
                  >
                    <Ban
                      size={13}
                      strokeWidth={2.5}
                      className={outOfStock ? "" : "group-hover:stroke-tomato"}
                    />
                    {outOfStock
                      ? "Out of stock"
                      : item.stock != null
                        ? `${item.stock} Item`
                        : "In stock"}
                  </span>

                  {/* Fan favorite star — visual only for now */}
                  <button
                    type="button"
                    title="Mark as fan favorite"
                    className={`flex h-8 w-8 items-center justify-center rounded-lg
                                transition-colors duration-200 ${
                                  item.popular
                                    ? "bg-gold/20 text-gold hover:bg-gold/30"
                                    : "bg-cream-deep text-ink/25 hover:text-ink/40"
                                }`}
                  >
                    <Star size={16} fill="currentColor" strokeWidth={0} />
                  </button>
                </div>

                {/* Edit + Delete */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title={`Edit ${item.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg
                               text-brown/50 transition-colors duration-200
                               hover:bg-orange/10 hover:text-orange"
                  >
                    <Pencil size={16} strokeWidth={2} />
                  </button>

                  <button
                    type="button"
                    title={`Delete ${item.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg
                               text-brown/50 transition-colors duration-200
                               hover:bg-tomato/10 hover:text-tomato"
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {/* Empty state */}
        {items.length === 0 && (
          <p
            className="col-span-full rounded-xl border border-dashed border-ink/15 bg-white/60
                       py-10 text-center text-sm text-brown/60"
          >
            No menu items match your search.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold
                          transition-all duration-200 ${
                            p === page
                              ? "bg-ink text-cream shadow-sm"
                              : "border border-ink/10 bg-white text-brown hover:text-orange"
                          }`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            title="Next page"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10
                       bg-white text-brown transition-all duration-200 hover:text-orange
                       disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
