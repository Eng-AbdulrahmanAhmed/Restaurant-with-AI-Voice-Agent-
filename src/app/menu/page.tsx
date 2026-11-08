"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MenuProduct } from "@/types/types";
import { getPublicMenuProducts } from "@/services/publicMenuService";
type Product = MenuProduct;
import {
  Search,
  ShoppingCart,
  Mic,
  MicOff,
  Plus,
  Minus,
  Trash2,
  X,
  Star,
  Flame,
  ArrowRight,
  Clock,
  SearchX,
  ChevronLeft,
  ChevronRight,
  Beef,
  Bot,
  Utensils,
  Hamburger,
  ShoppingBag,
  Coffee,
  IceCream,
  Sparkles,
  ChefHat,
  Heart,
} from "lucide-react";
import burgerLogo from "@/assets/logo-no-background.png";
import heroImage from "@/assets/hero-image.png";

/* ============================================================================
   STYLE MOD (menu design v3, single file only)
   - Hero section added with large image + heading (landing-style)
   - Product cards now photo-TOP (larger image, landing Fan-favorites style)
   - Stats strip more prominent with larger cards
   - Filter bar more compact and visually polished
   - Order tray more polished with better visual hierarchy
   - Better spacing and breathing room throughout
   - AI console floating popup (same as before)
   - Whole page uses site tokens (cream / ink / orange / brown / gold)
   - Logic untouched — styling only.
   Undo: the pre-restyle version is in git (commit e84c6d2).
============================================================================ */

const CATEGORIES = [
  { label: "All Items", icon: Utensils },
  { label: "Burgers", icon: Hamburger },
  { label: "Sides", icon: ShoppingBag },
  { label: "Drinks", icon: Coffee },
  { label: "Desserts", icon: IceCream },
] as const;

// QUICK STATS — same card anatomy as DashboardOverview (tinted icon chips).
const RESTAURANT_STATS = [
  {
    label: "Grill Status",
    value: "Live & Searing",
    sub: "Real hardwood coals",
    icon: Flame,
    color: "bg-orange/10 text-orange",
  },
  {
    label: "Kitchen Queue",
    value: "10-14 Min",
    sub: "Average order turnaround",
    icon: Clock,
    color: "bg-gold/15 text-gold",
  },
  {
    label: "Farm Fresh",
    value: "100% Angus",
    sub: "Grass-fed, never frozen",
    icon: Beef,
    color: "bg-lettuce/10 text-lettuce",
  },
  {
    label: "Menu Size",
    value: "17 Dishes",
    sub: "Across four categories",
    icon: Utensils,
    color: "bg-ink/10 text-ink",
  },
];

type CartEntry = {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  variantName: string;
  price: number;
  image: string;
  quantity: number;
};

function SkeletonMenuGrid({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          aria-hidden="true"
          className="flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-3 shadow-[0_10px_24px_-18px_rgba(36,23,8,0.4)]"
        >
          <div className="h-44 w-full animate-pulse rounded-xl bg-cream-deep" />
          <div className="mt-2.5 min-w-0 flex-1">
            <div className="h-2.5 w-20 animate-pulse rounded bg-cream-deep" />
            <div className="mt-2 h-4 w-32 animate-pulse rounded bg-cream-deep" />
            <div className="mt-2 h-3 w-full animate-pulse rounded bg-cream-deep" />
            <div className="mt-1 h-3 w-5/6 animate-pulse rounded bg-cream-deep" />
            <div className="mt-2 h-5 w-14 animate-pulse rounded bg-cream-deep" />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <div className="h-5 w-16 animate-pulse rounded-md bg-cream-deep" />
            <div className="h-5 w-12 animate-pulse rounded-md bg-cream-deep" />
          </div>
          <div className="mt-3 flex items-center justify-between pt-2.5">
            <div className="h-9 w-28 animate-pulse rounded-full bg-cream-deep" />
            <div className="h-7 w-14 animate-pulse rounded-full bg-cream-deep" />
          </div>
        </article>
      ))}
    </div>
  );
}

