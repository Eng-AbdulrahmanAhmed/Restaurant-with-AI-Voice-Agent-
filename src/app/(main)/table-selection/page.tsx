"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Armchair,
  Calendar,
  Check,
  Clock,
  Phone,
  Search,
  Users,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

type TableStatus = "available" | "reserved" | "seated" | "cleaning";

type Table = {
  id: string;
  floor: string;
  label: string;
  capacity: number;
  shape: "round" | "square" | "booth";
  status: TableStatus;
  x: number;
  y: number;
  party?: string | null;
  seatedAt?: string | null;
};

const floors = ["Main", "Patio", "Bar", "Private"] as const;

const tables: Table[] = [
  { id: "t-1", floor: "Main", label: "T-1", capacity: 2, shape: "round", status: "available", x: 18, y: 22 },
  { id: "t-2", floor: "Main", label: "T-2", capacity: 4, shape: "square", status: "seated", x: 42, y: 18, party: "Table 2", seatedAt: "12 min ago" },
  { id: "t-3", floor: "Main", label: "T-3", capacity: 4, shape: "square", status: "available", x: 68, y: 22 },
  { id: "t-4", floor: "Main", label: "T-4", capacity: 6, shape: "round", status: "reserved", x: 25, y: 55, party: "Marcus Thompson" },
  { id: "t-5", floor: "Main", label: "T-5", capacity: 2, shape: "square", status: "cleaning", x: 50, y: 50 },
  { id: "t-6", floor: "Main", label: "T-6", capacity: 4, shape: "booth", status: "available", x: 76, y: 55 },
  { id: "t-7", floor: "Main", label: "T-7", capacity: 8, shape: "round", status: "available", x: 20, y: 82 },
  { id: "t-8", floor: "Main", label: "T-8", capacity: 4, shape: "square", status: "seated", x: 46, y: 78, party: "Table 8", seatedAt: "6 min ago" },
  { id: "t-9", floor: "Main", label: "T-9", capacity: 6, shape: "square", status: "available", x: 72, y: 82 },
  { id: "p-1", floor: "Patio", label: "P-1", capacity: 4, shape: "round", status: "available", x: 25, y: 30 },
  { id: "p-2", floor: "Patio", label: "P-2", capacity: 4, shape: "round", status: "available", x: 62, y: 30 },
  { id: "p-3", floor: "Patio", label: "P-3", capacity: 6, shape: "square", status: "seated", x: 42, y: 68, party: "Patio 3", seatedAt: "15 min ago" },
  { id: "p-4", floor: "Patio", label: "P-4", capacity: 2, shape: "booth", status: "cleaning", x: 78, y: 62 },
  { id: "b-1", floor: "Bar", label: "B-1", capacity: 2, shape: "round", status: "available", x: 20, y: 42 },
  { id: "b-2", floor: "Bar", label: "B-2", capacity: 2, shape: "round", status: "available", x: 45, y: 42 },
  { id: "b-3", floor: "Bar", label: "B-3", capacity: 2, shape: "round", status: "seated", x: 70, y: 42, party: "Bar 3", seatedAt: "8 min ago" },
  { id: "b-4", floor: "Bar", label: "B-4", capacity: 4, shape: "square", status: "reserved", x: 45, y: 72, party: "Omar Hassan" },
  { id: "v-1", floor: "Private", label: "V-1", capacity: 8, shape: "round", status: "available", x: 30, y: 45 },
  { id: "v-2", floor: "Private", label: "V-2", capacity: 10, shape: "round", status: "available", x: 70, y: 45 },
];

const statusStyles: Record<TableStatus, string> = {
  available: "border-lettuce/40 bg-lettuce/10 text-lettuce hover:border-lettuce hover:bg-lettuce/20",
  reserved: "border-gold/40 bg-gold/15 text-gold",
  seated: "border-orange/40 bg-orange/10 text-orange-deep",
  cleaning: "border-tomato/40 bg-tomato/10 text-tomato",
};

const statusLabels: Record<TableStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  seated: "Seated",
  cleaning: "Cleaning",
};

const shapeClass: Record<Table["shape"], string> = {
  round: "h-20 w-20 rounded-full",
  square: "h-18 w-18 rounded-2xl",
  booth: "h-14 w-28 rounded-2xl",
};

