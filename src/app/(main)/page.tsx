import Image from "next/image";
import heroImage from "@/assets/hero-image.png";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 lg:px-12">

      {/* Hero */}
      <section className="grid min-h-[420px] grid-cols-1 items-center gap-0 md:grid-cols-[1fr_1fr]">

        {/* Text */}
        <div className="flex flex-col items-start gap-5">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
            <span>FRESH</span>
            <span className="h-1 w-1 rounded-full bg-orange-500" />
            <span>LOCAL</span>
            <span className="h-1 w-1 rounded-full bg-orange-500" />
            <span>DELICIOUS</span>
          </div>

          {/* Heading */}
          <h1 className="max-w-[650px] text-5xl font-extrabold leading-[1.08] tracking-tight text-charcoal xl:text-6xl">
            Burgers made to
            <br />
            make you <span className="text-orange">smile.</span>
          </h1>

          {/* Description */}
          <p className="max-w-[480px] text-base leading-relaxed text-muted lg:text-lg">
            Juicy, flame-grilled burgers with fresh ingredients,
            made for real flavor and happier days.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-5 pt-2">
            <Link
              href="/menu"
              className="rounded-full bg-orange px-7 py-3 text-base font-semibold text-cream transition hover:scale-105"
            >
              Explore Menu →
            </Link>

            <Link
              href="/about"
              className="font-semibold text-muted transition hover:text-orange"
            >
              Our story →
            </Link>
          </div>

        </div>

        {/* Burger Image with decorations */}
  <div className="relative isolate flex items-center justify-center md:-ml-24 md:translate-x-[-40px]">

    
    {/* Burger */}
    <Image
      src={heroImage}
      alt="Fresh cheeseburger"
      width={700}
      height={700}
      priority
      quality={100}
      sizes="(max-width: 768px) 90vw, 650px"
      className="relative z-0 h-auto w-full max-w-[450] object-contain"
    />

  </div>

      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-[1100px] grid-cols-3 items-center border-y border-orange-200/60 py-5">

        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl text-orange">♧</span>
          <span className="font-medium text-charcoal">Fresh ingredients</span>
        </div>

        <div className="flex items-center justify-center gap-3 border-x border-orange-200/60">
          <span className="text-3xl text-orange">♨</span>
          <span className="font-medium text-charcoal">Made to order</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl text-orange">♨</span>
          <span className="font-medium text-charcoal">Big flavor</span>
        </div>

      </section>

      {/* Fan Favorites */}
      <section className="py-8">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-charcoal">
              Fan favorites
            </h2>
            <div className="mt-2 h-1 w-10 rounded-full bg-orange" />
          </div>

          <Link
            href="/menu"
            className="font-semibold text-orange transition hover:translate-x-1"
          >
            View all →
          </Link>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* Classic Burger */}
          <div className="flex items-center gap-4 rounded-2xl border border-orange-100 bg-white/50 p-4">
            <div className="h-28 w-28 shrink-0 rounded-xl bg-orange-50">
              {/* Add product image */}
               <Image src={heroImage} alt="burger"/>
            </div>
            <div>
              <h3 className="font-bold text-charcoal">Classic Burger</h3>
              <p className="mt-1 text-sm text-muted">
                Beef, cheddar, lettuce, tomato, house sauce
              </p>
              <p className="mt-2 font-bold text-orange">$8.99</p>
            </div>
          </div>

          {/* Bacon Burger */}
          <div className="flex items-center gap-4 rounded-2xl border border-orange-100 bg-white/50 p-4">
            <div className="h-28 w-28 shrink-0 rounded-xl bg-orange-50">
              {/* Add product image */}
               <Image src={heroImage} alt="burger"/>
            </div>
            <div>
              <h3 className="font-bold text-charcoal">Bacon Burger</h3>
              <p className="mt-1 text-sm text-muted">
                Beef, bacon, cheddar, lettuce, tomato
              </p>
              <p className="mt-2 font-bold text-orange">$10.99</p>
            </div>
          </div>

          {/* Mushroom Burger */}
          <div className="flex items-center gap-4 rounded-2xl border border-orange-100 bg-white/50 p-4">
            <div className="h-28 w-28 shrink-0 rounded-xl bg-orange-50">
              {/* Add product image */}
              <Image src={heroImage} alt="burger"/>
            </div>
            <div>
              <h3 className="font-bold text-charcoal">Mushroom Burger</h3>
              <p className="mt-1 text-sm text-muted">
                Beef, sautéed mushrooms, cheddar, lettuce
              </p>
              <p className="mt-2 font-bold text-orange">$9.99</p>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
