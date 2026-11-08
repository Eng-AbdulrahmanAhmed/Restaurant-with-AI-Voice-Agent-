"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  LogOut,
  Mail,
  Package,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

type ProfileRow = {
  full_name: string | null;
  phone: string | null;
  role: string | null;
};

type OrderStatus = "delivered" | "preparing" | "cancelled";

type PastOrder = {
  id: string;
  date: string;
  items: { name: string; qty: number }[];
  total: number;
  status: OrderStatus;
};

const pastOrders: PastOrder[] = [
  {
    id: "#1042",
    date: "Nov 5, 2026",
    items: [
      { name: "Classic Cheeseburger", qty: 2 },
      { name: "Rosemary Sea Salt Fries", qty: 1 },
    ],
    total: 21.97,
    status: "delivered",
  },
  {
    id: "#1038",
    date: "Oct 31, 2026",
    items: [
      { name: "Mushroom Swiss Truffle Burger", qty: 1 },
      { name: "Strawberry Cloud Milkshake", qty: 2 },
    ],
    total: 20.47,
    status: "delivered",
  },
  {
    id: "#1035",
    date: "Oct 28, 2026",
    items: [
      { name: "Double Bacon BBQ Burger", qty: 1 },
      { name: "Truffle Parmesan Loaded Fries", qty: 1 },
      { name: "Classic Craft Cola", qty: 1 },
    ],
    total: 23.47,
    status: "preparing",
  },
  {
    id: "#1031",
    date: "Oct 24, 2026",
    items: [{ name: "Garden Halloumi Smash", qty: 1 }],
    total: 9.49,
    status: "cancelled",
  },
];

const statusStyles: Record<OrderStatus, string> = {
  delivered: "bg-lettuce/15 text-lettuce",
  preparing: "bg-orange/10 text-orange-deep",
  cancelled: "bg-tomato/10 text-tomato",
};

const statusLabels: Record<OrderStatus, string> = {
  delivered: "Delivered",
  preparing: "In progress",
  cancelled: "Cancelled",
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    let cancelled = false;
    setProfileLoading(true);

    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, role")
        .eq("id", user.id)
        .single();

      if (!cancelled) {
        setProfile((data as ProfileRow | null) ?? null);
        setProfileLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, supabase]);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-20">
        <div className="h-56 animate-pulse rounded-[1.75rem] border border-ink/10 bg-white shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)]" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-2xl px-6 py-20">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white p-10 text-center shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-orange/10 blur-2xl"
          />
          <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange/10 text-orange">
            <UserRound size={26} strokeWidth={2.5} />
          </span>
          <h1 className="mt-5 font-display text-3xl font-black tracking-tight text-ink">
            You are not signed in
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-brown">
            Sign in to see your profile, preferences, and order history.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth/signin"
              className="rounded-full bg-orange px-6 py-3 text-sm font-semibold text-cream shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)] transition-all hover:-translate-y-0.5 hover:bg-orange-deep"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full border border-ink/10 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-orange hover:text-orange"
            >
              Create account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const name =
    profile?.full_name ??
    user.user_metadata?.full_name ??
    user.email ??
    "Guest";
  const isAdmin = profile?.role === "admin";
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white p-8 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-orange/10 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-gold/15 blur-2xl"
        />

        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange/10 font-display text-2xl font-bold text-orange-deep">
            {initials(name)}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-black tracking-tight text-ink">
              {name}
            </h1>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-brown">
              <Mail size={14} strokeWidth={2.5} />
              {user.email}
            </p>
          </div>
          <span
            className={
              "ml-auto shrink-0 rounded-full px-3 py-1 text-[10px] font-bold " +
              (isAdmin ? "bg-orange/10 text-orange-deep" : "bg-ink/5 text-brown")
            }
          >
            {isAdmin ? "Admin" : "Customer"}
          </span>
        </div>

        <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-ink/10 pt-6 sm:grid-cols-2">
          {[
            { label: "Phone", value: profile?.phone ?? "Add a phone number", icon: Phone },
            { label: "Member since", value: memberSince, icon: ShieldCheck },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-ink/10 bg-cream/50 p-4 transition-colors hover:border-orange/20">
              <dt className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-brown/60">
                <Icon size={13} strokeWidth={2.5} />
                {label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {isAdmin && (
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-xs font-semibold text-cream shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)] transition-all hover:-translate-y-0.5 hover:bg-orange-deep"
            >
              Open dashboard
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          )}
          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-2.5 text-xs font-semibold text-ink transition hover:border-tomato hover:text-tomato"
          >
            <LogOut size={14} strokeWidth={2.5} />
            Sign out
          </button>
        </div>

        {profileLoading && (
          <p className="mt-4 text-[11px] text-brown/50">Loading profile details…</p>
        )}
      </div>

      {/* Recent orders */}
      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-deep">
              <Package size={13} strokeWidth={2.5} />
              Order history
            </p>
            <h2 className="mt-1 font-display text-2xl font-black tracking-tight text-ink">
              Recent orders
            </h2>
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-brown/70 transition-colors hover:text-orange"
          >
            View all orders
          </button>
        </div>

        {pastOrders.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-ink/15 bg-white/60 p-12 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange/10 text-orange">
              <Package size={26} strokeWidth={2.2} />
            </span>
            <h3 className="mt-3 font-display text-lg font-bold text-ink">No orders yet</h3>
            <p className="mt-1 text-xs text-brown/60">
              Your first order will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pastOrders.map((order) => (
              <article
                key={order.id}
                className="group rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-[0_14px_30px_-24px_rgba(36,23,8,0.35)] transition-all hover:-translate-y-0.5 hover:border-orange/20 hover:shadow-[0_20px_32px_-24px_rgba(36,23,8,0.45)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-sm font-bold text-ink">
                      {order.id}
                      <span className="ml-2 text-[11px] font-medium text-brown/60">
                        {order.date}
                      </span>
                    </h3>
                    <ul className="mt-2 space-y-0.5">
                      {order.items.map((item) => (
                        <li key={item.name} className="text-[11px] text-brown/70">
                          <span className="font-semibold text-ink">{item.qty}x</span> {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                    <span className="font-display text-lg font-bold text-orange">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 border-t border-ink/10 pt-3">
                  {order.status === "delivered" && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-full bg-orange px-3.5 py-2 text-[11px] font-semibold text-cream transition hover:bg-orange-deep"
                    >
                      <RefreshCw size={13} strokeWidth={2.5} />
                      Reorder
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-orange-deep">
                      <Clock size={13} strokeWidth={2.5} />
                      Being prepared
                    </span>
                  )}
                  {order.status === "cancelled" && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-tomato">
                      <X size={13} strokeWidth={2.5} />
                      Cancelled
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
