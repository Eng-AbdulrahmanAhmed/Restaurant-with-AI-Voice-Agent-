import Link from "next/link"
import Image from "next/image"
import Flame from "@/components/Icons/Flame"
import heroImage from "@/assets/hero-image.png"
import ArrowIcon from "@/components/Icons/ArrowIcon"

export default function Hero(){
    return(
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

            <Flame />
          </div>
        </div>
      </section>
    )
}