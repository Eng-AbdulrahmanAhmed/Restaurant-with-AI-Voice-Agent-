"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Mail, MapPin, Phone, ShoppingBag, Truck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import type { DeliveryInfo } from "@/types/delivery";
import { hasDeliveryErrors, validateDeliveryInfo } from "@/lib/delivery";

const initialDeliveryInfo: DeliveryInfo = {
  fullName: "",
  phone: "",
  city: "",
  area: "",
  street: "",
  buildingNumber: "",
  apartment: "",
  landmark: "",
  deliveryInstructions: "",
};

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, totalItemCount, subtotal } = useCart();
  const supabase = useMemo(() => createClient(), []);

  const [form, setForm] = useState<DeliveryInfo>(initialDeliveryInfo);
  const [errors, setErrors] = useState<ReturnType<typeof validateDeliveryInfo>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .single();

      if (!cancelled && data) {
        setForm((prev) => ({
          ...prev,
          fullName: data.full_name ?? prev.fullName,
          phone: data.phone ?? prev.phone,
        }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, supabase]);

  const handleChange = (field: keyof DeliveryInfo, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateDeliveryInfo(form);
    setErrors(nextErrors);

    if (hasDeliveryErrors(nextErrors)) return;

    setSaved(true);
  };

  if (cart.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-20">
        <div className="rounded-[1.75rem] border border-dashed border-ink/15 bg-white/60 p-12 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange/10 text-orange">
            <ShoppingBag size={26} strokeWidth={2.2} />
          </span>
          <h1 className="mt-3 font-display text-lg font-bold text-ink">Your cart is empty</h1>
          <p className="mt-1 text-xs text-brown/60">
            Add items from the menu before entering delivery information.
          </p>
          <Link
            href="/menu"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-cream transition hover:bg-orange-deep"
          >
            Browse menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-deep">
            <Truck size={13} strokeWidth={2.5} />
            Checkout
          </p>
          <h1 className="mt-1 font-display text-3xl font-black tracking-tight text-ink lg:text-4xl">
            Delivery <span className="italic text-orange">Information</span>
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-brown">
            Enter where your order should be delivered. This does not create an order yet.
          </p>
        </div>

        <Link
          href="/cart"
          className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-2.5 text-xs font-semibold text-ink transition hover:border-orange hover:text-orange"
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          Back to cart
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)]"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="checkout-full-name" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown">
                Full name *
              </label>
              <input
                id="checkout-full-name"
                type="text"
                value={form.fullName}
                onChange={(event) => handleChange("fullName", event.target.value)}
                className="h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-sm text-ink outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/30"
              />
              {errors.fullName && <p className="mt-1 text-[11px] font-medium text-tomato">{errors.fullName}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="checkout-phone" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown">
                Phone number *
              </label>
              <input
                id="checkout-phone"
                type="tel"
                value={form.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                placeholder="01012345678"
                className="h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-sm text-ink outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/30"
              />
              {errors.phone && <p className="mt-1 text-[11px] font-medium text-tomato">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="checkout-city" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown">
                City *
              </label>
              <input
                id="checkout-city"
                type="text"
                value={form.city}
                onChange={(event) => handleChange("city", event.target.value)}
                className="h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-sm text-ink outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/30"
              />
              {errors.city && <p className="mt-1 text-[11px] font-medium text-tomato">{errors.city}</p>}
            </div>

            <div>
              <label htmlFor="checkout-area" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown">
                Area / neighborhood *
              </label>
              <input
                id="checkout-area"
                type="text"
                value={form.area}
                onChange={(event) => handleChange("area", event.target.value)}
                className="h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-sm text-ink outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/30"
              />
              {errors.area && <p className="mt-1 text-[11px] font-medium text-tomato">{errors.area}</p>}
            </div>

            <div>
              <label htmlFor="checkout-street" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown">
                Street name *
              </label>
              <input
                id="checkout-street"
                type="text"
                value={form.street}
                onChange={(event) => handleChange("street", event.target.value)}
                className="h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-sm text-ink outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/30"
              />
              {errors.street && <p className="mt-1 text-[11px] font-medium text-tomato">{errors.street}</p>}
            </div>

            <div>
              <label htmlFor="checkout-building" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown">
                Building number *
              </label>
              <input
                id="checkout-building"
                type="text"
                value={form.buildingNumber}
                onChange={(event) => handleChange("buildingNumber", event.target.value)}
                className="h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-sm text-ink outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/30"
              />
              {errors.buildingNumber && <p className="mt-1 text-[11px] font-medium text-tomato">{errors.buildingNumber}</p>}
            </div>

            <div>
              <label htmlFor="checkout-apartment" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown">
                Apartment / floor
              </label>
              <input
                id="checkout-apartment"
                type="text"
                value={form.apartment ?? ""}
                onChange={(event) => handleChange("apartment", event.target.value)}
                className="h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-sm text-ink outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/30"
              />
            </div>

            <div>
              <label htmlFor="checkout-landmark" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown">
                Nearby landmark
              </label>
              <input
                id="checkout-landmark"
                type="text"
                value={form.landmark ?? ""}
                onChange={(event) => handleChange("landmark", event.target.value)}
                className="h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-sm text-ink outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/30"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="checkout-instructions" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown">
                Delivery instructions
              </label>
              <textarea
                id="checkout-instructions"
                rows={3}
                value={form.deliveryInstructions ?? ""}
                onChange={(event) => handleChange("deliveryInstructions", event.target.value)}
                placeholder="Ring the bell, leave at reception, etc."
                className="w-full resize-none rounded-2xl border border-ink/10 bg-cream p-3.5 text-xs font-medium text-ink outline-none transition placeholder:text-brown/50 focus:border-orange focus:bg-white focus:ring-2 focus:ring-orange/30"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-ink/10 pt-4">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-2.5 text-xs font-semibold text-ink transition hover:border-orange hover:text-orange"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              Back to cart
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-orange px-6 py-2.5 text-xs font-semibold text-cream shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)] transition-all hover:-translate-y-0.5 hover:bg-orange-deep"
            >
              <Check size={15} strokeWidth={2.5} />
              Save delivery information
            </button>
          </div>

          {saved && (
            <div className="rounded-2xl border border-lettuce/20 bg-lettuce/10 p-4 text-sm text-lettuce">
              <p className="font-semibold">Delivery information saved for this checkout session.</p>
              <p className="mt-1 text-[11px] text-brown/70">
                No order was created. Checkout is not available yet.
              </p>
            </div>
          )}
        </form>

        <aside className="space-y-4">
          <div className="sticky top-24 rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)]">
            <h2 className="font-display text-base font-bold text-ink">Order summary</h2>

            <div className="mt-4 space-y-2 text-xs font-semibold text-brown">
              <div className="flex justify-between">
                <span>Items</span>
                <span className="text-ink">{totalItemCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-ink">EGP {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-3 text-sm font-bold text-ink">
                <span>Total</span>
                <span className="font-display text-2xl font-bold text-orange">
                  EGP {subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-ink/10 pt-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2 text-xs">
                  <span className="min-w-0 truncate text-brown/70">
                    {item.quantity}x {item.name}
                    {item.variantName ? ` (${item.variantName})` : ""}
                  </span>
                  <span className="font-semibold text-ink">EGP {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
