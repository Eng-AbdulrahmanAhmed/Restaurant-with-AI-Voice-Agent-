"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MenuProduct } from "@/types/types";
import { useCart } from "@/context/CartContext";
import { getPublicMenuProducts } from "@/services/publicMenuService";
import { useLiveKitAssistant } from "@/hooks/useLiveKitAssistant";
import { useCartBusEvent } from "@/lib/cartFeedback";
import { CartBadgeButton } from "@/components/cart/CartBadgeButton";
import { CartRowList } from "@/components/cart/CartRowList";
import { EmptyTrayState } from "@/components/cart/EmptyTrayState";
import { PriceText, AnimatedCount } from "@/components/cart/AnimatedValue";
import { QtyStepper } from "@/components/cart/QtyStepper";
type Product = MenuProduct;

import {
  Search,
  Mic,
  MicOff,
  Plus,
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
  Loader2,
  PhoneOff,
  VolumeX,
  AlertCircle,
  Drumstick,
  Pizza,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import burgerLogo from "@/assets/logo-no-background.png";
import heroImage from "@/assets/hero-image.png";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  { label: "All Items", icon: Utensils },
  { label: "Burgers", icon: Hamburger },
  { label: "Sides", icon: ShoppingBag },
  { label: "Drinks", icon: Coffee },
  { label: "Desserts", icon: IceCream },
] as const;

// Icons for categories that exist in the database but not in the core rail.
const EXTRA_CATEGORY_ICONS: Record<string, LucideIcon> = {
  Chicken: Drumstick,
  Pizza,
};

