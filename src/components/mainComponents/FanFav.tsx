import Image from "next/image"
import heroImage from "@/assets/hero-image.png";
import Link from "next/link";
import ArrowIcon from "@/components/Icons/ArrowIcon";
import { ArrowUpRight, Flame } from "lucide-react";

const FAVORITES = [
  {
    name: "Classic Burger",
    description: "Beef, cheddar, lettuce, tomato, house sauce",
    price: "EGP 8.99",
  },
  {
    name: "Bacon Burger",
    description: "Beef, bacon, cheddar, lettuce, tomato",
    price: "EGP 10.99",
  },
  {
    name: "Mushroom Burger",
    description: "Beef, sautéed mushrooms, cheddar, lettuce",
    price: "EGP 9.99",
  },
];

export default function FanFav(){
    return(
        <section className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-20 lg:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-deep">
              The menu
            </p>
            <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-ink md:text-5xl">
              Fan favorites,
              <br />
              <span className="italic text-orange">hot off the grill.</span>
            </h2>
          </div>

          <Link
            href="/menu"
            className="group inline-flex items-center gap-2 py-2 text-sm font-semibold text-ink underline decoration-orange decoration-2 underline-offset-8 transition-colors hover:text-orange"
          >
            View all
            <ArrowIcon />
          </Link>
        </div>

        {/* Product Cards — artisan plates with editorial details */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {FAVORITES.map((item, index) => (
            <article
              key={item.name}
              className="group flex flex-col rounded-[2rem] border border-ink/10 bg-white p-4 shadow-[0_18px_36px_-28px_rgba(36,23,8,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-orange/30 hover:shadow-[0_24px_44px_-26px_rgba(36,23,8,0.5)]"
            >
              {/* Plate */}
              <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-[1.4rem] bg-cream-deep/60">
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(242,105,13,0.14),transparent_62%)]"
                />
                <span className="absolute left-3.5 top-3.5 rounded-full border border-orange/25 bg-white/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-orange-deep backdrop-blur-sm">
                  No. {String(index + 1).padStart(2, "0")}
                </span>
                <Image
                  src={heroImage}
                  alt={item.name}
                  width={420}
                  height={420}
                  className="relative h-[76%] w-auto object-contain drop-shadow-[0_20px_22px_rgba(36,23,8,0.25)] transition-transform duration-500 ease-out group-hover:-rotate-2 group-hover:scale-[1.06]"
                />
                <span
                  aria-hidden
                  className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-orange shadow-sm"
                >
                  <Flame size={13} />
                </span>
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
                <h3 className="font-display text-xl font-bold text-ink">
                  {item.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-brown">
                  {item.description}
                </p>

                <div className="mt-auto flex items-end justify-between gap-3 border-t border-ink/10 pt-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-brown/60">
                      From the grill
                    </p>
                    <p className="mt-0.5 font-display text-lg font-bold text-orange">
                      {item.price}
                    </p>
                  </div>
                  <Link
                    href="/menu"
                    aria-label={`See ${item.name} on the full menu`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition-colors hover:border-orange hover:bg-orange hover:text-cream"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    )
}
