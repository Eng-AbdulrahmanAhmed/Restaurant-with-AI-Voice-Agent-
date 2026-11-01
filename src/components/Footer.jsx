import { BurgerMark } from "@/components/footerComponents/BurgerMark";

export default function Footer() {
  return (
    <footer id="visit" className="scroll-mt-24 bg-[#241708] text-[#FAF3E2]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <a href="#top" className="flex items-center gap-2.5" aria-label="BurgerHouse — back to top">
            <BurgerMark />
            <span className="font-display text-2xl font-bold tracking-tight">
              Burger<span className="text-[#F2690D]">House.</span>
            </span>
          </a>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#FAF3E2]/70">
            Flame-grilled burgers, hand-pressed every morning. Fresh, local,
            and made to make you smile.
          </p>
        </div>

        <div className="md:col-span-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E9A13B]">Visit us</h3>
          <address className="mt-4 text-sm not-italic leading-relaxed text-[#FAF3E2]/80">
            424 Ember Street
            <br />
            Flavortown, CA 90210
          </address>
          <p className="mt-4 text-sm leading-relaxed text-[#FAF3E2]/80">
            Mon–Thu · 11:00 – 22:00
            <br />
            Fri–Sun · 11:00 – 23:30
          </p>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E9A13B]">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href="tel:+15550123456"
                className="text-[#FAF3E2]/80 underline-offset-4 transition-colors hover:text-[#F2690D] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F2690D]"
              >
                (555) 012-3456
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@burgerhouse.example"
                className="text-[#FAF3E2]/80 underline-offset-4 transition-colors hover:text-[#F2690D] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F2690D]"
              >
                hello@burgerhouse.example
              </a>
            </li>
          </ul>
          <nav className="mt-6 flex flex-col gap-2.5 text-sm" aria-label="Footer navigation">
            {[
              { label: "Menu", href: "#menu" },
              { label: "Our story", href: "#story" },
              { label: "Reviews", href: "#reviews" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[#FAF3E2]/80 underline-offset-4 transition-colors hover:text-[#F2690D] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F2690D]"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-[#FAF3E2]/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-[#FAF3E2]/50 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} BurgerHouse. All rights reserved.</p>
          <p className="font-display italic">Made fresh daily, over real flame.</p>
        </div>
      </div>
    </footer>
  );
}
