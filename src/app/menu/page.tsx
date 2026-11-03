"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
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
  Beef,
  Bot,
  Utensils,
  Sandwich,
  ShoppingBag,
  Coffee,
  IceCream,
  Sparkles,
  ChefHat,
  Heart,
} from "lucide-react";
import burgerLogo from "@/assets/logo-no-background.png";
import burgerPhoto from "@/assets/burger-photo.png";
import heroImage from "@/assets/hero-image.png";
import friesPhoto from "@/assets/fries-photo.png";
import strawberryShake from "@/assets/strawberry-shake.png";
import cupcakeArt from "@/assets/cupcake.svg";

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

// ============================================================================
// SECTION 1 — MENU TYPES & DATA (17 hardcoded dishes)
// ============================================================================
export interface Product {
  id: number;
  name: string;
  category: "Burgers" | "Sides" | "Drinks" | "Desserts";
  description: string;
  price: number;
  image: string;
  badge?: string;
  popular?: boolean;
  calories: string;
  prepTime: string;
  ingredients: string[];
  spicy?: boolean;
  aliases: string[];
}

const MENU_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    category: "Burgers",
    description: "180g prime local beef patty, melted Wisconsin cheddar, crisp leaf lettuce, vine tomato, and signature house burger relish.",
    price: 8.99,
    image: "",
    badge: "Fan Favorite",
    popular: true,
    calories: "620 kcal",
    prepTime: "8-10 min",
    ingredients: ["180g Angus", "Aged Cheddar", "Brioche Bun", "House Relish"],
    aliases: ["classic cheeseburger", "classic burger", "cheeseburger", "burger"],
  },
  {
    id: 2,
    name: "Double Bacon BBQ Burger",
    category: "Burgers",
    description: "Twin seared flame patties, applewood-smoked bacon rashers, double American cheddar, and slow-simmered smoky bourbon glaze.",
    price: 12.99,
    image: "",
    badge: "Grill Master Pick",
    popular: true,
    calories: "890 kcal",
    prepTime: "10-12 min",
    ingredients: ["Double Patty", "Applewood Bacon", "Bourbon BBQ", "Caramelized Onion"],
    aliases: ["double bacon burger", "bacon burger", "double bacon", "bbq burger"],
  },
  {
    id: 3,
    name: "Mushroom Swiss Truffle Burger",
    category: "Burgers",
    description: "Charred Angus patty draped in sautéed garlic cremini mushrooms, melted Swiss Emmental, and black truffle aioli.",
    price: 11.49,
    image: "",
    popular: false,
    calories: "710 kcal",
    prepTime: "9-11 min",
    ingredients: ["Cremini Mushrooms", "Swiss Emmental", "Truffle Aioli", "Garlic Butter"],
    aliases: ["mushroom burger", "mushroom swiss", "truffle burger"],
  },
  {
    id: 4,
    name: "Crispy Buttermilk Hot Chicken",
    category: "Burgers",
    description: "24-hr marinated chicken thigh in herb buttermilk, hand-dredged till crispy, cayenne oil dip, house pickles, and creamy ranch slaw.",
    price: 10.49,
    image: "",
    badge: "Spicy Crunch",
    popular: true,
    calories: "740 kcal",
    prepTime: "10-12 min",
    spicy: true,
    ingredients: ["Buttermilk Thigh", "Cayenne Glaze", "Pickled Cucumbers", "Ranch Slaw"],
    aliases: ["chicken burger", "chicken sandwich", "hot chicken", "crispy chicken"],
  },
  {
    id: 5,
    name: "Island Teriyaki Chicken Grill",
    category: "Burgers",
    description: "Flame-grilled chicken thigh lacquered in house teriyaki, charred pineapple ring and wasabi mayo on a buttery bun.",
    price: 10.99,
    image: "",
    badge: "Island Glaze",
    popular: true,
    calories: "700 kcal",
    prepTime: "9-11 min",
    ingredients: ["Teriyaki Glaze", "Grilled Pineapple", "Wasabi Mayo"],
    aliases: ["teriyaki chicken", "island chicken", "pineapple chicken"],
  },
  {
    id: 6,
    name: "Garden Halloumi Smash",
    category: "Burgers",
    description: "Seared golden halloumi over smashed herbed chickpeas, cool tzatziki, crunchy baby gem and sun-dried tomato tapenade.",
    price: 9.49,
    image: "",
    badge: "Plant Power",
    popular: false,
    calories: "540 kcal",
    prepTime: "8-10 min",
    ingredients: ["Grilled Halloumi", "Herbed Chickpea", "Tzatziki"],
    aliases: ["halloumi burger", "veggie burger", "garden smash"],
  },
  {
    id: 7,
    name: "Smoky Cowboy Brisket Burger",
    category: "Burgers",
    description: "Low-and-slow smoked beef brisket, sharp cheddar, candied pickled jalapeños and a splash of espresso BBQ on a toasted brioche.",
    price: 11.99,
    image: "",
    badge: "New This Week",
    popular: false,
    calories: "820 kcal",
    prepTime: "10-12 min",
    ingredients: ["Smoked Brisket", "Sharp Cheddar", "Pickled Jalapeños"],
    aliases: ["brisket burger", "cowboy burger", "smoky burger"],
  },
  {
    id: 8,
    name: "Rustic Rosemary Sea Salt Fries",
    category: "Sides",
    description: "Hand-cut Idaho russet potatoes, double-fried in sunflower oil, dusted with freshly crushed sea salt and mountain rosemary.",
    price: 3.99,
    image: "",
    popular: true,
    calories: "340 kcal",
    prepTime: "4-6 min",
    ingredients: ["Idaho Russets", "Mountain Rosemary", "Maldon Sea Salt"],
    aliases: ["french fries", "fries", "rosemary fries", "rustic fries"],
  },
  {
    id: 9,
    name: "Truffle Parmesan Loaded Fries",
    category: "Sides",
    description: "Golden shoestring fries buried under parmesan snow, optional truffle oil drizzle and a whisper of chive dust.",
    price: 5.99,
    image: "",
    badge: "Bestseller Reload",
    popular: true,
    calories: "480 kcal",
    prepTime: "5-7 min",
    ingredients: ["Truffle Oil", "Parmesan Snow", "Chive Dust"],
    aliases: ["loaded fries", "truffle fries", "parmesan fries"],
  },
  {
    id: 10,
    name: "Beer-Battered Crisp Onion Rings",
    category: "Sides",
    description: "Jumbo Spanish sweet onions sliced thick, submerged in craft amber ale batter, served with spicy campfire smoked dip.",
    price: 4.49,
    image: "",
    popular: false,
    calories: "390 kcal",
    prepTime: "5-7 min",
    ingredients: ["Spanish Onions", "Amber Ale Batter", "Campfire Dip"],
    aliases: ["onion rings", "rings", "beer onion rings"],
  },
  {
    id: 11,
    name: "Sweet Chili Popcorn Chicken",
    category: "Sides",
    description: "Crunchy bite-size popcorn chicken tossed through sweet chili glaze and finished with toasted sesame seeds.",
    price: 4.79,
    image: "",
    popular: false,
    spicy: true,
    calories: "390 kcal",
    prepTime: "6-8 min",
    ingredients: ["Sweet Chili", "Popcorn Chicken", "Toasted Sesame"],
    aliases: ["popcorn chicken", "sweet chili chicken", "chicken bites"],
  },
  {
    id: 12,
    name: "House Sparkling Eureka Lemonade",
    category: "Drinks",
    description: "Cold-pressed coastal Eureka lemons, steeped with fresh mint leaves and lightly sweetened with unrefined cane sugar.",
    price: 3.49,
    image: "",
    badge: "Fresh Pressed",
    popular: true,
    calories: "120 kcal",
    prepTime: "2 min",
    ingredients: ["Eureka Lemons", "Fresh Mint", "Organic Cane Sugar", "Sparkling Water"],
    aliases: ["lemonade", "fresh lemonade", "sparkling lemonade"],
  },
  {
    id: 13,
    name: "Strawberry Cloud Milkshake",
    category: "Drinks",
    description: "Fresh strawberries whipped with vanilla gelato and cold milk, crowned with cream and a berry drizzle.",
    price: 4.49,
    image: "",
    badge: "Thicc & Cold",
    popular: true,
    calories: "460 kcal",
    prepTime: "3 min",
    ingredients: ["Fresh Strawberries", "Vanilla Gelato", "Whipped Cream"],
    aliases: ["strawberry milkshake", "milkshake", "strawberry shake"],
  },
  {
    id: 14,
    name: "Classic Small-Batch Craft Cola",
    category: "Drinks",
    description: "Spiced botanical cola crafted with real kola nut extract, cinnamon, vanilla pods, served over crystalline crushed ice.",
    price: 2.99,
    image: "",
    popular: false,
    calories: "140 kcal",
    prepTime: "1 min",
    ingredients: ["Kola Nut Extract", "Vanilla Bean", "Citrus Oils", "Crushed Ice"],
    aliases: ["cola", "coke", "craft cola", "soda"],
  },
  {
    id: 15,
    name: "Blueberry Hibiscus Iced Tea",
    category: "Drinks",
    description: "Steeped hibiscus blooms shaken with cool blueberry purée and sparkling spring water over crushed ice.",
    price: 3.29,
    image: "",
    popular: false,
    calories: "90 kcal",
    prepTime: "2 min",
    ingredients: ["Hibiscus Bloom", "Blueberry Purée", "Sparkling Water"],
    aliases: ["iced tea", "hibiscus tea", "blueberry tea"],
  },
  {
    id: 16,
    name: "Molten Belgian Chocolate Skillet",
    category: "Desserts",
    description: "Baked dark 70% Belgian chocolate cake with a warm flowing fudge heart, crowned with Madagascar vanilla bean gelato.",
    price: 5.99,
    image: "",
    badge: "Chef's Special",
    popular: true,
    calories: "510 kcal",
    prepTime: "6-8 min",
    ingredients: ["70% Dark Chocolate", "Vanilla Gelato", "Cocoa Crumble"],
    aliases: ["chocolate cake", "skillet cake", "molten cake", "dessert"],
  },
  {
    id: 17,
    name: "Salted Caramel Brownie Stack",
    category: "Desserts",
    description: "Warm fudge brownie squares stacked with salted caramel ribbons and a snowfall of Dutch cocoa dust.",
    price: 4.99,
    image: "",
    badge: "New Dessert",
    popular: false,
    calories: "610 kcal",
    prepTime: "4-6 min",
    ingredients: ["Fudge Brownie", "Salted Caramel", "Cocoa Dust"],
    aliases: ["brownie", "caramel brownie", "brownie stack"],
  },
];

