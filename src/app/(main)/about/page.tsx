import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarDays,
  Flame,
  Heart,
  Leaf,
  Star,
  Timer,
  Users,
} from "lucide-react";
import Features from "@/components/mainComponents/Features";
import Story from "@/components/mainComponents/Story";
import CtaBanner from "@/components/mainComponents/CtaBanner";

export const metadata = {
  title: "Our Story — BurgerHouse",
  description: "How BurgerHouse grills: real flame, local beef, and a few simple rules since 2012.",
};

const values = [
  {
    icon: Flame,
    title: "Real flame only",
    text: "Every patty hits an open grill. No flat-tops, no shortcuts — just char, smoke, and patience.",
  },
  {
    icon: Leaf,
    title: "Local by default",
    text: "We buy from 14 farms within driving distance, so produce arrives the same week it is picked.",
  },
  {
    icon: Timer,
    title: "Made to order",
    text: "Nothing sits under a lamp. Your burger starts when you order it, and takes the time it takes.",
  },
  {
    icon: Award,
    title: "One rule since 2012",
    text: "Nothing frozen, nothing rushed. It has kept the line out the door for over a decade.",
  },
];

const milestones = [
  {
    year: "2012",
    icon: Flame,
    title: "One grill, one rule",
    text: "BurgerHouse opens with a single cast-iron grill and a promise: real flame, local beef, enough patience.",
  },
  {
    year: "2018",
    icon: Users,
    title: "The neighborhood line",
    text: "We add a dining room, a second grill, and a crew that still tastes every batch before it leaves the pass.",
  },
  {
    year: "2022",
    icon: Award,
    title: "Farm partnerships",
    text: "We sign with 14 regional farms and start tracking every ingredient back to its source.",
  },
  {
    year: "2026",
    icon: Star,
    title: "AI voice ordering",
    text: "GrillBot joins the team — hands-free ordering, live kitchen display, and zero-wait checkout.",
  },
];

const stats = [
  { label: "Years grilling", value: "14", icon: CalendarDays },
  { label: "Burgers served", value: "1.2M", icon: Flame },
  { label: "Partner farms", value: "14", icon: Leaf },
  { label: "Five-star reviews", value: "4.9", icon: Star },
];

const marqueeWords = [
  "Flame-grilled",
  "Fresh daily",
  "Local beef",
  "Hand-pressed",
  "Big flavor",
  "Made to order",
  "Real hardwood",
  "Zero shortcuts",
];

export default function AboutPage() {
  return (
    <main className="w-full overflow-x-clip">
      <section className="relative overflow-hidden bg-cream-deep/40 py-20 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-orange/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-gold/15 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-deep">
            Our story
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight text-ink md:text-6xl">
            More than a burger.
            <br />
            <span className="italic text-orange">A grill, a rule, and a neighborhood.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-brown md:text-lg">
            BurgerHouse started in 2012 with one cast-iron grill and a simple
            belief: use good beef, real fire, and enough patience, and people
            will come back. They did. Here is how we still do it.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-cream shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)] transition-all hover:-translate-y-0.5 hover:bg-orange-deep"
            >
              Explore the menu
              <ArrowRight
                size={16}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/#visit"
              className="inline-flex items-center gap-2 py-3 text-sm font-semibold text-ink underline decoration-orange decoration-2 underline-offset-8 transition hover:text-orange"
            >
              Find us
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="overflow-hidden border-y border-ink/10 bg-ink py-3">
        <div className="animate-marquee inline-flex gap-8 whitespace-nowrap text-xs font-bold uppercase tracking-[0.2em] text-cream/80">
          {[...marqueeWords, ...marqueeWords].map((word, index) => (
            <span key={`${word}-${index}`} className="inline-flex items-center gap-3">
              {word}
              <span aria-hidden className="text-orange">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="group rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)] transition-all hover:-translate-y-0.5 hover:border-orange/20 hover:shadow-[0_20px_32px_-24px_rgba(36,23,8,0.45)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange/10 text-orange transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <Icon size={20} strokeWidth={2} />
              </div>
              <p className="mt-4 font-display text-3xl font-black tracking-tight text-ink transition-colors duration-200 group-hover:text-orange">
                {value}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-brown/60">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Features />
      <Story />

      {/* Timeline */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-deep">
            The journey
          </p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-ink md:text-5xl">
            Four chapters of <span className="italic text-orange">BurgerHouse.</span>
          </h2>
        </div>

        <div className="relative mt-12 space-y-10 md:space-y-0">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-orange/30 via-ink/10 to-transparent md:block"
          />
          {milestones.map(({ year, icon: Icon, title, text }, index) => {
            const left = index % 2 === 0;
            return (
              <div
                key={year}
                className={`relative grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10 ${
                  left ? "" : "md:[&>*:first-child]:order-2"
                }`}
              >
                <div
                  className={`flex flex-col ${
                    left ? "md:items-end md:text-right" : "md:items-start md:text-left"
                  }`}
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-orange/10 px-3 py-1 text-xs font-bold text-orange-deep">
                    <Icon size={13} strokeWidth={2.5} />
                    {year}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-bold text-ink">{title}</h3>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-brown">{text}</p>
                </div>
                <div
                  aria-hidden="true"
                  className="hidden md:flex md:items-center md:justify-center"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange/30 bg-cream text-orange">
                    <Icon size={16} strokeWidth={2} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* What we stand for */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-deep">
            What we stand for
          </p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-ink md:text-5xl">
            Four things we never <span className="italic text-orange">compromise on.</span>
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {values.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-[0_14px_30px_-24px_rgba(36,23,8,0.35)] transition-all hover:-translate-y-0.5 hover:border-orange/20 hover:shadow-[0_20px_32px_-24px_rgba(36,23,8,0.45)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange/10 text-orange transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <Icon size={20} strokeWidth={2} />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink transition-colors duration-200 group-hover:text-orange-deep">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-brown">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
