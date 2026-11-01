export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-[#F2690D] py-20 text-[#FAF3E2] md:py-24">
      {/* wavy top edge */}
      <div aria-hidden="true" className="absolute inset-x-0 -top-5 h-6 overflow-hidden">
        <svg viewBox="0 0 1440 24" className="animate-wave h-full w-[calc(100%+320px)]" preserveAspectRatio="none">
          <path
            d="M0 24C60 8 120 8 180 16s120 8 180 0 120-8 180 0 120 8 180 0 120-8 180 0 120 8 180 0 120-8 180 0 120 8 180 0v8H0z"
            fill="#F2690D"
          />
        </svg>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full border-[26px] border-[#FAF3E2]/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full border-[36px] border-[#241708]/10" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <h2 data-reveal className="font-display max-w-xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
          Hungry yet?
          <br />
          <span className="italic text-[#241708]">The grill is on.</span>
        </h2>
        <div data-reveal className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#241708] px-7 py-3.5 text-sm font-semibold text-[#FAF3E2] transition-all hover:scale-[1.03] hover:bg-[#000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF3E2]"
          >
            Start an order
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <a
            href="tel:+15550123456"
            className="inline-flex items-center gap-2 py-3 text-sm font-semibold underline decoration-[#FAF3E2]/60 decoration-2 underline-offset-8 transition-colors hover:text-[#241708] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FAF3E2]"
          >
            or call (555) 012-3456
          </a>
        </div>
      </div>
    </section>
  );
}
