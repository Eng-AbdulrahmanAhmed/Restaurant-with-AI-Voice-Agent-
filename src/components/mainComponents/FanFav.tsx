import Image from "next/image"
import heroImage from "@/assets/hero-image.png";
import Link from "next/link";
import ArrowIcon from "@/components/Icons/ArrowIcon";
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

        {/* Product Cards */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
          {[
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
          ].map((item) => (
            <article key={item.name} className="group flex flex-col">
              <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-[2rem] rounded-br-[4.5rem] bg-cream-deep">
                <Image
                  src={heroImage}
                  alt={item.name}
                  width={420}
                  height={420}
                  className="h-[78%] w-auto object-contain drop-shadow-[0_20px_22px_rgba(36,23,8,0.25)] transition-transform duration-300 ease-out group-hover:-rotate-2 group-hover:scale-[1.06]"
                />
              </div>
              <div className="px-1 pt-5">
                <h3 className="font-display text-xl font-bold text-ink">
                  {item.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-brown">
                  {item.description}
                </p>
                <p className="mt-2.5 font-display text-lg font-bold text-orange">
                  {item.price}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    )
}