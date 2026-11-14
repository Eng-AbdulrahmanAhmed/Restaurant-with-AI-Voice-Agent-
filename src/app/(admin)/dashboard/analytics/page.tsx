"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChartNoAxesCombined,
  TrendingUp,
  Banknote,
  ShoppingBag,
  Receipt,
  Utensils,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RangeKey = "7d" | "30d" | "90d";

const RANGES: { key: RangeKey; label: string; days: number }[] = [
  { key: "7d", label: "7 days", days: 7 },
  { key: "30d", label: "30 days", days: 30 },
  { key: "90d", label: "90 days", days: 90 },
];

const categoryData = [
  { name: "Burgers", revenue: 8420 },
  { name: "Sides", revenue: 2410 },
  { name: "Drinks", revenue: 1980 },
  { name: "Desserts", revenue: 1240 },
];

const topItems = [
  { name: "Classic Cheeseburger", orders: 128, revenue: 1152 },
  { name: "Double Bacon BBQ", orders: 96, revenue: 1296 },
  { name: "Rosemary Fries", orders: 84, revenue: 462 },
  { name: "Strawberry Shake", orders: 61, revenue: 366 },
  { name: "Mushroom Melt", orders: 52, revenue: 598 },
];

function buildSeries(days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - index));
    const wave =
      Math.sin(index * 0.9) * 190 +
      Math.sin(index * 0.31 + 1.4) * 140 +
      (index % 7 === 5 || index % 7 === 6 ? 160 : 0);

    return {
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: Math.max(280, Math.round(620 + wave)),
    };
  });
}

function money(value: number) {
  return "EGP " + Math.round(value).toLocaleString("en-US");
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("7d");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const days = RANGES.find((item) => item.key === range)?.days ?? 7;
  const series = useMemo(() => buildSeries(days), [days]);

  const kpis = useMemo(() => {
    const revenue = series.reduce((sum, point) => sum + point.revenue, 0);
    const orders = Math.max(1, Math.round(revenue / 24.5));
    const average = revenue / orders;
    const items = Math.round(orders * 2.4);
    return { revenue, orders, average, items };
  }, [series]);

  const kpiCards = [
    { label: "Revenue", value: money(kpis.revenue), change: "+12.4%", up: true, icon: Banknote, style: "bg-orange/10 text-orange" },
    { label: "Orders", value: kpis.orders.toLocaleString("en-US"), change: "+8.1%", up: true, icon: ShoppingBag, style: "bg-gold/15 text-gold" },
    { label: "Avg. Order Value", value: "EGP " + kpis.average.toFixed(2), change: "+3.2%", up: true, icon: Receipt, style: "bg-lettuce/10 text-lettuce" },
    { label: "Items Sold", value: kpis.items.toLocaleString("en-US"), change: "-1.6%", up: false, icon: Utensils, style: "bg-ink/5 text-brown" },
  ];

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
              <ChartNoAxesCombined size={13} strokeWidth={2.5} />
              Business Pulse
            </p>
            <h1 className="mt-1 font-display text-3xl font-black tracking-tight text-ink lg:text-4xl">
              Sales <span className="italic text-orange">Analytics</span>
            </h1>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-brown">
              Revenue, ticket size, and menu mix across the selected window. Sample data until orders are wired.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {RANGES.map(({ key, label }) => {
              const isActive = range === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRange(key)}
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
      </section>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpiCards.map(({ label, value, change, up, icon: Icon, style }) => (
          <div
            key={label}
            className="group rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)] transition-all hover:-translate-y-0.5 hover:border-orange/20 hover:shadow-[0_20px_32px_-24px_rgba(36,23,8,0.45)]"
          >
            <div className={"flex h-9 w-9 items-center justify-center rounded-xl " + style + " transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"}>
              <Icon size={17} strokeWidth={2} />
            </div>
            <p className="mt-3 text-[11px] font-medium text-brown/70 transition-colors duration-200 group-hover:text-orange-deep">{label}</p>
            <p className="mt-0.5 font-display text-2xl font-bold tabular-nums text-ink transition-colors duration-200 group-hover:text-orange">{value}</p>
            <p
              className={
                "mt-1 inline-flex items-center gap-1 text-[10px] font-bold tabular-nums " +
                (up ? "text-lettuce" : "text-tomato")
              }
            >
              {up ? <TrendingUp size={11} strokeWidth={2.5} /> : null}
              {change}
              <span className="font-medium text-brown/50">vs previous</span>
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-3xl border border-ink/10 bg-white p-5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-ink">Revenue trend</h2>
            <p className="text-[11px] tabular-nums text-brown/60">{days} days Â· sample data</p>
          </div>
          <p className="font-display text-xl font-black tabular-nums text-orange">{money(kpis.revenue)}</p>
        </div>

        <div className="mt-4 h-56 w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F2690D" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#F2690D" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="4 4" stroke="rgba(36,23,8,0.08)" vertical={false} />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  dy={8}
                  interval="preserveStartEnd"
                  tick={{ fill: "#6F5230", fontSize: 10, fontWeight: 600 }}
                />

                <YAxis hide />

                <Tooltip
                  cursor={{ stroke: "rgba(242,105,13,0.25)", strokeWidth: 1.5 }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(36,23,8,0.1)",
                    boxShadow: "0 14px 30px -18px rgba(36,23,8,0.45)",
                    fontSize: 12,
                    fontVariantNumeric: "tabular-nums",
                  }}
                  formatter={(value) => ["EGP " + Number(value).toLocaleString("en-US"), "Revenue"]}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F2690D"
                  strokeWidth={2.5}
                  fill="url(#analyticsRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full animate-pulse rounded-2xl bg-cream-deep" />
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <section className="rounded-3xl border border-ink/10 bg-white p-5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)] lg:col-span-3">
          <h2 className="font-display text-base font-bold text-ink">Revenue by category</h2>
          <p className="text-[11px] text-brown/60">Where the money comes from</p>

          <div className="mt-4 h-52 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(36,23,8,0.08)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    dy={8}
                    tick={{ fill: "#6F5230", fontSize: 10, fontWeight: 600 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: "rgba(242,105,13,0.06)" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid rgba(36,23,8,0.1)",
                      fontSize: 12,
                      fontVariantNumeric: "tabular-nums",
                    }}
                    formatter={(value) => ["EGP " + Number(value).toLocaleString("en-US"), "Revenue"]}
                  />
                  <Bar dataKey="revenue" fill="#F2690D" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full animate-pulse rounded-2xl bg-cream-deep" />
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-ink/10 bg-white p-5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)] lg:col-span-2">
          <h2 className="font-display text-base font-bold text-ink">Top sellers</h2>
          <p className="text-[11px] text-brown/60">By orders this window</p>

          <ol className="mt-4 space-y-2.5">
            {topItems.map((item, index) => (
              <li key={item.name} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange/10 text-[10px] font-bold tabular-nums text-orange-deep">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-ink">{item.name}</p>
                  <p className="text-[10px] tabular-nums text-brown/60">{item.orders} orders</p>
                </div>
                <span className="font-display text-sm font-bold tabular-nums text-ink">{money(item.revenue)}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}