export default function CustomerMenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "popular" | "spicy">("all");
  const [orderType, setOrderType] = useState<"dine-in" | "takeout">("dine-in");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const selectedVariantId = (product: Product) =>
    selectedVariants[product.id] ?? product.variants[0]?.id ?? "";
  const currentVariant = (product: Product) =>
    product.variants.find((v) => v.id === selectedVariantId(product)) ?? product.variants[0];

  // AI popup state — console mounts once, toggles visibility
  const [aiOpen, setAiOpen] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);

  // Cart State
  const [cart, setCart] = useState<CartEntry[]>([]);

  useEffect(() => {
    if (!products.length) return;
    let done = 0;
    const onDone = () => {
      done += 1;
      if (done >= products.length) setAllImagesLoaded(true);
    };
    setAllImagesLoaded(false);
    products.forEach((product) => {
      const img = new window.Image();
      img.onload = onDone;
      img.onerror = onDone;
      img.src = product.image;
    });
  }, [products]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setLoadError(null);
    getPublicMenuProducts()
      .then((items) => {
        if (mounted) setProducts(items);
      })
      .catch((err) => {
        console.error("Failed to load public menu products", err);
        if (mounted) setLoadError("Could not load the menu from the database.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // AI Voice State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiAssistantLogs, setAiAssistantLogs] = useState<
    { role: "user" | "bot"; text: string; time: string }[]
  >([
    {
      role: "bot",
      text: "Welcome to BurgerHouse! Tap the microphone and say something like 'Add 2 classic burgers and rustic fries'.",
      time: "Ready",
    },
  ]);

  const recognitionRef = useRef<any>(null);

  // --------------------------------------------------------------------------
  // Cart Handlers
  // --------------------------------------------------------------------------
  const addToCart = (product: Product, quantity = 1, variantId?: string) => {
    const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === variant.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [
        ...prev,
        {
          id: variant.id,
          productId: product.id,
          variantId: variant.id,
          name: product.name,
          variantName: variant.name,
          price: variant.price,
          image: product.image,
          quantity,
        },
      ];
    });
  };

  const updateCartQty = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === cartId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartId));
  };

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );
  const tax = subtotal * 0.0825;
  const grandTotal = subtotal > 0 ? subtotal + tax : 0;
  const totalItemCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  // --------------------------------------------------------------------------
  // Voice AI Parser
  // --------------------------------------------------------------------------
  const executeVoiceOrder = (speechText: string) => {
    const raw = speechText.trim();
    if (!raw) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setAiAssistantLogs((prev) => [
      ...prev,
      { role: "user", text: raw, time: currentTime },
    ]);

    const lower = raw.toLowerCase();
    const matches: { product: Product; qty: number }[] = [];

    products.forEach((p) => {
      const foundAlias = p.aliases.find((alias) => lower.includes(alias));
      if (foundAlias) {
        let count = 1;
        const numberWords: Record<string, number> = {
          one: 1,
          two: 2,
          three: 3,
          four: 4,
          five: 5,
        };
        const words = lower.split(" ");
        const idx = words.findIndex((w) => w.includes(foundAlias.split(" ")[0]));
        if (idx > 0) {
          const prior = words[idx - 1];
          if (/^\d+$/.test(prior)) count = parseInt(prior, 10);
          else if (numberWords[prior]) count = numberWords[prior];
        }
        matches.push({ product: p, qty: count });
      }
    });

    if (matches.length > 0) {
      matches.forEach((m) => addToCart(m.product, m.qty));
      const summary = matches
        .map((m) => `${m.qty}x ${m.product.name}`)
        .join(", ");
      setAiAssistantLogs((prev) => [
        ...prev,
        {
          role: "bot",
          text: `Added ${summary} straight to your tray. Anything else for you?`,
          time: currentTime,
        },
      ]);
    } else {
      setAiAssistantLogs((prev) => [
        ...prev,
        {
          role: "bot",
          text: "I couldn't match that to an item on our menu. Try 'Double Bacon BBQ Burger' or 'Rosemary Fries'!",
          time: currentTime,
        },
      ]);
    }
  };

  const toggleMicListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    recognitionRef.current = rec;

    rec.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    rec.onresult = (evt: any) => {
      const curIndex = evt.resultIndex;
      const heard = evt.results[curIndex][0].transcript;
      setTranscript(heard);
      if (evt.results[curIndex].isFinal) {
        executeVoiceOrder(heard);
        setTranscript("");
      }
    };

    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    rec.start();
  };

  // --------------------------------------------------------------------------
  // Filtered Products
  // --------------------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCat =
        activeCategory === "All Items" || item.category === activeCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ingredients.some((ing) =>
          ing.toLowerCase().includes(searchQuery.toLowerCase())
        );

      let matchDietary = true;
      if (dietaryFilter === "popular") matchDietary = !!item.popular;
      if (dietaryFilter === "spicy") matchDietary = !!item.spicy;

      return matchCat && matchSearch && matchDietary;
    });
  }, [activeCategory, searchQuery, dietaryFilter, products]);

  // Pagination: 9 smaller cards per page
  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, dietaryFilter, products]);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <div className="min-h-screen bg-cream text-ink selection:bg-orange selection:text-cream">
      {/* =====================================================================
          SECTION 2 — TOP NAVIGATION BAR (landing Navbar pattern)
      ===================================================================== */}
      <header className="sticky top-0 z-40 border-b border-ink/[0.06] bg-cream/90 shadow-[0_1px_0_0_rgba(36,23,8,0.04)] backdrop-blur-md">
        <div className="mx-auto grid h-[72px] max-w-[1500px] grid-cols-[auto_1fr_auto] items-center gap-4 px-6 lg:px-10">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Image
                alt="BurgerHouse logo"
                className="mr-2"
                src={burgerLogo}
                width={40}
                height={40}
              />
              <span className="font-display text-xl font-bold tracking-tight text-ink">
                Burger<span className="text-orange">House.</span>
              </span>
            </Link>
          </div>

          <nav className="hidden justify-center md:flex">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm font-medium text-ink/80">
              {[
                { label: "Home", href: "/" },
                { label: "Artisan Menu", href: "/menu", active: true },
                { label: "Our Story", href: "/about" },
              ].map(({ label, href, ...rest }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className={
                      "relative " +
                      ((rest as { active?: boolean }).active
                        ? "font-semibold text-orange after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-orange"
                        : "transition-colors hover:text-orange after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-orange after:transition-all after:duration-300 hover:after:w-full")
                    }
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTrayOpen((v) => !v)}
              className="relative flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2.5 shadow-sm transition hover:border-orange"
            >
              <ShoppingCart size={18} className="text-orange" />
              <span className="text-xs font-bold">{totalItemCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          SECTION 3 — COMPACT HERO BAR (animated gradient, blobs, burger art)
      ===================================================================== */}
      <section className="relative overflow-hidden border-b border-ink/10 bg-cream-deep/40 py-7">
        {/* animated gradient wash + drifting blobs */}
        <div className="animate-gradient-x absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(242,105,13,0.12)_38%,transparent_65%,rgba(36,23,8,0.05)_100%)]" />
        <div className="animate-blob absolute -left-16 -top-20 h-64 w-64 rounded-full bg-orange/15 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute right-32 top-10 h-56 w-56 rounded-full bg-tomato/10 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute bottom-[-3rem] left-1/3 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1500px] grid-cols-[1fr_auto] items-center gap-6 px-6 lg:px-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-deep shadow-sm">
              <Flame size={12} />
              Flame-Seared Daily
            </span>
            <h1 className="mt-2.5 font-display text-2xl font-black tracking-tight text-ink sm:text-3xl xl:text-4xl">
              Order Our{" "}
              <span className="animate-gradient-x bg-[linear-gradient(90deg,var(--color-orange-deep),var(--color-gold),var(--color-tomato))] bg-clip-text text-transparent italic">
                Artisan Menu
              </span>
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {RESTAURANT_STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <span
                    key={stat.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-brown shadow-sm backdrop-blur-sm"
                  >
                    <Icon size={13} className="text-orange" />
                    {stat.label}
                    <strong className="font-display font-bold text-ink">{stat.value}</strong>
                  </span>
                );
              })}
            </div>
          </div>

          {/* floating burger art */}
          <div className="relative hidden h-36 w-36 shrink-0 sm:block lg:h-40 lg:w-40">
            <div className="animate-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-orange/30" />
            <div className="animate-float relative h-full w-full">
              <img
                src={heroImage.src}
                alt="Signature flame-grilled burger"
                className="h-full w-full rounded-full object-cover shadow-[0_18px_36px_-14px_rgba(36,23,8,0.45)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main layout: left filter rail + center product grid */}
      <div className="mx-auto max-w-[1500px] px-6 py-10 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* ===============================================================
              SECTION 4 — LEFT RAIL (search, categories, dietary filters)
          ================================================================ */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)]">
              {/* Search input */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown/50"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dishes or buns..."
                  className="h-10 w-full rounded-full border border-ink/10 bg-cream pl-9 pr-8 text-xs font-medium text-ink outline-none transition placeholder:text-brown/50 focus:border-orange focus:bg-white focus:ring-2 focus:ring-orange/30"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/50 hover:text-ink"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category list with count badges */}
              <div className="mt-4 space-y-1">
                {CATEGORIES.map(({ label, icon: Icon }) => {
                  const active = activeCategory === label;
                  const count =
                    label === "All Items"
                      ? products.length
                      : products.filter((p) => p.category === label).length;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setActiveCategory(label)}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                        active
                          ? "bg-ink text-cream shadow-[0_8px_18px_-8px_rgba(36,23,8,0.6)]"
                          : "text-ink/70 hover:bg-orange/10 hover:text-orange"
                      }`}
                    >
                      <Icon size={16} />
                      <span className="flex-1 text-left">{label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          active ? "bg-cream/20 text-cream" : "bg-cream-deep text-brown"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dietary filter pills */}
              <div className="mt-4 flex items-center gap-1.5 border-t border-ink/10 pt-3.5">
                {(
                  [
                    { key: "all", label: "All items", icon: Utensils },
                    { key: "popular", label: "Bestsellers", icon: Star },
                    { key: "spicy", label: "Spicy", icon: Flame },
                  ] as const
                ).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDietaryFilter(key)}
                    className={`flex h-8 flex-1 items-center justify-center gap-1 rounded-full text-[11px] font-bold transition-all duration-200 ${
                      dietaryFilter === key
                        ? "bg-orange text-cream shadow-[0_8px_18px_-8px_rgba(242,105,13,0.7)]"
                        : "bg-cream text-brown hover:bg-orange/10 hover:text-orange"
                    }`}
                    title={label}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ===============================================================
              SECTION 5 — CENTER PRODUCT GRID
          ================================================================ */}
          <div className="lg:col-span-9">

            {/* Sub-section 5a — Product grid (photo-top cards, 3 per row) */}
            {loading || (products.length > 0 && !allImagesLoaded) ? (
              <SkeletonMenuGrid count={9} />
            ) : loadError ? (
              <p role="alert" className="py-10 text-center text-sm text-tomato">{loadError}</p>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3">
                {paginatedProducts.map((product) => {
                  const variant = currentVariant(product);
                  const selectedId = selectedVariantId(product);
                  const cartEntry = cart.find((i) => i.variantId === variant.id);
                  const qty = cartEntry ? cartEntry.quantity : 0;

                  return (
                    <article
                      key={product.id}
                      className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-3 shadow-[0_10px_24px_-18px_rgba(36,23,8,0.4)] transition-all hover:-translate-y-0.5 hover:border-orange/40 hover:shadow-[0_16px_28px_-18px_rgba(36,23,8,0.5)]"
                    >
                      {/* Photo top */}
                      <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl bg-cream-deep">
                        {product.popular && (
                          <span
                            title="Bestseller"
                            className="absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gold/25 text-gold shadow-sm"
                          >
                            <Star size={12} fill="currentColor" strokeWidth={0} />
                          </span>
                        )}
                        {product.spicy && (
                          <span
                            title="Spicy dish"
                            className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-tomato/15 text-tomato shadow-sm"
                          >
                            <Flame size={12} />
                          </span>
                        )}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Variant picker */}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brown/50">Variant</span>
                        {product.variants.map((v) => {
                          const active = v.id === selectedId;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => setSelectedVariants((prev) => ({ ...prev, [product.id]: v.id }))}
                              className={`rounded-full border px-2 py-1 text-[10px] font-semibold transition-all duration-200 ${
                                active
                                  ? "border-ink bg-ink text-cream"
                                  : "border-ink/10 bg-cream text-brown/70 hover:border-orange hover:text-orange"
                              }`}
                            >
                              {v.name}
                            </button>
                          );
                        })}
                      </div>

                      {/* Info */}
                      <div className="mt-2.5 flex min-w-0 flex-1 flex-col">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-orange-deep">
                          {product.category}
                        </span>
                        <h3 className="mt-0.5 truncate font-display text-sm font-bold text-ink">
                          {product.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-brown">
                          {product.description}
                        </p>
                        <p className="mt-1.5 font-display text-base font-bold text-orange">
                          ${variant.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Meta chips + action footer (catalog toolbar pattern) */}
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        <span className="flex items-center gap-1 rounded-md bg-cream px-2 py-0.5 text-[10px] font-semibold text-brown/80">
                          <Beef size={10} /> {variant.calories != null ? `${variant.calories} kcal` : '—'}
                        </span>
                        <span className="flex items-center gap-1 rounded-md bg-cream px-2 py-0.5 text-[10px] font-semibold text-brown/80">
                          <Clock size={10} /> {product.prepTime}
                        </span>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2.5">
                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => addToCart(product, 1, selectedId)}
                            className="flex h-9 items-center gap-1.5 rounded-full bg-orange px-4 text-xs font-semibold text-cream shadow-[0_8px_18px_-6px_rgba(242,105,13,0.6)] transition-all hover:-translate-y-0.5 hover:bg-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange motion-reduce:hover:translate-y-0 active:translate-y-0"
                          >
                            <Plus size={15} />
                            Add to Tray
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 rounded-full border border-ink/10 bg-cream p-1">
                            <button
                              type="button"
                              onClick={() => updateCartQty(variant.id, -1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brown shadow-sm transition hover:bg-tomato/10 hover:text-tomato"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-6 text-center text-xs font-extrabold text-ink">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(variant.id, 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-orange text-cream shadow-sm transition hover:bg-orange-deep"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        )}

                        {qty > 0 && (
                          <span className="text-[11px] font-semibold text-brown/70">
                            in tray
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-ink/15 bg-white/60 p-12 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange/10 text-orange">
                  <SearchX size={26} strokeWidth={2.2} />
                </span>
                <h3 className="mt-3 font-display text-lg font-bold text-ink">
                  No dishes matched your criteria
                </h3>
                <p className="mt-1 text-xs text-brown/60">
                  Try adjusting your search terms or dietary filters.
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > ITEMS_PER_PAGE && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 bg-white text-brown transition-colors hover:border-orange hover:text-orange disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 ${
                      page === currentPage
                        ? "bg-ink text-cream shadow-[0_4px_12px_-4px_rgba(36,23,8,0.4)]"
                        : "border border-ink/10 bg-white text-brown hover:border-orange hover:text-orange"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 bg-white text-brown transition-colors hover:border-orange hover:text-orange disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
            {filteredProducts.length > 0 && (
              <p className="mt-2 text-center text-[11px] text-brown/60">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of{" "}
                {filteredProducts.length} dishes
              </p>
            )}
          </div>

          {/* ===============================================================
              SECTION 6 — ORDER TRAY POPUP (opened from the navbar cart
              button; ALWAYS MOUNTED, only visually hidden)
          ================================================================ */}
          <div
            className={`fixed top-[84px] right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]
                        overflow-hidden rounded-[2rem] border border-ink/10 bg-white
                        shadow-[0_24px_60px_-24px_rgba(36,23,8,0.45)] transition-all duration-300
                        ${trayOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"}`}
          >
            <div className="p-5">
                {/* Header + order type toggle */}
                <div className="flex items-center justify-between border-b border-ink/10 pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-bold text-cream">
                      {totalItemCount}
                    </span>
                    <h3 className="font-display text-base font-bold text-ink">
                      Your Order Tray
                    </h3>
                  </div>

                  <div className="flex rounded-full border border-ink/10 bg-cream p-0.5 text-[11px] font-bold">
                    <button
                      onClick={() => setOrderType("dine-in")}
                      className={`rounded-full px-2.5 py-1 transition ${
                        orderType === "dine-in"
                          ? "bg-ink text-cream shadow-sm"
                          : "text-brown"
                      }`}
                    >
                      Dine In
                    </button>
                    <button
                      onClick={() => setOrderType("takeout")}
                      className={`rounded-full px-2.5 py-1 transition ${
                        orderType === "takeout"
                          ? "bg-ink text-cream shadow-sm"
                          : "text-brown"
                      }`}
                    >
                      Takeout
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTrayOpen(false)}
                    aria-label="Close order tray"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-brown/60 transition hover:bg-cream hover:text-ink"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Items list */}
                <div className="my-3.5 max-h-56 space-y-2.5 overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="py-8 text-center text-xs text-brown">
                      <p className="font-display text-sm font-bold text-ink">
                        Tray is hungry!
                      </p>
                      <p className="mt-0.5">
                        Add items via the menu or open GrillBot below.
                      </p>
                    </div>
                  ) : (
                    cart.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between gap-2.5 rounded-xl border border-ink/5 bg-cream/60 p-2"
                      >
                        <img
                          src={entry.image}
                          alt={entry.name}
                          className="flex h-11 w-11 items-center justify-center rounded-lg bg-cream-deep object-contain p-1"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-xs font-bold text-ink">
                            {entry.name}
                            {entry.variantName ? ` · ${entry.variantName}` : ""}
                          </h4>
                          <p className="font-display text-xs font-bold text-orange">
                            ${(entry.price * entry.quantity).toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 rounded-full border border-ink/10 bg-white p-0.5">
                          <button
                            onClick={() => updateCartQty(entry.id, -1)}
                            className="flex h-5 w-5 items-center justify-center rounded-full text-brown hover:bg-cream"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-4 text-center text-[11px] font-bold">
                            {entry.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(entry.id, 1)}
                            className="flex h-5 w-5 items-center justify-center rounded-full text-brown hover:bg-cream"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeCartItem(entry.id)}
                          className="text-brown/50 transition-colors hover:text-tomato"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Billing breakdown */}
                <div className="space-y-1.5 border-t border-ink/10 pt-3 text-xs font-semibold text-brown">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-ink">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (8.25%)</span>
                    <span className="text-ink">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-ink/10 pt-2 text-sm font-bold text-ink">
                    <span>Total Due</span>
                    <span className="font-display text-2xl font-bold text-orange">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={() =>
                    alert("Ticket sent to the kitchen! Your order is being grilled.")
                  }
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange text-xs font-extrabold uppercase tracking-wider text-cream shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)] transition-all hover:-translate-y-0.5 hover:bg-orange-deep hover:shadow-[0_14px_28px_-8px_rgba(242,105,13,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange motion-reduce:hover:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 active:translate-y-0"
                >
                  Fire Up Order
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 6 — FLOATING AI CONSOLE (popup on the right)
          A circular GrillBot FAB sits bottom-right; the console pops open
          above it. The panel is ALWAYS MOUNTED (only visually hidden), so a
          speech order keeps running when you minimize it.
      ===================================================================== */}
      {/* FAB */}
      <button
        type="button"
        onClick={() => setAiOpen((v) => !v)}
        aria-expanded={aiOpen}
        aria-label="Open AI voice ordering console"
        className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-cream shadow-[0_14px_28px_-10px_rgba(36,23,8,0.6)] transition-all hover:-translate-y-0.5 hover:bg-orange motion-reduce:hover:translate-y-0"
      >
        {/* Hover info popup — only while the console is closed */}
        {!aiOpen && (
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-full right-0 mb-3 w-56 translate-y-2 rounded-2xl border border-ink/10 bg-white p-3 text-left opacity-0 shadow-[0_18px_40px_-16px_rgba(36,23,8,0.45)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-orange-deep">
              <Bot size={13} />
              AI Voice GrillBot
            </span>
            <span className="mt-1 block text-[11px] leading-relaxed text-brown">
              Say your order with your voice - hands-free.
            </span>
          </span>
        )}
        {isListening && !aiOpen && (
          <span className="absolute -inset-2 animate-ping rounded-full bg-orange/30" />
        )}
        {aiOpen ? (
          <X size={22} />
        ) : (
          <>
            <Bot size={22} />
            <Sparkles
              size={13}
              className="absolute right-3 top-3 text-gold transition-transform group-hover:scale-125"
            />
          </>
        )}
      </button>

      {/* Popup panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]
                    overflow-hidden rounded-[2rem] border border-ink/10 bg-white
                    shadow-[0_24px_60px_-24px_rgba(36,23,8,0.45)] transition-all duration-300
                    ${aiOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between border-b border-ink/10 bg-cream/60 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange/10 text-orange">
              <Bot size={18} />
            </span>
            <div>
              <h3 className="font-display text-sm font-bold text-ink">
                AI Voice Grill Master
              </h3>
              <p className="flex items-center gap-1.5 text-[10px] font-semibold text-brown">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isListening ? "animate-ping bg-tomato" : "bg-lettuce"
                  }`}
                />
                {isListening ? "Listening live..." : "Speech Engine Active"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isListening && (
              <button
                type="button"
                onClick={() => {
                  recognitionRef.current?.stop();
                  setIsListening(false);
                }}
                className="rounded-full bg-tomato/10 px-2.5 py-1 text-[10px] font-bold text-tomato transition hover:bg-tomato/20"
              >
                Stop
              </button>
            )}
            <button
              type="button"
              onClick={() => setAiOpen(false)}
              aria-label="Minimize console"
              className="flex h-7 w-7 items-center justify-center rounded-full text-brown/60 transition hover:bg-cream hover:text-ink"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="p-5">
          {/* Mic & wave row */}
          <div className="mb-4 flex items-center justify-between rounded-2xl bg-cream/80 p-3.5">
            <div className="flex items-center gap-3">
              <div className="relative">
                {isListening && (
                  <span className="absolute -inset-2.5 animate-ping rounded-full bg-tomato/30" />
                )}
                <button
                  type="button"
                  onClick={toggleMicListening}
                  aria-label="Toggle voice order assistant"
                  className={`relative flex h-14 w-14 items-center justify-center rounded-full text-cream shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                    isListening
                      ? "bg-tomato shadow-tomato/20"
                      : "bg-orange shadow-[0_8px_20px_-6px_rgba(242,105,13,0.7)]"
                  }`}
                >
                  {isListening ? (
                    <MicOff size={22} className="animate-pulse" />
                  ) : (
                    <Mic size={22} />
                  )}
                </button>
              </div>
              <div>
                <p className="text-xs font-bold text-ink">
                  {isListening ? "Listening to order..." : "Tap to Speak Order"}
                </p>
                <p className="text-[11px] text-brown">
                  {transcript ? `“${transcript}”` : "Say quantities + dishes"}
                </p>
              </div>
            </div>

            <div className="flex h-5 items-center gap-1">
              {[0.4, 0.9, 0.6, 1, 0.5].map((factor, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    isListening ? "animate-pulse bg-orange" : "bg-ink/15"
                  }`}
                  style={{
                    height: isListening ? `${factor * 20}px` : "6px",
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Suggested voice commands */}
          <div className="mb-3">
            <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-brown/75">
              Suggested voice commands:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                "2 Classic Cheeseburgers",
                "Double Bacon with Fries",
                "Strawberry Milkshake",
              ].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => executeVoiceOrder(cmd)}
                  className="rounded-full border border-ink/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-brown transition hover:border-orange hover:text-orange"
                >
                  ✦ &ldquo;{cmd}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Conversation feed */}
          <div className="max-h-36 space-y-2 overflow-y-auto rounded-xl border border-ink/5 bg-cream/50 p-2.5 text-xs">
            {aiAssistantLogs.slice(-3).map((msg, index) => (
              <div
                key={index}
                className={`rounded-lg p-2 leading-relaxed ${
                  msg.role === "user"
                    ? "ml-4 bg-ink text-cream"
                    : "mr-4 bg-white text-ink shadow-sm"
                }`}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">
                  {msg.role === "user" ? "You" : "GrillBot"}
                </span>
                <p className="mt-0.5">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


