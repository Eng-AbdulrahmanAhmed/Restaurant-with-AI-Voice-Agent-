"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, ArrowRight } from "lucide-react";

/* ============================================================================
   DASHBOARD ANALYTICS — SAMPLE DATA ONLY.
   Placeholder sales chart until the real orders/analytics tables are wired.
   The "View analytics" link goes to /dashboard/analytics.
   ============================================================================ */

const salesData = [
  { day: "Mon", sales: 420 },
  { day: "Tue", sales: 610 },
  { day: "Wed", sales: 540 },
  { day: "Thu", sales: 780 },
  { day: "Fri", sales: 920 },
  { day: "Sat", sales: 1140 },
  { day: "Sun", sales: 842 },
];

const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);

export default function DashboardAnalytics() {
  // Recharts needs a measured parent; render the chart only after mount so
  // server-rendered HTML stays stable (skeleton on first paint).
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <section className="flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)] transition-all duration-300 hover:border-orange/20 hover:shadow-[0_20px_36px_-24px_rgba(36,23,8,0.45)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lettuce/10 text-lettuce">
            <TrendingUp size={17} strokeWidth={2} />
          </span>

          <div>
            <h3 className="font-display text-base font-bold text-ink">
              Sales This Week
            </h3>
            <p className="text-[11px] text-brown/70">Sample data · last 7 days</p>
          </div>
        </div>

        <Link
          href="/dashboard/analytics"
          className="group inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[11px] font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-orange/40 hover:text-orange"
        >
          View analytics
          <ArrowRight
            size={13}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-2.5">
        <p className="font-display text-2xl font-black tabular-nums tracking-tight text-ink">
          EGP {totalSales.toLocaleString()}
        </p>

        <span className="mb-0.5 inline-flex items-center gap-1 rounded-full bg-lettuce/10 px-2 py-0.5 text-[10px] font-bold tabular-nums text-lettuce">
          <TrendingUp size={11} strokeWidth={2.5} />
          +12.4%
        </span>

        <span className="mb-0.5 text-[10px] text-brown/60">vs last week</span>
      </div>

      <div className="mt-3 h-44 w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F2690D" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#F2690D" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                stroke="rgba(36,23,8,0.08)"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                dy={8}
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
                labelStyle={{ color: "#6F5230", fontWeight: 600 }}
                formatter={(value) => [`EGP ${value}`, "Sales"]}
              />

              <Area
                type="monotone"
                dataKey="sales"
                stroke="#F2690D"
                strokeWidth={2.5}
                fill="url(#salesFill)"
                activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full animate-pulse rounded-2xl bg-cream-deep/60" />
        )}
      </div>
    </section>
  );
}
