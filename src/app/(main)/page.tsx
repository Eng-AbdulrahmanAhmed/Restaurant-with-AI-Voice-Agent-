import Image from "next/image";
import heroImage from "@/assets/hero-image.png";
import Link from "next/link";
import CtaBanner from "@/components/mainComponents/CtaBanner"
import Story from "@/components/mainComponents/Story"

/* REDESIGN — home page restyled to match the BurgerHouse reference
   one-pager: Fraunces display headings with an italic orange accent,
   pill badge + pill CTAs, organic blob behind a floating burger,
   rotating stamp badge, orange marquee band. Same sections, same
   links, same content — styling only. */

const MARQUEE_WORDS = [
  "Flame-grilled",
  "Fresh daily",
  "Local beef",
  "Hand-pressed",
  "Big flavor",
  "Made to order",
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 transition-transform group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="w-full overflow-x-clip">
      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden">
        {/* soft background blobs */}
        <div
          aria-hidden="true"
          className="absolute -right-40 -top-24 h-[560px] w-[560px] rounded-full bg-cream-deep"
        />
        <div
          aria-hidden="true"
          className="absolute -left-52 top-64 h-[420px] w-[420px] rounded-full bg-peach/70"
        />

        {/* STYLE MOD (step 3-fix) — was pb-16 pt-10 md:pb-24: too much cream gap
            above the marquee band. Reduced to pb-10 md:pb-14 to balance the
            spacing around the marquee. (undo: pb-16 pt-10 md:pb-24) */}
        <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 pb-10 pt-10 md:pb-14 lg:grid-cols-2 lg:px-12">
          {/* Text */}
          <div className="flex flex-col items-start bg-cream rounded-full px-4 py-2">
            {/* Badge */}
            <div className="inline items-center bg-orange/10 px-4 rounded-full items-center">
              <span className="h-1.5 w-1.5 rounded-full text-orange font-semibold text-sm" aria-hidden="true">Fresh </span>
              <span className="h-1.5 w-1.5 rounded-full text-orange font-semibold text-lg">· </span>
              <span className="h-1.5 w-1.5 rounded-full text-orange font-semibold text-sm">Local </span>
              <span className="h-1.5 w-1.5 rounded-full text-orange font-semibold text-lg">· </span>
              <span className="h-1.5 w-1.5 rounded-full text-orange font-semibold text-sm">Delicious</span>
            </div>
              

            {/* Heading */}
            <h1 className="mt-3 font-display text-5xl font-black leading-[1.02] tracking-tight text-ink sm:text-6xl xl:text-7xl">
              Burgers made
              <br />
              to make you{" "}
              <span className="italic text-orange">smile.</span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-md text-base leading-relaxed text-brown md:text-lg">
              Juicy, flame-grilled burgers with fresh ingredients, made for
              real flavor and happier days.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                href="/menu"
                className="group inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)] transition-all hover:bg-orange-deep hover:shadow-[0_14px_28px_-8px_rgba(242,105,13,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-deep"
              >
                Explore Menu
                <ArrowIcon />
              </Link>

              <Link
                href="/about"
                className="group inline-flex items-center gap-2 py-3 text-sm font-semibold text-ink underline decoration-orange decoration-2 underline-offset-8 transition-colors hover:text-orange"
              >
                Our story
                <ArrowIcon />
              </Link>
            </div>
          </div>

          {/* Burger visual with decorations */}
          <div className="relative mx-auto w-full max-w-[520px]">
            {/* organic blob */}
            <svg
              viewBox="0 0 520 520"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <path
                d="M260 30c90-14 180 38 210 124 30 87-6 178-64 236-58 59-146 96-224 66C104 426 42 348 38 258 34 168 88 92 160 58c34-16 66-24 100-28z"
                fill="#F2E6CC"
              />
              <path
                d="M260 62c76-12 152 32 177 105 25 73-5 150-54 199-49 50-123 81-189 56C128 394 78 333 75 260 72 187 117 122 177 93c29-14 55-27 83-31z"
                fill="#F8E3C3"
                opacity="0.7"
              />
            </svg>

            <Image
              src={heroImage}
              alt="Fresh cheeseburger"
              width={700}
              height={700}
              priority
              quality={100}
              sizes="(max-width: 768px) 90vw, 520px"
              className="animate-float relative z-10 h-auto w-full object-contain drop-shadow-[0_36px_40px_rgba(36,23,8,0.28)]"
            />

            {/* Rotating flame badge */}
            <div className="absolute -left-2 top-4 z-20 h-28 w-28 md:-left-6 md:h-32 md:w-32">

              {/* Rotating circular text */}
              <svg
                viewBox="0 0 120 120"
                className="h-full w-full animate-spin-slow"
                aria-hidden="true"
              >
                <defs>
                  <path
                    id="badge-circle"
                    d="M60 14a46 46 0 1 1 0 92 46 46 0 1 1 0-92"
                  />
                </defs>

                <circle cx="60" cy="60" r="59" fill="#241708" />

                <text
                  fill="#FAF3E2"
                  fontSize="11.5"
                  fontWeight="600"
                  letterSpacing="2.5"
                >
                  <textPath href="#badge-circle">
                    FLAME-GRILLED · FRESH DAILY · SINCE 2012 ·
                  </textPath>
                </text>
              </svg>

              {/* Flame container */}
              <div className="absolute inset-0 flex items-center justify-center">

                {/* Flame glow */}
                <div className="flame-glow absolute h-9 w-9 rounded-full bg-orange/40 blur-xl" />

                {/* Rising sparks */}
                <span className="flame-spark spark-one" />
                <span className="flame-spark spark-two" />
                <span className="flame-spark spark-three" />
                <span className="flame-spark spark-four" />

                {/* Main flame */}
                <svg
                  viewBox="0 0 48 56"
                  className="relative z-10 h-10 w-9 flame-body"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="flameOuter" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FF9D32" />
                      <stop offset="55%" stopColor="#F2690D" />
                      <stop offset="100%" stopColor="#D15400" />
                    </linearGradient>
                  </defs>

                  {/* Outer flame */}
                  <path
                    className="flame-outer"
                    d="M24 2C22 12 8 18 6 32C3 45 11 54 24 54C38 54 46 44 42 31C39 20 30 15 29 7C27 13 25 16 23 19C25 12 25 7 24 2Z"
                    fill="url(#flameOuter)"
                  />

                  {/* Inner yellow flame */}
                  <path
                    className="flame-inner"
                    d="M24 27C21 33 16 37 17 43C18 49 22 51 26 50C32 49 35 43 32 37C30 33 26 30 24 27Z"
                    fill="#FFD166"
                  />

                  {/* Hot core */}
                  <path
                    d="M25 40C22 43 22 47 25 48C28 48 29 44 25 40Z"
                    fill="#FFF1C1"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Marquee band ================= */}
      {/* STYLE MOD (step 3-fix) — was -my-2 ... py-6: the band sat with a big
          gap after the hero and too close to the Features strip. Now py-4 with
          no negative margins => tight to its content and even spacing on both
          sides with the reduced hero padding. (undo: className="relative z-10 -my-2 overflow-hidden py-6") */}
      <section aria-hidden="true" className="relative z-10 overflow-hidden py-4 pb-16">
        <div className="-rotate-[1.3deg] scale-[1.02] bg-orange py-4 shadow-[0_18px_30px_-20px_rgba(36,23,8,0.5)]">
          <div className="flex w-max animate-marquee items-center">
            {[0, 1].map((half) => (
              <div key={half} className="flex items-center">
                {[...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS].map(
                  (w, i) => (
                    <span key={`${half}-${i}`} className="flex items-center">
                      <span className="px-6 font-display text-2xl font-bold italic text-cream md:text-3xl">
                        {w}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-ink"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
                      </svg>
                    </span>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Features ================= */}
      <section className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-5 border-y border-ink/10 px-6 py-7 sm:grid-cols-3 sm:gap-0">
        <div className="flex items-center justify-center gap-3">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 shrink-0 text-orange"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path
              d="M12 21c-4-3.5-7-7-7-10.5C5 6.5 8 4 12 4s7 2.5 7 6.5C19 14 16 17.5 12 21zm0-13v9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-semibold text-ink">Fresh ingredients</span>
        </div>

        <div className="flex items-center justify-center gap-3 sm:border-x sm:border-ink/10">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 shrink-0 text-orange"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path
              d="M12 3c1 2-.5 3 .5 5M8.5 4c.8 1.6-.4 2.5.4 4M15.5 4c-.8 1.6.4 2.5-.4 4M5 13a7 7 0 0 0 14 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-semibold text-ink">Made to order</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 shrink-0 text-orange"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path
              d="M12 21c3.9 0 6.5-2.6 6.5-6 0-4.5-4-6.5-4-11-3 2-3.5 5-3 7.5C10.3 10.3 9 8.6 9 6c-2.1 2.1-3.5 4.6-3.5 7.5 0 4 2.7 7.5 6.5 7.5z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-semibold text-ink">Big flavor</span>
        </div>
      </section>

      {/* ================= Fan Favorites ================= */}
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
              price: "$8.99",
            },
            {
              name: "Bacon Burger",
              description: "Beef, bacon, cheddar, lettuce, tomato",
              price: "$10.99",
            },
            {
              name: "Mushroom Burger",
              description: "Beef, sautéed mushrooms, cheddar, lettuce",
              price: "$9.99",
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
      <Story />
      <CtaBanner />
    </main>
  );
}