// QUICK STATS â€” same card anatomy as DashboardOverview (tinted icon chips).
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

  // AI popup state â€” console mounts once, toggles visibility
  const [aiOpen, setAiOpen] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);

  // Cart State
  const { cart, addToCart, updateCartQty, removeCartItem, clearCart, totalItemCount, subtotal } = useCart();
  const grandTotal = subtotal > 0 ? subtotal : 0;
  const router = useRouter();

  // --- Cart interaction FX -------------------------------------------------
  // Manual card flash: driven by the committed "manual add" feedback event,
  // never by the click itself (a failed add must not light up). Voice adds
  // never flash a card — their feedback lives at the cart icon.
  const [flashProductId, setFlashProductId] = useState<string | null>(null);
  useCartBusEvent((event) => {
    if (event.kind !== "add" || event.source !== "manual") return;
    setFlashProductId(event.productId ?? null);
  });

  // Voice-originated actions: the AI console (RPC handlers and the local
  // quick-command parser) goes through these wrappers, so every change keeps
  // its source and the UI can show AI-specific feedback.
  const voiceCartActions = useMemo(
    () => ({
      addToCart: (product: Product, quantity?: number, variantId?: string) =>
        addToCart(product, quantity, variantId, "voice"),
      updateCartQty: (id: string, delta: number) => updateCartQty(id, delta, "voice"),
      removeCartItem: (id: string) => removeCartItem(id, "voice"),
      clearCart: () => clearCart("voice"),
    }),
    [addToCart, updateCartQty, removeCartItem, clearCart]
  );

  const { status, error, messages, micEnabled, audioBlocked, connect, disconnect, toggleMic, enableAudio } =
    useLiveKitAssistant(
  () => ({
    items: cart,
    total: grandTotal,
    currency: "EGP",
  }),
  voiceCartActions
);

  const assistantStatusLabel =
    status === "error"
      ? "Connection failed"
      : status === "connecting"
        ? "Connecting to GrillBot..."
        : status === "waiting"
          ? "Waiting for GrillBot..."
          : status === "speaking"
            ? "GrillBot is speaking"
            : status === "listening"
              ? "GrillBot is listening"
              : "Not connected";

  const statusDotClass =
    status === "speaking"
      ? "animate-pulse bg-orange"
      : status === "listening"
        ? "bg-lettuce"
        : status === "connecting" || status === "waiting"
          ? "animate-pulse bg-gold"
          : status === "error"
            ? "bg-tomato"
            : "bg-ink/25";

  const micTitle =
    status === "error"
      ? "Connection failed"
      : status === "connecting"
        ? "Connecting..."
        : status === "waiting"
          ? "Waiting for GrillBot..."
          : status === "speaking"
            ? "GrillBot is talking..."
            : status === "listening"
              ? micEnabled
                ? "Listening to you..."
                : "Mic is muted"
              : "Tap to start talking";

  const micHint =
    status === "disconnected"
      ? "Starts a live session with the AI agent"
      : status === "error"
        ? "Tap the mic to try again"
        : status === "connecting"
          ? "Ringing the kitchen line"
          : status === "waiting"
            ? "GrillBot is joining the room"
            : status === "listening"
              ? micEnabled
                ? "Speak naturally - it hears you"
                : "Tap to unmute and speak"
              : "Reply out loud, then wait for GrillBot";

  const isSessionActive =
    status === "connecting" ||
    status === "waiting" ||
    status === "listening" ||
    status === "speaking";

  const openAiConsole = () => {
    setAiOpen(true);

    // Opening the console is what starts the session — never leave the panel
    // showing "listening" while there is no room behind it.
    if (status === "disconnected" || status === "error") {
      void connect();
    }
  };

  const minimizeAiConsole = () => {
    setAiOpen(false);
  };

  const endAiSession = () => {
    void disconnect();
    setAiOpen(false);
  };

  const handleMicClick = () => {
    if (status === "disconnected" || status === "error") {
      void connect();
      return;
    }

    if (status === "connecting") return;

    // Connected: the mic only mutes/unmutes, it must not kill the agent session.
    void toggleMic();
  };
  useEffect(() => {
    if (!products.length) return;
    let done = 0;
    const onDone = () => {
      done += 1;
      if (done >= products.length) setAllImagesLoaded(true);
    };
    const resetId = window.setTimeout(() => setAllImagesLoaded(false), 0);
    products.forEach((product) => {
      const img = new window.Image();
      img.onload = onDone;
      img.onerror = onDone;
      img.src = product.image;
    });
    return () => window.clearTimeout(resetId);
  }, [products]);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();
    getPublicMenuProducts(supabase)
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

  // AI Voice State — the live conversation comes from the LiveKit agent;
  // aiAssistantLogs only carries the local quick-command feedback.
  const [aiAssistantLogs, setAiAssistantLogs] = useState<
    { role: "user" | "bot"; text: string; time: string }[]
  >([
    {
      role: "bot",
      text: "Welcome to BurgerHouse! Tap the mic and say something like 'Add 2 classic burgers and rustic fries'.",
      time: "Ready",
    },
  ]);

  const conversation = useMemo(
    () => [
      ...aiAssistantLogs,
      ...messages.map((message) => ({
        role: message.role === "agent" ? ("bot" as const) : ("user" as const),
        text: message.text,
        time: new Date(message.at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    ].slice(-4),
    [aiAssistantLogs, messages]
  );

  // Keep the newest line of the conversation in view as the agent talks.
  const feedRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const feed = feedRef.current;
    if (feed) feed.scrollTop = feed.scrollHeight;
  }, [conversation]);

  // --------------------------------------------------------------------------
  // Cart Handlers
  // --------------------------------------------------------------------------
  // Tax temporarily disabled so the app does not charge it.
  // const tax = subtotal * 0.0825;
  // const grandTotal = subtotal > 0 ? subtotal + tax : 0;
  // const grandTotal = subtotal > 0 ? subtotal : 0;

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
      matches.forEach((m) => addToCart(m.product, m.qty, undefined, "voice"));
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

  // --------------------------------------------------------------------------
  // Filtered Products
  // --------------------------------------------------------------------------
  // Core rail + any extra category the database returns, so nothing becomes
  // unreachable when a new category is added (Chicken, Pizza, …).
  const categoryFilters = useMemo<{ label: string; icon: LucideIcon }[]>(() => {
    const core = CATEGORIES.map(({ label, icon }) => ({
      label: label as string,
      icon: icon as LucideIcon,
    }));
    const known = new Set(core.map((category) => category.label));
    const extra = [...new Set(products.map((product) => product.category))]
      .filter((label) => label && !known.has(label))
      .sort((a, b) => a.localeCompare(b))
      .map((label) => ({ label, icon: EXTRA_CATEGORY_ICONS[label] ?? Utensils }));

    return [...core, ...extra];
  }, [products]);

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
    const timeoutId = window.setTimeout(() => setCurrentPage(1), 0);
    return () => window.clearTimeout(timeoutId);
  }, [activeCategory, searchQuery, dietaryFilter, products]);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <div className="min-h-screen bg-cream text-ink selection:bg-orange selection:text-cream">
      {/* =====================================================================
          SECTION 2 â€” TOP NAVIGATION BAR (landing Navbar pattern)
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
            <CartBadgeButton
              count={totalItemCount}
              onClick={() => setTrayOpen((v) => !v)}
              ariaLabel="Open order tray"
            />
          </div>
        </div>
      </header>

      {/* =====================================================================
          SECTION 3 — ARTISAN BANNER
          Tier 1: editorial lockup + compact signature stamp.
          Tier 2: full-width spec strip with the four kitchen stats.
      ===================================================================== */}
      <section className="hero-artisan relative overflow-hidden border-b border-ink/10">
        <div className="relative mx-auto max-w-[1500px] px-6 pt-7 lg:px-10 lg:pt-9">
          <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
            <div className="min-w-0">
              {/* Eyebrow: rule · FROM THE ARTISAN MENU · ember */}
              <div className="flex items-center gap-3">
                <span className="h-px w-10 shrink-0 bg-orange/60" />
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-orange-deep sm:text-[11px]">
                  <Flame size={12} strokeWidth={2.5} className="text-orange" />
                  From the Artisan Menu
                </span>
              </div>

              <h1 className="mt-3 font-display text-3xl font-black leading-[1.1] tracking-tight text-ink sm:text-4xl xl:text-[2.75rem]">
                Flame-Seared <span className="italic text-orange-deep">Daily</span>
              </h1>
              <div className="mt-2.5 flex items-center gap-3">
                <span className="h-[2px] w-8 shrink-0 bg-orange" />
                <p className="font-display text-sm font-semibold text-brown sm:text-base">
                  Order Our Artisan Menu
                </p>
              </div>
            </div>

            {/* Compact framed stamp — deliberately small, no floating oversized art */}
            <div className="relative hidden h-24 w-24 shrink-0 sm:block lg:h-28 lg:w-28">
              <span aria-hidden className="absolute -inset-1.5 rounded-full border border-orange/30" />
              <img
                src={heroImage.src}
                alt="Signature flame-grilled burger"
                className="relative h-full w-full rounded-full border-[3px] border-cream object-cover shadow-[0_10px_22px_-10px_rgba(36,23,8,0.5)] ring-1 ring-ink/10"
              />
            </div>
          </div>

          {/* Full-width spec strip: four unchanged kitchen stats */}
          <div className="hero-spec-strip mt-7 grid grid-cols-2 border-y border-ink/10 sm:grid-cols-4">
            {RESTAURANT_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex min-w-0 items-center gap-2.5 px-3 py-2.5 sm:px-4 sm:py-3">
                  <Icon size={15} className="shrink-0 text-orange" />
                  <div className="min-w-0">
                    <p className="truncate text-[9px] font-bold uppercase tracking-[0.16em] text-brown/60">
                      {stat.label}
                    </p>
                    <p className="truncate font-display text-sm font-bold text-ink sm:text-base">
                      {stat.value}
                    </p>
                    <p className="truncate text-[10px] text-brown/60">{stat.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main layout: left filter rail + center product grid */}
      <div className="mx-auto max-w-[1500px] px-6 py-10 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* ===============================================================
              SECTION 4 â€” LEFT RAIL (search, categories, dietary filters)
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
                {categoryFilters.map(({ label, icon: Icon }) => {
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
              SECTION 5 â€” CENTER PRODUCT GRID
          ================================================================ */}
          <div className="lg:col-span-9">

            {/* Sub-section 5a â€” Product grid (photo-top cards, 3 per row) */}
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
                      onAnimationEnd={(event) => {
                        if (event.animationName === "cart-card-flash") setFlashProductId(null);
                      }}
                      className={`group flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-3 shadow-[0_10px_24px_-18px_rgba(36,23,8,0.4)] transition-all hover:-translate-y-0.5 hover:border-orange/40 hover:shadow-[0_16px_28px_-18px_rgba(36,23,8,0.5)] ${
                        flashProductId === product.id ? "cart-fx-card-flash" : ""
                      }`}
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
                          EGP {variant.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Meta chips + action footer (catalog toolbar pattern) */}
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        <span className="flex items-center gap-1 rounded-md bg-cream px-2 py-0.5 text-[10px] font-semibold text-brown/80">
                          <Beef size={10} /> {variant.calories != null ? `${variant.calories} kcal` : 'â€”'}
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
                            className="flex h-9 items-center gap-1.5 rounded-full bg-orange px-4 text-xs font-semibold text-cream shadow-[0_8px_18px_-6px_rgba(242,105,13,0.6)] transition-all hover:-translate-y-0.5 hover:bg-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange motion-reduce:hover:translate-y-0 active:translate-y-0 active:scale-95"
                          >
                            <Plus size={15} />
                            Add to Tray
                          </button>
                        ) : (
                          <QtyStepper
                            size="card"
                            quantity={qty}
                            onIncrease={() => updateCartQty(variant.id, 1)}
                            onDecrease={() => updateCartQty(variant.id, -1)}
                            increaseLabel={`Add another ${product.name}`}
                            decreaseLabel={`Remove one ${product.name}`}
                          />
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

          <div
            aria-hidden
            onClick={() => setTrayOpen(false)}
            className={`fixed inset-0 z-40 bg-ink/10 transition-opacity duration-300 ${
              trayOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          />
          <div
            className={`fixed top-[84px] right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]
                        overflow-hidden rounded-[2rem] border border-ink/10 bg-white
                        shadow-[0_24px_60px_-24px_rgba(36,23,8,0.45)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] origin-top-right
                        ${trayOpen ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-4 scale-[0.97] opacity-0"}`}
          >
            <div className="p-5">
                {/* Header + order type toggle */}
                <div className="flex items-center justify-between border-b border-ink/10 pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-bold text-cream">
                      <AnimatedCount value={totalItemCount} />
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
                <CartRowList
                  items={cart}
                  variant="tray"
                  onIncrease={(id) => updateCartQty(id, 1)}
                  onDecrease={(id) => updateCartQty(id, -1)}
                  onRemove={(id) => removeCartItem(id)}
                  className="my-3.5 max-h-56 space-y-2.5 overflow-y-auto pr-1"
                  emptyState={
                    <EmptyTrayState
                      title="Tray is hungry!"
                      description="Add items via the menu or open GrillBot below."
                    />
                  }
                />

                {/* Billing breakdown */}
                <div className="space-y-1.5 border-t border-ink/10 pt-3 text-xs font-semibold text-brown">
                  {/* Subtotal hidden while tax is disabled because it equals the total.
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-ink">EGP {subtotal.toFixed(2)}</span>
                  </div>
                  */}
                  {/* Tax temporarily disabled so the app does not charge it.
                  <div className="flex justify-between">
                    <span>Estimated Tax (8.25%)</span>
                    <span className="text-ink">EGP {tax.toFixed(2)}</span>
                  </div>
                  */}
                  {/* The total no longer needs its own top border while subtotal is hidden. */}
                  <div className="flex items-baseline justify-between text-sm font-bold text-ink">
                    <span>Total Due</span>
                    <span className="font-display text-2xl font-bold text-orange">
                      <PriceText value={grandTotal} interpolate />
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2.5">
                  <Link
                    href="/cart"
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-semibold text-ink transition hover:border-orange hover:text-orange"
                  >
                    View cart
                  </Link>
                  <button
                    type="button"
                    onClick={() => clearCart()}
                    disabled={cart.length === 0}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-bold text-brown transition hover:border-tomato hover:text-tomato disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <X size={13} strokeWidth={2.5} />
                    Clear tray
                  </button>
                </div>

                {/* Checkout CTA */}
                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={() => {
                    if (orderType === "dine-in") {
                      router.push("/table-selection");
                    } else {
                      router.push("/checkout");
                    }
                  }}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange text-xs font-extrabold uppercase tracking-wider text-cream shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)] transition-all hover:-translate-y-0.5 hover:bg-orange-deep hover:shadow-[0_14px_28px_-8px_rgba(242,105,13,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange motion-reduce:hover:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 active:translate-y-0"
                >
                  {orderType === "dine-in" ? "Choose table" : "Proceed to checkout"}
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 6 â€” FLOATING AI CONSOLE (popup on the right)
          A circular GrillBot FAB sits bottom-right; the console pops open
          above it. The panel is ALWAYS MOUNTED (only visually hidden), so a
          speech order keeps running when you minimize it.
      ===================================================================== */}
      {/* FAB */}
      <button
        type="button"
        onClick={() => {
          if (aiOpen) {
            minimizeAiConsole();
          } else {
            openAiConsole();
          }
        }}
        aria-expanded={aiOpen}
        aria-label="Open AI voice ordering console"
        className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-cream shadow-[0_14px_28px_-10px_rgba(36,23,8,0.6)] transition-all hover:-translate-y-0.5 hover:bg-orange motion-reduce:hover:translate-y-0"
      >
        {/* Hover info popup â€” only while the console is closed */}
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
              {status === "disconnected"
                ? "Tap to start a live voice session."
                : assistantStatusLabel}
            </span>
          </span>
        )}
        {!aiOpen && status === "speaking" && (
          <span className="absolute -inset-2 animate-ping rounded-full bg-orange/30" />
        )}
        {!aiOpen && isSessionActive && (
          <span
            className={`absolute right-1.5 top-1.5 h-2 w-2 rounded-full ring-2 ring-ink ${
              micEnabled ? "bg-lettuce" : "bg-gold"
            }`}
          />
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
              <p
                className="flex items-center gap-1.5 text-[10px] font-semibold text-brown"
                aria-live="polite"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass}`} />
                {assistantStatusLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSessionActive && (
              <button
                type="button"
                onClick={endAiSession}
                aria-label="End AI session"
                className="flex items-center gap-1 rounded-full bg-tomato/10 px-2.5 py-1 text-[10px] font-bold text-tomato transition hover:bg-tomato/20"
              >
                <PhoneOff size={11} />
                End
              </button>
            )}
            <button
              type="button"
              onClick={minimizeAiConsole}
              aria-label="Minimize console"
              className="flex h-7 w-7 items-center justify-center rounded-full text-brown/60 transition hover:bg-cream hover:text-ink"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="p-5">
          {error && (
            <div
              role="alert"
              className="mb-3 flex items-start gap-2 rounded-xl border border-tomato/20 bg-tomato/5 px-3 py-2 text-[11px] font-semibold text-tomato"
            >
              <AlertCircle size={13} className="mt-0.5 shrink-0" />
              <span className="flex-1 leading-relaxed">{error}</span>
              <button
                type="button"
                onClick={() => void connect()}
                className="shrink-0 underline decoration-tomato/40 underline-offset-2"
              >
                Retry
              </button>
            </div>
          )}

          {audioBlocked && (
            <button
              type="button"
              onClick={() => void enableAudio()}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gold/15 px-3 py-2 text-[11px] font-bold text-ink transition hover:bg-gold/25"
            >
              <VolumeX size={14} />
              Tap to enable sound
            </button>
          )}

          {/* Mic & wave row */}
          <div className="mb-4 flex items-center justify-between rounded-2xl bg-cream/80 p-3.5">
            <div className="flex items-center gap-3">
              <div className="relative">
                {status === "speaking" && (
                  <span className="absolute -inset-2.5 animate-ping rounded-full bg-orange/25" />
                )}
                <button
                  type="button"
                  onClick={handleMicClick}
                  aria-label={micEnabled ? "Mute microphone" : "Talk to the AI assistant"}
                  aria-pressed={micEnabled}
                  className={`relative flex h-14 w-14 items-center justify-center rounded-full text-cream shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                    micEnabled
                      ? "bg-tomato shadow-tomato/20"
                      : "bg-orange shadow-[0_8px_20px_-6px_rgba(242,105,13,0.7)]"
                  }`}
                >
                  {status === "connecting" ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : micEnabled ? (
                    <Mic size={22} />
                  ) : (
                    <MicOff size={22} />
                  )}
                </button>
              </div>
              <div>
                <p className="text-xs font-bold text-ink">{micTitle}</p>
                <p className="text-[11px] text-brown">{micHint}</p>
              </div>
            </div>

            <div className="flex h-5 items-center gap-1" aria-hidden>
              {[0.4, 0.9, 0.6, 1, 0.5].map((factor, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    status === "listening" || status === "speaking"
                      ? "animate-pulse bg-orange"
                      : "bg-ink/15"
                  }`}
                  style={{
                    height:
                      status === "listening" || status === "speaking"
                        ? `${factor * 20}px`
                        : "6px",
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
          <div
            ref={feedRef}
            className="max-h-36 space-y-2 overflow-y-auto rounded-xl border border-ink/5 bg-cream/50 p-2.5 text-xs"
          >
            {conversation.map((msg, index) => (
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


