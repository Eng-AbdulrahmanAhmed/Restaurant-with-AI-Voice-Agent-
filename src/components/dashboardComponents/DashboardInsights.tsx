import Link from "next/link";
import Image from "next/image";
import {
  Layers,
  DollarSign,
  ArrowRight,
  UtensilsCrossed,
} from "lucide-react";
import { getProducts } from "@/services/productService";

/* ============================================================================
   DASHBOARD INSIGHTS â€” real data only (no mock numbers).
   Pulls the same catalog used by /dashboard/menu and derives:
     - item count per category
     - lowest / average / highest price
     - price range, distribution, cheapest / priciest item
     - a small "From the Menu" preview
   Compact card sizing to keep the dashboard dense.
   ============================================================================ */

type Product = Awaited<ReturnType<typeof getProducts>>["products"][number];

const barColors = [
  "bg-orange",
  "bg-gold",
  "bg-lettuce",
  "bg-tomato",
  "bg-brown",
];

export default async function DashboardInsights() {
  let products: Product[] = [];

  try {
    const data = await getProducts();
    products = data.products;
  } catch (error) {
    console.error("Error loading dashboard insights:", error);

    return (
      <section className="rounded-3xl border border-dashed border-ink/15 bg-white/60 px-6 py-8 text-center">
        <p className="text-sm font-semibold text-brown">
          Could not load menu insights right now.
        </p>
        <p className="mt-1 text-xs text-brown/60">
          Please refresh the page or try again later.
        </p>
      </section>
    );
  }

  const categoryMap = new Map<string, number>();

  for (const product of products) {
    categoryMap.set(
      product.category,
      (categoryMap.get(product.category) ?? 0) + 1
    );
  }

  const categories = [...categoryMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const total = products.length;
  const prices = products.map((product) => product.price);
  const lowest = total > 0 ? Math.min(...prices) : 0;
  const highest = total > 0 ? Math.max(...prices) : 0;
  const average =
    total > 0 ? prices.reduce((sum, price) => sum + price, 0) / total : 0;

  const priceStats = [
    { label: "Lowest", value: lowest },
    { label: "Average", value: average },
    { label: "Highest", value: highest },
  ];

  const cheapest =
    total > 0
      ? products.reduce(
          (min, product) => (product.price < min.price ? product : min),
          products[0]
        )
      : null;

  const priciest =
    total > 0
      ? products.reduce(
          (max, product) => (product.price > max.price ? product : max),
          products[0]
        )
      : null;

  // Where the average sits between the cheapest and priciest item.
  const averagePercent =
    highest > lowest ? ((average - lowest) / (highest - lowest)) * 100 : 50;

  // Four price buckets so the card shows how items are distributed.
  const bucketCount = 4;
  const bucketStep = highest > lowest ? (highest - lowest) / bucketCount : 1;

  const buckets = Array.from({ length: bucketCount }, (_, index) => {
    const from = lowest + bucketStep * index;
    const to =
      index === bucketCount - 1 ? highest : lowest + bucketStep * (index + 1);

    return {
      label: `EGP ${from.toFixed(0)}–EGP ${to.toFixed(0)}`,
      count: 0,
    };
  });

  for (const price of prices) {
    let index = Math.floor((price - lowest) / bucketStep);
    if (index >= bucketCount) index = bucketCount - 1;
    if (index < 0) index = 0;
    buckets[index].count += 1;
  }

  const preview = products.slice(0, 3);

  return (
    <section className="space-y-4">
      {/* Section heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-black tracking-tight text-ink">
            Menu <span className="italic text-orange">Insights</span>
          </h2>
          <p className="mt-0.5 text-xs text-brown">
            Live numbers from your product catalog.
          </p>
        </div>

        <Link
          href="/dashboard/menu"
          className="group inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[11px] font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-orange/40 hover:text-orange"
        >
          View menu
          <ArrowRight
            size={13}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Items by category */}
        <div className="group/card rounded-3xl border border-ink/10 bg-white p-5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)] transition-all duration-300 hover:border-orange/20 hover:shadow-[0_20px_36px_-24px_rgba(36,23,8,0.45)]">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange/10 text-orange transition-transform duration-300 group-hover/card:scale-110">
              <Layers size={17} strokeWidth={2} />
            </span>

            <div>
              <h3 className="font-display text-base font-bold text-ink">
                Items by Category
              </h3>
              <p className="text-[11px] text-brown/70">
                {total} available {total === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {categories.length === 0 ? (
              <p className="py-5 text-center text-xs text-brown/60">
                No available items found.
              </p>
            ) : (
              categories.map((category, index) => {
                const percent = total > 0 ? (category.count / total) * 100 : 0;
                const barColor = barColors[index % barColors.length];

                return (
                  <div
                    key={category.name}
                    className="group/row -mx-2 rounded-xl px-2 py-1.5 transition-colors duration-200 hover:bg-cream/70"
                  >
                    <div className="flex items-center justify-between gap-3 text-xs font-semibold">
                      {/* dot sits OUTSIDE the truncate span so scaling it up
                          isn't clipped by the parent's overflow-hidden */}
                      <span className="flex min-w-0 items-center gap-2 text-ink transition-colors duration-200 group-hover/row:text-orange-deep">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${barColor} transition-transform duration-200 group-hover/row:scale-125`}
                        />
                        <span className="truncate">{category.name}</span>
                      </span>

                      <span className="flex shrink-0 items-center gap-2">
                        <span className="text-[10px] font-bold text-orange opacity-0 transition-opacity duration-200 group-hover/row:opacity-100">
                          {percent.toFixed(0)}%
                        </span>
                        <span className="font-display text-sm font-bold text-ink transition-transform duration-200 group-hover/row:scale-110">
                          {category.count}
                        </span>
                      </span>
                    </div>

                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream-deep">
                      <div
                        className={`h-full origin-left rounded-full ${barColor} animate-bar-grow transition-[filter] duration-300 group-hover/row:brightness-110 group-hover/row:saturate-150`}
                        style={{
                          width: `${percent}%`,
                          animationDelay: `${index * 90}ms`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-ink/5 pt-2.5 text-[10px]">
            <span className="font-semibold uppercase tracking-wider text-brown/60">
              Categories
            </span>
            <span className="font-display text-sm font-bold text-ink">
              {categories.length}
            </span>
          </div>
        </div>

        {/* Price snapshot */}
        <div className="group/card flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)] transition-all duration-300 hover:border-orange/20 hover:shadow-[0_20px_36px_-24px_rgba(36,23,8,0.45)]">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold transition-transform duration-300 group-hover/card:scale-110">
              <DollarSign size={17} strokeWidth={2} />
            </span>

            <div>
              <h3 className="font-display text-base font-bold text-ink">
                Price Snapshot
              </h3>
              <p className="text-[11px] text-brown/70">
                Across all available items
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {priceStats.map((stat) => (
              <div
                key={stat.label}
                className="group rounded-2xl bg-cream/70 px-2 py-2.5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:bg-cream hover:shadow-[0_10px_20px_-16px_rgba(36,23,8,0.4)]"
              >
                <p className="text-[9px] font-bold uppercase tracking-wider text-brown/60 transition-colors duration-200 group-hover:text-orange-deep">
                  {stat.label}
                </p>
                <p className="mt-0.5 font-display text-base font-bold text-ink transition-colors duration-200 group-hover:text-orange">
                  EGP {stat.value.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Price range with average marker */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-brown/60">
              <span>Price range</span>
              <span className="normal-case tracking-normal text-ink/70">
                EGP {lowest.toFixed(2)} – EGP {highest.toFixed(2)}
              </span>
            </div>

            <div className="relative mt-2 h-2 rounded-full bg-cream-deep">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/70 via-orange/70 to-tomato/70" />

              <span
                title={`Average EGP {average.toFixed(2)}`}
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-orange-deep shadow-[0_2px_6px_rgba(36,23,8,0.3)] transition-transform duration-200 hover:scale-125"
                style={{ left: `${averagePercent}%` }}
              />
            </div>
          </div>

          {/* Price distribution */}
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brown/60">
              Price distribution
            </p>

            <div className="mt-2 space-y-2">
              {buckets.map((bucket, index) => {
                const percent = total > 0 ? (bucket.count / total) * 100 : 0;

                return (
                  <div key={index} className="group/bucket">
                    <div className="flex items-center justify-between text-[10px] font-semibold">
                      <span className="text-brown/70 transition-colors duration-200 group-hover/bucket:text-orange-deep">
                        {bucket.label}
                      </span>
                      <span className="text-ink/70">{bucket.count}</span>
                    </div>

                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-cream-deep">
                      <div
                        className="h-full origin-left rounded-full bg-gold animate-bar-grow transition-[filter] duration-300 group-hover/bucket:brightness-110 group-hover/bucket:saturate-150"
                        style={{
                          width: `${percent}%`,
                          animationDelay: `${index * 90}ms`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cheapest / priciest item */}
          <div className="mt-4 space-y-2">
            {[
              { label: "Cheapest", item: cheapest, dot: "bg-lettuce" },
              { label: "Priciest", item: priciest, dot: "bg-tomato" },
            ].map(({ label, item, dot }) =>
              item ? (
                <div
                  key={label}
                  className="group/item flex items-center justify-between gap-2 rounded-2xl bg-cream/70 px-3 py-2 transition-colors duration-200 hover:bg-cream"
                >
                  <span className="flex shrink-0 items-center gap-2 text-[11px] font-semibold text-brown">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${dot} transition-transform duration-200 group-hover/item:scale-125`}
                    />
                    {label}
                  </span>

                  <span className="min-w-0 flex-1 truncate text-right text-[11px] text-ink/70">
                    {item.name}
                  </span>

                  <span className="shrink-0 font-display text-sm font-bold text-ink">
                    EGP {item.price.toFixed(2)}
                  </span>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>

      {/* From the menu */}
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-ink">
            From the Menu
          </h3>

          <Link
            href="/dashboard/menu"
            className="text-[11px] font-semibold text-orange transition-colors hover:text-orange-deep"
          >
            See all
          </Link>
        </div>

        {preview.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-ink/15 bg-white/60 py-6 text-center text-xs text-brown/60">
            Your menu is empty. Add your first item to see it here.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {preview.map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_32px_-22px_rgba(36,23,8,0.45)]"
              >
                <div className="relative h-28 w-full bg-cream-deep">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-brown/40">
                      <UtensilsCrossed size={22} strokeWidth={1.5} />
                    </div>
                  )}

                  <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-orange-deep backdrop-blur">
                    {item.category}
                  </span>
                </div>

                <div className="p-3.5">
                  <h4 className="truncate font-display text-sm font-bold text-ink transition-colors duration-200 group-hover:text-orange-deep">
                    {item.name}
                  </h4>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="font-display text-base font-bold text-orange transition-transform duration-200 group-hover:scale-105">
                      EGP {item.price.toFixed(2)}
                    </span>
                    <span className="rounded-full bg-lettuce/10 px-2 py-0.5 text-[9px] font-bold text-lettuce">
                      Available
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