export default function TableSelectionPage() {
  const { cart, totalItemCount, subtotal } = useCart();
  const [partySize, setPartySize] = useState(2);
  const [selectedFloor, setSelectedFloor] = useState("Main");
  const [floor, setFloor] = useState("Main");
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedTable = tables.find((table) => table.id === selectedTableId) ?? null;

  const visibleTables = useMemo(() => tables.filter((table) => table.floor === floor), [tables, floor]);

  const eligible = (table: Table) => table.status === "available" && table.capacity >= partySize;

  const phoneValid = /^01[0125]\d{8}$/.test(phone.replace(/[\s-]/g, ""));

  const canConfirm = name.trim() !== "" && phoneValid && selectedTableId !== null;

  const handleConfirm = () => {
    if (!canConfirm) return;
    setSubmitted(true);
  };

  if (submitted && selectedTable) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <div className="rounded-[1.75rem] border border-ink/10 bg-white p-8 text-center shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)]">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lettuce/10 text-lettuce">
            <Check size={26} strokeWidth={2.5} />
          </span>
          <h1 className="mt-5 font-display text-3xl font-black tracking-tight text-ink">
            Table Confirmed
          </h1>
          <p className="mt-2 text-sm text-brown">
            Your dine-in table is reserved for your party.
          </p>
          <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
            <div className="rounded-2xl border border-ink/10 bg-cream/50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brown/60">Table</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{selectedTable.label}</p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-cream/50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brown/60">Party Size</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{partySize} guests</p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-cream/50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brown/60">Name</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{name}</p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-cream/50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brown/60">Phone</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{phone}</p>
            </div>
          </div>
          {cart.length > 0 && (
            <div className="mt-6 rounded-2xl border border-ink/10 bg-cream/50 p-4 text-left">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brown/60">Order tray</p>
              <ul className="mt-2 space-y-1">
                {cart.map((item) => (
                  <li key={item.id} className="flex items-center justify-between text-xs text-brown">
                    <span>{item.quantity}x {item.name}{item.variantName ? ` (${item.variantName})` : ""}</span>
                    <span className="font-semibold text-ink">EGP {(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 border-t border-ink/10 pt-2 text-xs font-semibold text-ink">
                Subtotal: EGP {subtotal.toFixed(2)}
              </p>
            </div>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/menu"
              className="rounded-full bg-orange px-6 py-3 text-sm font-semibold text-cream transition hover:bg-orange-deep"
            >
              Back to menu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-deep">
            <Calendar size={13} strokeWidth={2.5} />
            Dine In
          </p>
          <h1 className="mt-1 font-display text-3xl font-black tracking-tight text-ink lg:text-4xl">
            Choose your <span className="italic text-orange">table</span>
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-brown">
            Pick your party size, then select an available table on the floor plan.
          </p>
        </div>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-2.5 text-xs font-semibold text-ink transition hover:border-orange hover:text-orange"
        >
          Back to menu
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-brown">
              <Users size={14} strokeWidth={2.5} />
              Party size
              <select
                value={partySize}
                onChange={(event) => setPartySize(Number(event.target.value))}
                className="h-9 rounded-full border border-ink/10 bg-cream px-3 text-xs font-medium text-ink outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/30"
              >
                {Array.from({ length: 10 }, (_, index) => index + 1).map((size) => (
                  <option key={size} value={size}>
                    {size} {size === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-wrap gap-2">
              {floors.map((floor) => {
                const active = floor === selectedFloor;
                return (
                  <button
                    key={floor}
                    type="button"
                    onClick={() => setSelectedFloor(floor)}
                    className={
                      "rounded-full px-4 py-2 text-[11px] font-bold transition-all duration-200 " +
                      (active
                        ? "bg-ink text-cream shadow-[0_8px_18px_-8px_rgba(36,23,8,0.6)]"
                        : "border border-ink/10 bg-white text-brown/70 hover:border-orange hover:text-orange")
                    }
                  >
                    {floor}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative h-[420px] w-full overflow-hidden rounded-[2rem] border border-ink/10 bg-[linear-gradient(180deg,rgba(242,230,204,0.95),rgba(250,243,226,0.75))] shadow-[0_24px_48px_-28px_rgba(36,23,8,0.45)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(36,23,8,0.09)_1px,transparent_0)] [background-size:28px_28px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(36,23,8,0.08)_100%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-ink/8"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-ink/8"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-6 top-6 rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brown/70 shadow-sm backdrop-blur-sm"
            >
              {selectedFloor} floor
            </div>

            {tables
              .filter((table) => table.floor === selectedFloor)
              .map((table) => {
                const tooSmall = table.capacity < partySize;
                const unavailable = table.status !== "available";
                const disabled = tooSmall || unavailable;
                const selected = table.id === selectedTableId;
                const statusStyle = unavailable
                  ? "border-tomato/40 bg-tomato/10 text-tomato"
                  : "border-lettuce/40 bg-lettuce/10 text-lettuce hover:border-lettuce hover:bg-lettuce/20";

                return (
                  <button
                    key={table.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && setSelectedTableId(table.id)}
                    className={`absolute flex flex-col items-center justify-center gap-0.5 border text-[11px] font-bold transition-all duration-200 ${
                      selected
                        ? "h-20 w-20 rounded-full border-ink bg-ink text-cream shadow-[0_12px_24px_-10px_rgba(36,23,8,0.7)] ring-4 ring-orange/30"
                        : tooSmall || unavailable
                          ? "h-16 w-16 rounded-full border-ink/10 bg-cream-deep text-brown/40 opacity-40 grayscale"
                          : table.shape === "round"
                            ? "h-20 w-20 rounded-full border-lettuce/40 bg-lettuce/10 text-lettuce shadow-[0_14px_28px_-12px_rgba(36,23,8,0.45)] hover:-translate-y-1 hover:scale-105 hover:border-lettuce hover:bg-lettuce/20"
                            : table.shape === "square"
                              ? "h-18 w-18 rounded-2xl border-lettuce/40 bg-lettuce/10 text-lettuce shadow-[0_14px_28px_-12px_rgba(36,23,8,0.45)] hover:-translate-y-1 hover:scale-105 hover:border-lettuce hover:bg-lettuce/20"
                              : "h-14 w-28 rounded-2xl border-lettuce/40 bg-lettuce/10 text-lettuce shadow-[0_14px_28px_-12px_rgba(36,23,8,0.45)] hover:-translate-y-1 hover:scale-105 hover:border-lettuce hover:bg-lettuce/20"
                    }`}
                    style={{
                      left: `${table.x}%`,
                      top: `${table.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    aria-label={`${table.label}, ${table.capacity} seats, ${table.status}`}
                  >
                    <span className="text-xs font-extrabold">{table.label}</span>
                    <span className="text-[9px] font-semibold">{table.capacity} seats</span>
                  </button>
                );
              })}
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-brown/70">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-lettuce/30 bg-lettuce/10 px-2.5 py-1">
              <span className="h-2 w-2 rounded-full bg-lettuce" /> Available
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/15 px-2.5 py-1">
              <span className="h-2 w-2 rounded-full bg-gold" /> Reserved
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange/30 bg-orange/10 px-2.5 py-1">
              <span className="h-2 w-2 rounded-full bg-orange" /> Seated
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-tomato/30 bg-tomato/10 px-2.5 py-1">
              <span className="h-2 w-2 rounded-full bg-tomato" /> Cleaning
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-cream-deep px-2.5 py-1">
              <span className="h-2 w-2 rounded-full bg-brown/30" /> Too small / unavailable
            </span>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="sticky top-24 rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-[0_14px_30px_-22px_rgba(36,23,8,0.35)]">
            <h2 className="font-display text-base font-bold text-ink">Reservation details</h2>

            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown">Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-sm text-ink placeholder:text-brown/50 outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/30"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brown">Phone</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01012345678"
                  className="h-11 w-full rounded-full border border-ink/10 bg-cream px-4 text-sm text-ink placeholder:text-brown/50 outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/30"
                />
                {phone && !/^01[0125]\d{8}$/.test(phone.replace(/[\s-]/g, "")) && (
                  <p className="mt-1 text-[11px] font-medium text-tomato">Enter a valid Egyptian mobile number.</p>
                )}
              </label>
              <div className="rounded-2xl border border-ink/10 bg-cream/50 p-3 text-xs text-brown">
                <p className="font-semibold text-ink">Selected table</p>
                <p className="mt-1 text-brown/70">
                {selectedTable ? `${selectedTable.label} \u00B7 ${selectedTable.capacity} seats` : "No table selected yet"}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-ink/10 pt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-brown/60">Pre-order (optional)</p>
              {cart.length === 0 ? (
                <p className="text-[11px] text-brown/60">Add items from the menu to pre-order them.</p>
              ) : (
                <ul className="space-y-1">
                  {cart.map((item) => (
                    <li key={item.id} className="flex items-center justify-between text-xs text-brown">
                      <span className="min-w-0 truncate">{item.quantity}x {item.name}</span>
                      <span className="font-semibold text-ink">EGP {(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="border-t border-ink/10 pt-2 text-xs font-semibold text-ink">
                Subtotal: EGP {subtotal.toFixed(2)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange text-xs font-extrabold uppercase tracking-wider text-cream shadow-[0_10px_24px_-8px_rgba(242,105,13,0.6)] transition-all hover:-translate-y-0.5 hover:bg-orange-deep hover:shadow-[0_14px_28px_-8px_rgba(242,105,13,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange motion-reduce:hover:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 active:translate-y-0"
            >
              <Check size={15} />
              Confirm Reservation
            </button>

            {!canConfirm && (
              <p className="mt-2 text-center text-[11px] text-brown/60">
                Enter name, phone, and select an available table.
              </p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
