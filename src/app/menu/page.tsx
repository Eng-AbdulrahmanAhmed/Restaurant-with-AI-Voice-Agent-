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
  {
    id: 18,
    name: "Smoky Chipotle Ranch Burger",
    category: "Burgers",
    description: "Flame-grilled patty, chipotle ranch, pepper jack, crispy onion straws, and toasted brioche.",
    price: 11.29,
    image: "",
    badge: "Smoky Heat",
    popular: true,
    calories: "780 kcal",
    prepTime: "9-11 min",
    spicy: true,
    ingredients: ["Chipotle Ranch", "Pepper Jack", "Onion Straws"],
    aliases: ["chipotle burger", "ranch burger", "smoky burger"],
  },
  {
    id: 19,
    name: "Avocado Bacon Club Burger",
    category: "Burgers",
    description: "Grilled chicken, crispy bacon, fresh avocado, lettuce, tomato, and garlic aioli.",
    price: 12.49,
    image: "",
    badge: "Club Classic",
    popular: true,
    calories: "810 kcal",
    prepTime: "10-12 min",
    ingredients: ["Grilled Chicken", "Bacon", "Avocado", "Garlic Aioli"],
    aliases: ["avocado burger", "bacon club", "chicken club"],
  },
  {
    id: 20,
    name: "BBQ Pulled Pork Burger",
    category: "Burgers",
    description: "Slow-smoked pulled pork, tangy BBQ sauce, coleslaw, and pickles on a toasted bun.",
    price: 10.99,
    image: "",
    popular: false,
    calories: "760 kcal",
    prepTime: "8-10 min",
    ingredients: ["Pulled Pork", "BBQ Sauce", "Coleslaw"],
    aliases: ["pulled pork", "bbq pork", "pork burger"],
  },
  {
    id: 21,
    name: "Cajun Spiced Lamb Burger",
    category: "Burgers",
    description: "Spiced lamb patty, feta, tzatziki, rocket, and roasted red peppers.",
    price: 13.49,
    image: "",
    badge: "New",
    popular: false,
    calories: "720 kcal",
    prepTime: "11-13 min",
    spicy: true,
    ingredients: ["Lamb Patty", "Feta", "Tzatziki"],
    aliases: ["lamb burger", "cajun lamb"],
  },
  {
    id: 22,
    name: "Truffle Mushroom Melt",
    category: "Burgers",
    description: "Beef patty, truffle mayo, sauteed mushrooms, gruyere, and arugula.",
    price: 12.99,
    image: "",
    badge: "Truffle",
    popular: true,
    calories: "790 kcal",
    prepTime: "10-12 min",
    ingredients: ["Truffle Mayo", "Gruyere", "Mushrooms"],
    aliases: ["truffle melt", "mushroom melt"],
  },
  {
    id: 23,
    name: "Crispy Fish Fillet Burger",
    category: "Burgers",
    description: "Beer-battered fish fillet, tartar sauce, lettuce, and lemon on a soft bun.",
    price: 9.99,
    image: "",
    popular: false,
    calories: "650 kcal",
    prepTime: "9-11 min",
    ingredients: ["Fish Fillet", "Tartar Sauce", "Lemon"],
    aliases: ["fish burger", "fish fillet"],
  },
  {
    id: 24,
    name: "Buffalo Chicken Burger",
    category: "Burgers",
    description: "Crispy chicken tossed in buffalo sauce, blue cheese crumbles, and celery slaw.",
    price: 10.79,
    image: "",
    badge: "Buffalo",
    popular: true,
    calories: "730 kcal",
    prepTime: "9-11 min",
    spicy: true,
    ingredients: ["Buffalo Sauce", "Blue Cheese", "Celery Slaw"],
    aliases: ["buffalo chicken", "buffalo burger"],
  },
  {
    id: 25,
    name: "Garlic Parmesan Fries",
    category: "Sides",
    description: "Golden fries tossed in garlic butter and parmesan with a herb finish.",
    price: 4.99,
    image: "",
    popular: true,
    calories: "420 kcal",
    prepTime: "5-7 min",
    ingredients: ["Garlic Butter", "Parmesan", "Herbs"],
    aliases: ["garlic fries", "parmesan fries"],
  },
  {
    id: 26,
    name: "Loaded Nacho Fries",
    category: "Sides",
    description: "Fries loaded with cheese sauce, jalapenos, sour cream, and pico de gallo.",
    price: 6.49,
    image: "",
    badge: "Loaded",
    popular: true,
    calories: "560 kcal",
    prepTime: "6-8 min",
    spicy: true,
    ingredients: ["Cheese Sauce", "Jalapenos", "Pico de Gallo"],
    aliases: ["nacho fries", "loaded fries"],
  },
  {
    id: 27,
    name: "Sweet Potato Fries",
    category: "Sides",
    description: "Crispy sweet potato fries with a smoky chipotle dip.",
    price: 4.29,
    image: "",
    popular: false,
    calories: "380 kcal",
    prepTime: "5-7 min",
    ingredients: ["Sweet Potato", "Chipotle Dip"],
    aliases: ["sweet potato", "sweet fries"],
  },
  {
    id: 28,
    name: "Mozzarella Sticks",
    category: "Sides",
    description: "Golden fried mozzarella sticks with marinara dipping sauce.",
    price: 5.49,
    image: "",
    badge: "Cheesy",
    popular: true,
    calories: "450 kcal",
    prepTime: "5-7 min",
    ingredients: ["Mozzarella", "Marinara"],
    aliases: ["mozzarella sticks", "cheese sticks"],
  },
  {
    id: 29,
    name: "Coleslaw Cup",
    category: "Sides",
    description: "Creamy house coleslaw with a hint of apple cider vinegar.",
    price: 2.49,
    image: "",
    popular: false,
    calories: "180 kcal",
    prepTime: "2 min",
    ingredients: ["Cabbage", "Carrot", "Creamy Dressing"],
    aliases: ["coleslaw", "slaw"],
  },
  {
    id: 30,
    name: "Garden Side Salad",
    category: "Sides",
    description: "Mixed greens, cherry tomatoes, cucumber, and balsamic vinaigrette.",
    price: 3.99,
    image: "",
    popular: false,
    calories: "120 kcal",
    prepTime: "3 min",
    ingredients: ["Mixed Greens", "Cherry Tomato", "Cucumber"],
    aliases: ["side salad", "garden salad"],
  },
  {
    id: 31,
    name: "Mango Passion Smoothie",
    category: "Drinks",
    description: "Blended mango and passion fruit with yogurt and honey.",
    price: 4.79,
    image: "",
    badge: "Tropical",
    popular: true,
    calories: "210 kcal",
    prepTime: "2 min",
    ingredients: ["Mango", "Passion Fruit", "Yogurt"],
    aliases: ["mango smoothie", "passion smoothie"],
  },
  {
    id: 32,
    name: "Iced Vanilla Latte",
    category: "Drinks",
    description: "Cold espresso with vanilla syrup and milk over ice.",
    price: 3.99,
    image: "",
    popular: true,
    calories: "180 kcal",
    prepTime: "2 min",
    ingredients: ["Espresso", "Vanilla Syrup", "Milk"],
    aliases: ["vanilla latte", "iced latte"],
  },
  {
    id: 33,
    name: "Peach Iced Tea",
    category: "Drinks",
    description: "Brewed black tea with peach syrup poured over crushed ice.",
    price: 3.29,
    image: "",
    popular: false,
    calories: "95 kcal",
    prepTime: "2 min",
    ingredients: ["Black Tea", "Peach Syrup"],
    aliases: ["peach tea", "iced tea"],
  },
  {
    id: 34,
    name: "Chocolate Peanut Butter Shake",
    category: "Drinks",
    description: "Rich chocolate and peanut butter blended thick with vanilla ice cream.",
    price: 5.29,
    image: "",
    badge: "Indulgent",
    popular: true,
    calories: "520 kcal",
    prepTime: "3 min",
    ingredients: ["Chocolate", "Peanut Butter", "Vanilla Ice Cream"],
    aliases: ["chocolate shake", "peanut butter shake"],
  },
  {
    id: 35,
    name: "Fresh Orange Juice",
    category: "Drinks",
    description: "Freshly squeezed oranges served chilled over ice.",
    price: 3.49,
    image: "",
    popular: false,
    calories: "110 kcal",
    prepTime: "2 min",
    ingredients: ["Fresh Oranges"],
    aliases: ["orange juice", "fresh juice"],
  },
  {
    id: 36,
    name: "New York Cheesecake Slice",
    category: "Desserts",
    description: "Creamy cheesecake with a graham cracker crust and berry compote.",
    price: 5.49,
    image: "",
    badge: "Classic",
    popular: true,
    calories: "480 kcal",
    prepTime: "3 min",
    ingredients: ["Cream Cheese", "Graham Crust", "Berry Compote"],
    aliases: ["cheesecake", "ny cheesecake"],
  },
  {
    id: 37,
    name: "Apple Pie with Cinnamon",
    category: "Desserts",
    description: "Warm apple pie spiced with cinnamon and a scoop of vanilla ice cream.",
    price: 4.99,
    image: "",
    popular: true,
    calories: "430 kcal",
    prepTime: "4-6 min",
    ingredients: ["Apples", "Cinnamon", "Vanilla Ice Cream"],
    aliases: ["apple pie", "pie"],
  },
  {
    id: 38,
    name: "Tiramisu Cup",
    category: "Desserts",
    description: "Coffee-soaked ladyfingers layered with silky mascarpone cream.",
    price: 5.99,
    image: "",
    badge: "Italian",
    popular: false,
    calories: "410 kcal",
    prepTime: "3 min",
    ingredients: ["Ladyfingers", "Mascarpone", "Espresso"],
    aliases: ["tiramisu", "tiramisu cup"],
  },
  {
    id: 39,
    name: "Strawberry Shortcake",
    category: "Desserts",
    description: "Fluffy sponge cake layered with fresh strawberries and whipped cream.",
    price: 4.79,
    image: "",
    popular: true,
    calories: "390 kcal",
    prepTime: "3 min",
    ingredients: ["Sponge Cake", "Strawberries", "Whipped Cream"],
    aliases: ["shortcake", "strawberry cake"],
  },
  {
    id: 40,
    name: "Chocolate Lava Cake",
    category: "Desserts",
    description: "Warm chocolate cake with a molten center, served with ice cream.",
    price: 5.99,
    image: "",
    badge: "Lava",
    popular: true,
    calories: "520 kcal",
    prepTime: "6-8 min",
    ingredients: ["Dark Chocolate", "Vanilla Ice Cream"],
    aliases: ["lava cake", "chocolate lava"],
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

export default function CustomerMenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "popular" | "spicy">("all");
  const [orderType, setOrderType] = useState<"dine-in" | "takeout">("dine-in");
  const [currentPage, setCurrentPage] = useState(1);

  // AI popup state — console mounts once, toggles visibility
  const [aiOpen, setAiOpen] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);

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

  // Pagination: 9 smaller cards per page
  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, dietaryFilter]);
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
                      ? MENU_PRODUCTS.length
                      : MENU_PRODUCTS.filter((p) => p.category === label).length;
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
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3">
                {paginatedProducts.map((product) => {
                  const cartEntry = cart.find((i) => i.product.id === product.id);
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
                          ${product.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Meta chips + action footer (catalog toolbar pattern) */}
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        <span className="flex items-center gap-1 rounded-md bg-cream px-2 py-0.5 text-[10px] font-semibold text-brown/80">
                          <Beef size={10} /> {product.calories}
                        </span>
                        <span className="flex items-center gap-1 rounded-md bg-cream px-2 py-0.5 text-[10px] font-semibold text-brown/80">
                          <Clock size={10} /> {product.prepTime}
                        </span>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2.5">
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

