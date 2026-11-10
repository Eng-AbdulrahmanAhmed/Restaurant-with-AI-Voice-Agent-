"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Search,
  Clock,
  Check,
  ChefHat,
  X,
  Plus,
} from "lucide-react";

type OrderStatus = "new" | "preparing" | "ready" | "served";

type OrderItem = {
  name: string;
  qty: number;
  price: number;
};

type Order = {
  id: string;
  customer: string;
  type: "Dine-in" | "Takeaway";
  table: string | null;
  items: OrderItem[];
  placed: string;
  status: OrderStatus;
};

const initialOrders: Order[] = [
  {
    id: "#1056",
    customer: "Table 4",
    type: "Dine-in",
    table: "T-04",
    placed: "2 min ago",
    status: "new",
    items: [
      { name: "Double Bacon BBQ", qty: 2, price: 13.5 },
      { name: "Rosemary Fries", qty: 1, price: 5.5 },
    ],
  },
  {
    id: "#1055",
    customer: "Takeaway",
    type: "Takeaway",
    table: null,
    placed: "5 min ago",
    status: "preparing",
    items: [
      { name: "Classic Cheeseburger", qty: 1, price: 9.0 },
      { name: "Strawberry Shake", qty: 1, price: 6.0 },
    ],
  },
  {
    id: "#1054",
    customer: "Table 2",
    type: "Dine-in",
    table: "T-02",
    placed: "8 min ago",
    status: "preparing",
    items: [
      { name: "Mushroom Melt", qty: 1, price: 11.5 },
      { name: "Onion Rings", qty: 1, price: 4.5 },
      { name: "Lemonade", qty: 2, price: 3.5 },
    ],
  },
  {
    id: "#1053",
    customer: "Table 7",
    type: "Dine-in",
    table: "T-07",
    placed: "11 min ago",
    status: "ready",
    items: [{ name: "Smoky BBQ Stack", qty: 2, price: 12.5 }],
  },
  {
    id: "#1052",
    customer: "Takeaway",
    type: "Takeaway",
    table: null,
    placed: "14 min ago",
    status: "ready",
    items: [
      { name: "Crispy Chicken Burger", qty: 1, price: 10.5 },
      { name: "Sweet Potato Fries", qty: 1, price: 5.0 },
    ],
  },
  {
    id: "#1051",
    customer: "Table 1",
    type: "Dine-in",
    table: "T-01",
    placed: "18 min ago",
    status: "served",
    items: [
      { name: "Classic Cheeseburger", qty: 2, price: 9.0 },
      { name: "Chocolate Brownie", qty: 1, price: 5.5 },
    ],
  },
  {
    id: "#1050",
    customer: "Table 9",
    type: "Dine-in",
    table: "T-09",
    placed: "23 min ago",
    status: "served",
    items: [
      { name: "Veggie Grill", qty: 1, price: 9.5 },
      { name: "House Salad", qty: 1, price: 4.5 },
    ],
  },
];

const statusLabels: Record<OrderStatus, string> = {
  new: "New",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
};

const statusStyles: Record<OrderStatus, string> = {
  new: "bg-gold/15 text-gold",
  preparing: "bg-orange/10 text-orange-deep",
  ready: "bg-lettuce/10 text-lettuce",
  served: "bg-ink/5 text-brown",
};

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  new: "preparing",
  preparing: "ready",
  ready: "served",
  served: null,
};

const nextLabel: Record<OrderStatus, string> = {
  new: "Start preparing",
  preparing: "Mark ready",
  ready: "Mark served",
  served: "Completed",
};

const filterButtons: { label: string; value: "all" | OrderStatus }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Served", value: "served" },
];

function orderTotal(order: Order) {
  return order.items.reduce((sum, item) => sum + item.qty * item.price, 0);
}

