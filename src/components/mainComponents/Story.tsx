import Image from "next/image"
import storyGrill from "@/assets/about-grill.webp"

export default function Story() {
  return (
    <section id="story" className="relative scroll-mt-24 bg-[#F2E6CC] py-20 md:py-28">
      {/* wavy top edge */}
      <div aria-hidden="true" className="absolute inset-x-0 -top-5 h-6 overflow-hidden">
        <svg viewBox="0 0 1440 24" className="animate-wave h-full w-[calc(100%+320px)]" preserveAspectRatio="none">
          <path
            d="M0 24C60 8 120 8 180 16s120 8 180 0 120-8 180 0 120 8 180 0 120-8 180 0 120 8 180 0 120-8 180 0 120 8 180 0v8H0z"
            fill="#F2E6CC"
          />
        </svg>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12">
        <div data-reveal className="relative lg:col-span-5">
          <div className="overflow-hidden rounded-[2rem] rounded-tl-[6rem]">
            <Image
              src={storyGrill}
              alt="Beef patties flame-grilling over glowing embers"
              loading="lazy"
              width={1536}
              height={1024}
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="font-display absolute -bottom-5 -right-3 flex h-24 w-24 rotate-[-8deg] items-center justify-center rounded-full bg-[#F2690D] text-center text-sm font-bold leading-tight text-white shadow-lg md:-right-6 md:h-28 md:w-28 md:text-base">
            Est.
            <br />
            2012
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-8">
          <p data-reveal className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D15400]">
            Our story
          </p>
          <h2 data-reveal className="font-display mt-3 text-4xl font-black leading-tight tracking-tight md:text-5xl">
            Flame, patience, and
            <span className="italic text-[#F2690D]"> really good beef.</span>
          </h2>
          <p data-reveal className="mt-6 max-w-xl text-base leading-relaxed text-[#6F5230] md:text-lg">
            We started BurgerHouse in 2012 with one cast-iron grill and a simple
            rule: nothing frozen, nothing rushed. Every patty is hand-pressed
            each morning from locally raised beef, seared over real flame, and
            stacked with produce from farms we know by name.
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-[#241708]/15 pt-8 sm:gap-8">
            {[
              { n: "180g", d: "of beef in every patty" },
              { n: "14", d: "local farm partners" },
              { n: "0", d: "freezers in the kitchen" },
            ].map((s) => (
              <div key={s.d} data-reveal>
                <dt className="font-display text-3xl font-black text-[#F2690D] md:text-4xl">{s.n}</dt>
                <dd className="mt-1.5 text-xs leading-snug text-[#6F5230] md:text-sm">{s.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