/* Shared artwork resolver — exactly the dashboard catalog's mapping:
   Burgers alternate burger-photo.png / hero-image.png, Sides are fries,
   Drinks are the strawberry shake, Desserts use the cupcake placeholder. */
const BURGER_ART = [burgerPhoto, heroImage];
const ART_BY_CATEGORY: Record<Product["category"], StaticImageData> = {
  Burgers: burgerPhoto,
  Sides: friesPhoto,
  Drinks: strawberryShake,
  Desserts: cupcakeArt,
};
function artFor(product: Product): string {
  if (product.category === "Burgers") {
    return BURGER_ART[(product.id - 1) % BURGER_ART.length].src;
  }
  return ART_BY_CATEGORY[product.category].src;
}
MENU_PRODUCTS.forEach((p) => {
  p.image = artFor(p);
});

const CATEGORIES = [
  { label: "All Items", icon: Utensils },
  { label: "Burgers", icon: Sandwich },
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

export default function CustomerMenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "popular" | "spicy">("all");
  const [orderType, setOrderType] = useState<"dine-in" | "takeout">("dine-in");

  // AI popup state — console mounts once, toggles visibility
  const [aiOpen, setAiOpen] = useState(false);

  // Cart State
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);

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
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQty = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
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

    MENU_PRODUCTS.forEach((p) => {
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
    return MENU_PRODUCTS.filter((item) => {
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
  }, [activeCategory, searchQuery, dietaryFilter]);

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
                { label: "Dashboard", href: "/dashboard" },
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
            <div className="hidden items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-1.5 text-xs font-bold text-brown sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-lettuce" />
              Kitchen Live
            </div>
            <button
              onClick={() => {
                document.getElementById("order-tray")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="relative flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2.5 shadow-sm transition hover:border-orange lg:hidden"
            >
              <ShoppingCart size={18} className="text-orange" />
              <span className="text-xs font-bold">{totalItemCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          SECTION 3 — STATS STRIP (DashboardOverview card anatomy)
      ===================================================================== */}
      <section className="border-b border-ink/10 bg-cream-deep/40 py-6">
        <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-5">
            {RESTAURANT_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-3.5 rounded-2xl border border-ink/10 bg-white p-3.5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_32px_-22px_rgba(36,23,8,0.45)]"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-brown/70">
                      {stat.label}
                    </p>
                    <h4 className="truncate font-display text-base font-bold text-ink">
                      {stat.value}
                    </h4>
                    <p className="truncate text-[10px] text-brown/50">
                      {stat.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main 2-column layout: menu grid + sticky order tray */}
      <div className="mx-auto max-w-[1500px] px-6 py-10 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-10">
          {/* ===============================================================
              SECTION 4 — MENU COLUMN
          ================================================================ */}
          <div className="lg:col-span-8">
            {/* Header — landing heading pattern */}
            <div className="mb-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-orange-deep">
                <Flame size={13} />
                Fresh • Flame-Seared Daily
              </span>
              <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-ink sm:text-4xl xl:text-5xl">
                Order Our <span className="italic text-orange">Artisan Menu</span>
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-brown">
                Hand-pressed 180g patties, seared over glowing coals. Hit the
                GrillBot button to order with your voice, hands-free.
              </p>
            </div>

            {/* Sub-section 4a — Search & category bar (catalog header pattern) */}
            <div className="mb-6 rounded-[1.75rem] border border-ink/10 bg-white p-2.5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-1.5">
                  {CATEGORIES.map(({ label, icon: Icon }) => {
                    const active = activeCategory === label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setActiveCategory(label)}
                        className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
                          active
                            ? "bg-ink text-cream shadow-[0_8px_18px_-8px_rgba(36,23,8,0.6)]"
                            : "text-ink/70 hover:bg-orange/10 hover:text-orange"
                        }`}
                      >
                        <Icon size={16} />
                        {label}
                      </button>
                    );
                  })}
                </div>

                <div className="relative w-full shrink-0 md:w-64">
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
              </div>

              {/* Dietary filter row */}
              <div className="mt-2.5 flex items-center justify-between border-t border-ink/10 px-2 pt-2.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-brown">Filter:</span>
                  {(
                    [
                      { key: "all", label: "All items" },
                      { key: "popular", label: "⭐ Bestsellers" },
                      { key: "spicy", label: "🌶️ Spicy Picks" },
                    ] as const
                  ).map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setDietaryFilter(key)}
                      className={`rounded-full px-2.5 py-1 font-bold transition-colors ${
                        dietaryFilter === key
                          ? "bg-orange/10 text-orange-deep"
                          : "text-brown hover:text-ink"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-semibold text-brown/80">
                  {filteredProducts.length} options
                </span>
              </div>
            </div>

            {/* Sub-section 4b — Product grid (MenuCatalogGrid card anatomy:
                photo left in a cream-deep well, Fraunces title, orange price,
                divider, action footer) */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {filteredProducts.map((product) => {
                  const cartEntry = cart.find((i) => i.product.id === product.id);
                  const qty = cartEntry ? cartEntry.quantity : 0;

                  return (
                    <article
                      key={product.id}
                      className="flex flex-col rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_32px_-22px_rgba(36,23,8,0.45)]"
                    >
                      {/* Badges row */}
                      <div className="mb-4 flex items-center justify-between">
                        <span className="rounded-full bg-orange/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-orange-deep">
                          {product.category}
                        </span>
                        {product.badge && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-3 py-1 text-[11px] font-bold text-gold">
                            <Star size={11} fill="currentColor" strokeWidth={0} />
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {/* Photo left + info right */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cream-deep">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain p-1.5 drop-shadow-[0_10px_12px_rgba(36,23,8,0.18)] transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-display text-lg font-bold text-ink">
                            {product.name}
                            {product.spicy && (
                              <span title="Spicy dish" className="ml-1.5 text-sm align-middle">
                                🌶️
                              </span>
                            )}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-brown">
                            {product.description}
                          </p>
                          <p className="mt-2 font-display text-xl font-bold text-orange">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Ingredient + meta chips */}
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {product.ingredients.slice(0, 3).map((ing) => (
                          <span
                            key={ing}
                            className="rounded-md border border-ink/5 bg-cream px-2 py-0.5 text-[10px] font-medium text-brown"
                          >
                            {ing}
                          </span>
                        ))}
                        <span className="ml-auto flex items-center gap-1 rounded-md bg-cream px-2 py-0.5 text-[10px] font-semibold text-brown/80">
                          <Beef size={10} /> {product.calories}
                        </span>
                        <span className="flex items-center gap-1 rounded-md bg-cream px-2 py-0.5 text-[10px] font-semibold text-brown/80">
                          <Clock size={10} /> {product.prepTime}
                        </span>
                      </div>

                      {/* Divider + action footer (catalog toolbar pattern) */}
                      <hr className="my-4 border-ink/10" />
                      <div className="mt-auto flex items-center justify-between">
                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => addToCart(product, 1)}
                            className="flex h-9 items-center gap-1.5 rounded-full bg-orange px-4 text-xs font-semibold text-cream shadow-[0_8px_18px_-6px_rgba(242,105,13,0.6)] transition-all hover:-translate-y-0.5 hover:bg-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange motion-reduce:hover:translate-y-0 active:translate-y-0"
                          >
                            <Plus size={15} />
                            Add to Tray
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 rounded-full border border-ink/10 bg-cream p-1">
                            <button
                              type="button"
                              onClick={() => updateCartQty(product.id, -1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brown shadow-sm transition hover:bg-tomato/10 hover:text-tomato"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-6 text-center text-xs font-extrabold text-ink">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(product.id, 1)}
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
                <span className="text-4xl">🍳</span>
                <h3 className="mt-3 font-display text-lg font-bold text-ink">
                  No dishes matched your criteria
                </h3>
                <p className="mt-1 text-xs text-brown/60">
                  Try adjusting your search terms or dietary filters.
                </p>
              </div>
            )}
          </div>

          {/* ===============================================================
              SECTION 5 — ORDER TRAY (was sharing the rail with the AI
              console; the console moved to a floating popup)
          ================================================================ */}
          <aside id="order-tray" className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="rounded-[2rem] border border-ink/10 bg-white p-5 shadow-[0_18px_40px_-20px_rgba(36,23,8,0.25)]">
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
                    cart.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between gap-2.5 rounded-xl border border-ink/5 bg-cream/60 p-2"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="flex h-11 w-11 items-center justify-center rounded-lg bg-cream-deep object-contain p-1"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-xs font-bold text-ink">
                            {product.name}
                          </h4>
                          <p className="font-display text-xs font-bold text-orange">
                            ${(product.price * quantity).toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 rounded-full border border-ink/10 bg-white p-0.5">
                          <button
                            onClick={() => updateCartQty(product.id, -1)}
                            className="flex h-5 w-5 items-center justify-center rounded-full text-brown hover:bg-cream"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-4 text-center text-[11px] font-bold">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(product.id, 1)}
                            className="flex h-5 w-5 items-center justify-center rounded-full text-brown hover:bg-cream"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeCartItem(product.id)}
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
          </aside>
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
