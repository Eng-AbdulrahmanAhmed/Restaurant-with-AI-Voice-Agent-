"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Armchair,
  Phone,
  Search,
  Users,
  Utensils,
  X,
} from "lucide-react";

type ReservationStatus = "pending" | "confirmed" | "seated" | "cancelled";
type Reservation = {
  id: string;
  customer: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  table: string;
  source: "Online" | "Phone" | "Walk-in";
  status: ReservationStatus;
  notes?: string;
};

const initialReservations: Reservation[] = [
  { id: "r-001", customer: "Sarah Mitchell", phone: "(555) 014-2890", guests: 4, date: "Today", time: "6:30 PM", table: "T-04", source: "Online", status: "pending", notes: "Birthday — wants a candle. ETA 15 min late." },
  { id: "r-002", customer: "James Carter", phone: "(555) 812-3347", guests: 2, date: "Today", time: "7:00 PM", table: "C-01", source: "Phone", status: "pending" },
  { id: "r-003", customer: "Priya Raman", phone: "(555) 221-9081", guests: 6, date: "Today", time: "7:30 PM", table: "T-09", source: "Online", status: "confirmed", notes: "Anniversary — window seat preferred." },
  { id: "r-004", customer: "Marcus Thompson", phone: "(555) 927-4412", guests: 3, date: "Today", time: "8:00 PM", table: "B-02", source: "Walk-in", status: "confirmed" },
  { id: "r-005", customer: "Emily Rodriguez", phone: "(555) 351-7821", guests: 4, date: "Today", time: "8:30 PM", table: "C-03", source: "Online", status: "confirmed", notes: "One peanut allergy." },
  { id: "r-006", customer: "Sam Okonkwo", phone: "(555) 608-1945", guests: 2, date: "Today", time: "5:30 PM", table: "C-04", source: "Online", status: "seated" },
  { id: "r-007", customer: "Hannah Lee", phone: "(555) 431-9027", guests: 5, date: "Today", time: "6:00 PM", table: "T-11", source: "Phone", status: "seated", notes: "Ordered steak — 10 min remaining." },
  { id: "r-008", customer: "Derek Donovan", phone: "(555) 892-3160", guests: 2, date: "Today", time: "6:00 PM", table: "T-02", source: "Walk-in", status: "cancelled" },
  { id: "r-009", customer: "Lena Fischer", phone: "(555) 774-0188", guests: 8, date: "Tomorrow", time: "12:30 PM", table: "T-12", source: "Online", status: "confirmed", notes: "Large party — pre-set menu advised." },
  { id: "r-010", customer: "Omar Hassan", phone: "(555) 612-5539", guests: 4, date: "Tomorrow", time: "1:00 PM", table: "B-04", source: "Phone", status: "pending" },
  { id: "r-011", customer: "Nora Patel", phone: "(555) 307-6681", guests: 6, date: "Tomorrow", time: "7:00 PM", table: "T-10", source: "Online", status: "confirmed" },
];

const statusStyles: Record<ReservationStatus, string> = {
  pending: "bg-gold/15 text-gold",
  confirmed: "bg-orange/10 text-orange-deep",
  seated: "bg-lettuce/15 text-lettuce",
  cancelled: "bg-tomato/10 text-tomato",
};

const statusLabels: Record<ReservationStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  seated: "Seated",
  cancelled: "Cancelled",
};

