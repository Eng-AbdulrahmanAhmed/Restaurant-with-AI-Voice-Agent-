import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

/* ============================================================================
   DASHBOARD ORDERS — SAMPLE DATA ONLY.
   Placeholder list until the real orders table/flow is implemented.
   The "View orders" link goes to /dashboard/live-orders.
   ============================================================================ */

const orders = [
  { id: "#1042", customer: "Table 4", items: 3, total: 24.5, status: "Preparing" },
  { id: "#1041", customer: "Takeaway", items: 1, total: 9.0, status: "Ready" },
  { id: "#1040", customer: "Table 2", items: 4, total: 31.75, status: "Served" },
  { id: "#1039", customer: "Table 7", items: 2, total: 18.2, status: "Served" },
];

const statusStyles: Record<string, string> = {
  Preparing: "bg-gold/15 text-gold",
  Ready: "bg-lettuce/10 text-lettuce",
  Served: "bg-ink/5 text-brown",
};

export default function DashboardOrders() {
  return (
    <section className="flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)] transition-all duration-300 hover:border-orange/20 hover:shadow-[0_20px_36px_-24px_rgba(36,23,8,0.45)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange/10 text-orange">
            <ShoppingBag size={17} strokeWidth={2} />
          </span>

          <div>
            <h3 className="font-display text-base font-bold text-ink">
              Recent Orders
            </h3>
            <p className="text-[11px] text-brown/70">Sample data · latest 4</p>
          </div>
        </div>

        <Link
          href="/dashboard/live-orders"
          className="group inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[11px] font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-orange/40 hover:text-orange"
        >
          View orders
          <ArrowRight
            size={13}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="mt-3 flex-1 divide-y divide-ink/5">
        {orders.map((order) => (
          <div
            key={order.id}
            className="group/order -mx-2 flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition-colors duration-200 hover:bg-cream/60"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tabular-nums text-ink">
                {order.id}{" "}
                <span className="font-normal text-brown/50">
                  · {order.customer}
                </span>
              </p>
              <p className="text-[11px] tabular-nums text-brown/70">
                {order.items} {order.items === 1 ? "item" : "items"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2.5">
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-bold transition-transform duration-200 group-hover/order:scale-105 ${statusStyles[order.status]}`}
              >
                {order.status}
              </span>

              <span className="w-14 text-right font-display text-sm font-bold tabular-nums text-ink">
                EGP {order.total.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
