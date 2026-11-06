
'use client';

import Image from "next/image";
import { useState } from "react";
import { useAddItem } from "@/components/dashboardComponents/AddItemContext";
import {
  Pencil,
  ChevronRight,
  Star,
  Trash2,
  Ban,
} from "lucide-react";
import { type MenuItem } from "@/types/types";

type Props = {
  menuItems: MenuItem[];
  // page: number;
  // totalPages: number;
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
  menuItems
}: Props) {
  const { openEditItem } = useAddItem();
  return (
    <div className="mb-8 space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {menuItems.map( (item, index) => {
           return (
            <article
              key={item.id}
              style={{ animationDelay: `${index * 60}ms` }}
              className="card-in flex flex-col rounded-[1.75rem] border border-ink/10 bg-white p-5
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

                  {item.variants && item.variants.length > 0 && (
                    <ul className="mt-2 space-y-0.5 text-[11px] font-medium text-brown/70">
                      {item.variants.slice(0, 3).map((variant) => (
                        <li
                          key={variant.id}
                          className="flex items-center gap-1.5"
                        >
                          <span className="h-1 w-1 shrink-0 rounded-full bg-orange" />
                          <span className="truncate">{variant.name}</span>
                          <span className="ml-auto shrink-0 text-brown/60">
                            ${variant.price.toFixed(2)}
                            {variant.calories != null && (
                              <span className="text-brown/40">
                                {" "}· {variant.calories} kcal
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                      {item.variants.length > 3 && (
                        <li className="text-[10px] font-medium text-brown/50">
                          + {item.variants.length - 3} more
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>

              <hr className="my-4 border-ink/10" />

              {/* Stock + favorite + actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`group inline-flex items-center gap-1.5 rounded-full
                                px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                                  false
                                    ? "bg-tomato/10 text-tomato"
                                    : "bg-cream-deep text-brown hover:bg-tomato/10 hover:text-tomato"
                                }`}
                  >
                    <Ban
                      size={13}
                      strokeWidth={2.5}
                      className={false ? "" : "group-hover:stroke-tomato"}
                    />
                    {false
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
                    onClick={() => openEditItem(item)}
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
        {menuItems.length === 0 && (
          <p
            className="col-span-full rounded-xl border border-dashed border-ink/15 bg-white/60
                       py-10 text-center text-sm text-brown/60"
          >
            No menu items match your search.
          </p>
        )}
      </div>
    </div>
  );
}