type Filter = "all" | ReservationStatus;

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(
    () => ({
      total: reservations.length,
      pending: reservations.filter((item) => item.status === "pending").length,
      confirmed: reservations.filter((item) => item.status === "confirmed").length,
      seated: reservations.filter((item) => item.status === "seated").length,
    }),
    [reservations]
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return reservations.filter((item) => {
      const matchesFilter = filter === "all" || item.status === filter;
      const matchesSearch =
        !term ||
        [item.customer, item.phone, item.table, item.date, item.time, item.notes]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      return matchesFilter && matchesSearch;
    });
  }, [reservations, query, filter]);

  const updateStatus = (id: string, status: ReservationStatus) =>
    setReservations((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    );

  const filterButtons: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Seated", value: "seated" },
  ];

  return (
    <main className="space-y-7 px-6 pt-10 pb-12 lg:px-10">
      {/* Page header */}
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
              <Calendar size={13} strokeWidth={2.5} />
              Host Stand
            </p>
            <h1 className="mt-1 font-display text-3xl font-black tracking-tight text-ink lg:text-4xl">
              Reservation <span className="italic text-orange">Management</span>
            </h1>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-brown">
              Confirm upcoming bookings, seat guests as they arrive, and cancel reservations when needed.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-orange px-5 py-2.5 text-xs font-semibold text-cream shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)] transition hover:bg-orange-deep sm:self-auto"
          >
            <Calendar size={15} strokeWidth={2.5} />
            + New Reservation
          </button>
        </div>
      </section>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Today's Bookings", value: counts.total, icon: Calendar, iconStyle: "bg-orange/10 text-orange" },
          { label: "Awaiting Confirmation", value: counts.pending, icon: Clock, iconStyle: "bg-gold/15 text-gold" },
          { label: "Confirmed", value: counts.confirmed, icon: Check, iconStyle: "bg-orange/10 text-orange-deep" },
          { label: "Seated", value: counts.seated, icon: Armchair, iconStyle: "bg-lettuce/10 text-lettuce" },
        ].map(({ label, value, icon: Icon, iconStyle }) => (
          <div
            key={label}
            className="group rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)] transition-all hover:-translate-y-0.5 hover:border-orange/20 hover:shadow-[0_20px_32px_-24px_rgba(36,23,8,0.45)]"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconStyle} transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110`}>
              <Icon size={17} strokeWidth={2} />
            </div>
            <p className="mt-3 text-[11px] font-medium text-brown/70 transition-colors duration-200 group-hover:text-orange-deep">{label}</p>
            <p className="mt-0.5 font-display text-2xl font-bold text-ink transition-colors duration-200 group-hover:text-orange">{value}</p>
          </div>
        ))}
      </div>

      {/* Search + filter pills */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-brown/50"
          />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, phone, or table..."
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
                className={`rounded-full px-4 py-2 text-[11px] font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-ink text-cream shadow-[0_8px_18px_-8px_rgba(36,23,8,0.6)]"
                    : "border border-ink/10 bg-white text-brown/70 hover:border-orange hover:text-orange"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-white p-12 text-center text-sm text-brown/60">
          No reservations match that search. Try another name or table.
        </div>
      )}

      {/* Reservation list */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((reservation) => (
          <article
            key={reservation.id}
            className="group rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-[0_14px_30px_-24px_rgba(36,23,8,0.35)] transition-all hover:-translate-y-0.5 hover:border-orange/20 hover:shadow-[0_20px_32px_-24px_rgba(36,23,8,0.45)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange/10 font-display text-sm font-bold text-orange-deep">
                  {reservation.customer
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h2 className="font-display text-base font-bold leading-tight text-ink">
                    {reservation.customer}
                  </h2>
                  <p className="mt-0.5 text-[11px] font-medium text-brown/60">
                    via {reservation.source} · {reservation.date} · {reservation.time}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-brown/70">
                    <span className="inline-flex items-center gap-1">
                      <Phone size={12} strokeWidth={2.5} />
                      {reservation.phone}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users size={12} strokeWidth={2.5} />
                      {reservation.guests} guests
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Utensils size={12} strokeWidth={2.5} />
                      {reservation.table}
                    </span>
                  </div>
                  {reservation.notes && (
                    <p className="mt-2 rounded-xl bg-cream px-3 py-2 text-[11px] leading-relaxed text-brown/70">
                      {reservation.notes}
                    </p>
                  )}
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[reservation.status]}`}
              >
                {statusLabels[reservation.status]}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-3">
              {reservation.status === "pending" && (
                <button
                  type="button"
                  onClick={() => updateStatus(reservation.id, "confirmed")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-orange px-3.5 py-2 text-[11px] font-semibold text-cream transition hover:bg-orange-deep"
                >
                  <Check size={13} strokeWidth={2.5} />
                  Confirm
                </button>
              )}
              {reservation.status === "confirmed" && (
                <button
                  type="button"
                  onClick={() => updateStatus(reservation.id, "seated")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[11px] font-semibold text-cream transition hover:bg-ink/80"
                >
                  <Armchair size={13} strokeWidth={2.5} />
                  Seat Guest
                </button>
              )}
              {reservation.status !== "cancelled" && reservation.status !== "seated" && (
                <button
                  type="button"
                  onClick={() => updateStatus(reservation.id, "cancelled")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-transparent px-3.5 py-2 text-[11px] font-semibold text-tomato transition hover:bg-tomato/10"
                >
                  <X size={13} strokeWidth={2.5} />
                  Cancel
                </button>
              )}
              {reservation.status === "cancelled" && (
                <button
                  type="button"
                  onClick={() => updateStatus(reservation.id, "pending")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-transparent px-3.5 py-2 text-[11px] font-semibold text-brown transition hover:text-ink"
                >
                  <Clock size={13} strokeWidth={2.5} />
                  Restore
                </button>
              )}
              {reservation.status === "seated" && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-lettuce">
                  <Check size={13} strokeWidth={2.5} />
                  Guest is seated
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