export default function LiveOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      total: orders.length,
      new: orders.filter((order) => order.status === "new").length,
      preparing: orders.filter((order) => order.status === "preparing").length,
      ready: orders.filter((order) => order.status === "ready").length,
    }),
    [orders]
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = filter === "all" || order.status === filter;
      const matchesSearch =
        !term ||
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        (order.table ?? "").toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [orders, filter, query]);

  function advance(id: string) {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== id) return order;
        const next = nextStatus[order.status];
        return next ? { ...order, status: next } : order;
      })
    );
  }

  function voidTicket(id: string) {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  }

  return (
    <main className="space-y-7 px-6 pt-10 pb-12 lg:px-10">
      <section className="space-y-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brown/70 transition-colors hover:text-orange"
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-deep">
              <ShoppingBag size={13} strokeWidth={2.5} />
              Kitchen Display
            </p>
            <h1 className="mt-1 font-display text-3xl font-black tracking-tight text-ink lg:text-4xl">
              Live <span className="italic text-orange">Orders</span>
            </h1>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-brown">
              Track every ticket from the pass to the table. Update a status as the kitchen moves.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-orange px-5 py-2.5 text-xs font-semibold text-cream shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)] transition hover:bg-orange-deep sm:self-auto"
          >
            <Plus size={15} strokeWidth={2.5} />
            New Order
          </button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Open Tickets", value: counts.total, icon: ShoppingBag, iconStyle: "bg-orange/10 text-orange" },
          { label: "New", value: counts.new, icon: Clock, iconStyle: "bg-gold/15 text-gold" },
          { label: "Preparing", value: counts.preparing, icon: ChefHat, iconStyle: "bg-orange/10 text-orange-deep" },
          { label: "Ready to Serve", value: counts.ready, icon: Check, iconStyle: "bg-lettuce/10 text-lettuce" },
        ].map(({ label, value, icon: Icon, iconStyle }) => (
          <div
            key={label}
            className="group rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)] transition-all hover:-translate-y-0.5 hover:border-orange/20 hover:shadow-[0_20px_32px_-24px_rgba(36,23,8,0.45)]"
          >
            <div className={"flex h-9 w-9 items-center justify-center rounded-xl " + iconStyle + " transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"}>
              <Icon size={17} strokeWidth={2} />
            </div>
            <p className="mt-3 text-[11px] font-medium text-brown/70 transition-colors duration-200 group-hover:text-orange-deep">{label}</p>
            <p className="mt-0.5 font-display text-2xl font-bold text-ink transition-colors duration-200 group-hover:text-orange">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown/50" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by order, table, or customer..."
            className="h-11 w-full rounded-full border border-ink/10 bg-white pl-11 pr-4 text-sm text-ink placeholder:text-brown/50 outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/30"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filterButtons.map(({ label, value }) => {
            const isActive = filter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={
                  "rounded-full px-4 py-2 text-[11px] font-bold transition-all duration-200 " +
                  (isActive
                    ? "bg-ink text-cream shadow-[0_8px_18px_-8px_rgba(36,23,8,0.6)]"
                    : "border border-ink/10 bg-white text-brown/70 hover:border-orange hover:text-orange")
                }
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-white p-12 text-center text-sm text-brown/60">
          No orders match that filter. Try another status or search term.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((order) => {
          const next = nextStatus[order.status];
          return (
            <article
              key={order.id}
              className="group rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-[0_14px_30px_-24px_rgba(36,23,8,0.35)] transition-all hover:-translate-y-0.5 hover:border-orange/20 hover:shadow-[0_20px_32px_-24px_rgba(36,23,8,0.45)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-base font-bold text-ink">
                    {order.id}
                    <span className="ml-2 text-[11px] font-medium text-brown/60">
                      {order.type}
                      {order.table ? " · " + order.table : ""}
                    </span>
                  </h2>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] text-brown/60">
                    <Clock size={12} strokeWidth={2.5} />
                    {order.placed}
                  </p>
                </div>
                <span
                  className={"shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold " + statusStyles[order.status]}
                >
                  {statusLabels[order.status]}
                </span>
              </div>

              <ul className="mt-3 space-y-1.5 border-t border-ink/5 pt-3">
                {order.items.map((item) => (
                  <li key={item.name} className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-ink/80">
                      <span className="font-semibold text-ink">{item.qty}x</span> {item.name}
                    </span>
                    <span className="font-semibold text-brown/70">
                      {"EGP " + (item.qty * item.price).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-3">
                <span className="text-[11px] font-medium text-brown/60">
                  {order.items.reduce((sum, item) => sum + item.qty, 0)} items
                </span>
                <span className="font-display text-lg font-bold text-ink">
                  {"EGP " + orderTotal(order).toFixed(2)}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {next ? (
                  <button
                    type="button"
                    onClick={() => advance(order.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-orange px-3.5 py-2 text-[11px] font-semibold text-cream transition hover:bg-orange-deep"
                  >
                    <Check size={13} strokeWidth={2.5} />
                    {nextLabel[order.status]}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-lettuce">
                    <Check size={13} strokeWidth={2.5} />
                    Completed
                  </span>
                )}

                {order.status !== "served" && (
                  <button
                    type="button"
                    onClick={() => voidTicket(order.id)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-semibold text-tomato transition hover:bg-tomato/10"
                  >
                    <X size={13} strokeWidth={2.5} />
                    Void
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
