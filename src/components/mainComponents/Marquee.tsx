export default function Marquee() {
    const MARQUEE_WORDS = [
  "Flame-grilled",
  "Fresh daily",
  "Local beef",
  "Hand-pressed",
  "Big flavor",
  "Made to order",
];
    return(
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
    )
}