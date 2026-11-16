"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { CartRowList, useCartExitActivity } from "@/components/cart/CartRowList";
import { EmptyTrayState } from "@/components/cart/EmptyTrayState";
import { PriceText, AnimatedCount } from "@/components/cart/AnimatedValue";

export default function CartPage() {
  const { cart, updateCartQty, removeCartItem, clearCart, totalItemCount, subtotal } = useCart();
  const router = useRouter();
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway">("dine-in");
  const grandTotal = subtotal;
  // Keep the rows (and the exit animations) mounted until they finish.
  const exitActive = useCartExitActivity();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-deep">
            <ShoppingCart size={13} strokeWidth={2.5} />
            Your Tray
          </p>
          <h1 className="mt-1 font-display text-3xl font-black tracking-tight text-ink lg:text-4xl">
            Cart <span className="italic text-orange">Review</span>
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-brown">
            Adjust quantities, remove items, or continue shopping before checkout.
          </p>
        </div>

        <Link
          href="/menu"
          className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-2.5 text-xs font-semibold text-ink transition hover:border-orange hover:text-orange"
        >
          Continue shopping
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 rounded-full border border-ink/10 bg-white p-1.5 shadow-[0_10px_24px_-18px_rgba(36,23,8,0.35)]">
        <button
          type="button"
          onClick={() => setOrderType("dine-in")}
          className={`rounded-full px-4 py-2 text-[11px] font-bold transition-all duration-200 ${
            orderType === "dine-in"
              ? "bg-ink text-cream shadow-[0_8px_18px_-8px_rgba(36,23,8,0.6)]"
              : "text-brown/70 hover:bg-orange/10 hover:text-orange"
          }`}
        >
          Dine In
        </button>
        <button
          type="button"
          onClick={() => setOrderType("takeaway")}
          className={`rounded-full px-4 py-2 text-[11px] font-bold transition-all duration-200 ${
            orderType === "takeaway"
              ? "bg-ink text-cream shadow-[0_8px_18px_-8px_rgba(36,23,8,0.6)]"
              : "text-brown/70 hover:bg-orange/10 hover:text-orange"
          }`}
        >
          Takeaway
        </button>
      </div>

      {cart.length === 0 && !exitActive ? (
        <EmptyTrayState
          variant="page"
          title="Your tray is empty"
          description="Add items from the menu to see them here."
        >
          <Link
            href="/menu"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-cream transition hover:bg-orange-deep"
          >
            Browse menu
          </Link>
        </EmptyTrayState>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <CartRowList
            items={cart}
            variant="cart"
            onIncrease={(id) => updateCartQty(id, 1)}
            onDecrease={(id) => updateCartQty(id, -1)}
            onRemove={(id) => removeCartItem(id)}
            className="space-y-3"
          />

          <aside className="space-y-4">
            <div className="sticky top-24 rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)]">
              <h2 className="font-display text-base font-bold text-ink">Order summary</h2>

              <div className="mt-4 space-y-2 text-xs font-semibold text-brown">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span className="text-ink">
                    <AnimatedCount value={totalItemCount} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-ink">
                    <PriceText value={subtotal} />
                  </span>
                </div>
                <div className="flex justify-between border-t border-ink/10 pt-3 text-sm font-bold text-ink">
                  <span>Total</span>
                  <span className="font-display text-2xl font-bold text-orange">
                    <PriceText value={grandTotal} interpolate />
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (orderType === "dine-in") {
                    router.push("/table-selection");
                  } else {
                    router.push("/checkout");
                  }
                }}
                disabled={cart.length === 0}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange text-xs font-extrabold uppercase tracking-wider text-cream shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)] transition-all hover:-translate-y-0.5 hover:bg-orange-deep hover:shadow-[0_14px_28px_-8px_rgba(242,105,13,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange motion-reduce:hover:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 active:translate-y-0"
              >
                {orderType === "dine-in" ? "Choose table" : "Proceed to checkout"}
              </button>

              <button
                type="button"
                onClick={() => clearCart()}
                className="mt-2 flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-ink/10 bg-white text-xs font-bold text-brown transition hover:border-tomato hover:text-tomato"
              >
                <X size={13} strokeWidth={2.5} />
                Clear cart
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
