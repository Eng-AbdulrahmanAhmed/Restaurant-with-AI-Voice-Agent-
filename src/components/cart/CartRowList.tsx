"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { CartItem } from "@/types/cart";
import { useCartBusEvent } from "@/lib/cartFeedback";
import { CartRow } from "./CartRow";

/**
 * True while a removal / clear-cart exit animation is still on screen.
 * Pages use this to keep their row area mounted (and totals visible) until
 * the exiting rows have collapsed, instead of swapping to the empty state
 * the instant the cart state empties.
 */
export function useCartExitActivity(): boolean {
  const [active, setActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  useCartBusEvent((event) => {
    if (event.kind !== "remove" && event.kind !== "clear") return;
    setActive(true);
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    // Generous ceiling: staggered clears of large carts still finish here.
    timerRef.current = window.setTimeout(() => setActive(false), EXIT_DURATION_MS + 30 * 24);
  });

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  return active;
}

/**
 * Renders the live cart rows plus the temporary "exiting" rows used for
 * removal and clear-cart animations.
 *
 * The actual cart state is never delayed: when an item is removed (or the
 * cart cleared) the committed state updates immediately, and this list keeps
 * a read-only snapshot purely for the exit animation, which collapses its
 * own space afterwards. Exiting rows hold no interactivity and can never
 * re-enter the cart.
 */
type ExitingEntry = { key: string; id: string; item: CartItem; delay: number };

type CartRowListProps = {
  items: CartItem[];
  variant: "tray" | "cart";
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  className?: string;
  /** Shown when the cart is empty and no exit animation is running. */
  emptyState?: ReactNode;
};

const EXIT_DURATION_MS = 340;
const CLEAR_STAGGER_MS = 30;

export function CartRowList({
  items,
  variant,
  onIncrease,
  onDecrease,
  onRemove,
  className,
  emptyState,
}: CartRowListProps) {
  const [exiting, setExiting] = useState<ExitingEntry[]>([]);
  const [enteringIds, setEnteringIds] = useState<ReadonlySet<string>>(() => new Set());
  const timersRef = useRef<number[]>([]);

  // Registries used by remove/clear events, which fire after the state has
  // already committed (so `items` no longer contains the removed rows).
  const seenItemsRef = useRef(new Map<string, CartItem>());
  const lastNonEmptyItemsRef = useRef<CartItem[]>([]);

  useEffect(() => {
    for (const item of items) seenItemsRef.current.set(item.id, item);
    if (items.length > 0) lastNonEmptyItemsRef.current = items;
  }, [items]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const timer of timers) clearTimeout(timer);
      timersRef.current = [];
    };
  }, []);

  useCartBusEvent((event) => {
    if (event.kind === "add" && event.id) {
      const id = event.id;
      // A re-added item must not keep animating out in the background.
      setExiting((previous) => previous.filter((entry) => entry.id !== id));
      setEnteringIds((previous) => {
        const next = new Set(previous);
        next.add(id);
        return next;
      });
      timersRef.current.push(
        window.setTimeout(() => {
          setEnteringIds((previous) => {
            const next = new Set(previous);
            next.delete(id);
            return next;
          });
        }, 450)
      );
      return;
    }

    if (event.kind === "remove" && event.id) {
      const snapshot = seenItemsRef.current.get(event.id);
      if (!snapshot) return;
      const entry: ExitingEntry = {
        key: `exit-${event.id}-${event.requestId}`,
        id: event.id,
        item: snapshot,
        delay: 0,
      };
      setExiting((previous) => [...previous.filter((candidate) => candidate.id !== entry.id), entry]);
      timersRef.current.push(
        window.setTimeout(() => {
          setExiting((previous) => previous.filter((candidate) => candidate.key !== entry.key));
        }, EXIT_DURATION_MS)
      );
      return;
    }

    if (event.kind === "clear") {
      const snapshot = lastNonEmptyItemsRef.current;
      if (snapshot.length === 0) return;
      setExiting(
        snapshot.map((item, index) => ({
          key: `exit-${item.id}-${event.requestId}`,
          id: item.id,
          item,
          delay: index * CLEAR_STAGGER_MS,
        }))
      );
      timersRef.current.push(
        window.setTimeout(() => setExiting([]), EXIT_DURATION_MS + snapshot.length * CLEAR_STAGGER_MS)
      );
    }
  });

  const showEmptyState = items.length === 0 && exiting.length === 0;

  return (
    <div className={className}>
      {items.map((item) => (
        <CartRow
          key={item.id}
          item={item}
          variant={variant}
          entering={enteringIds.has(item.id)}
          onIncrease={() => onIncrease(item.id)}
          onDecrease={() => onDecrease(item.id)}
          onRemove={() => onRemove(item.id)}
        />
      ))}

      {exiting.map((entry) => (
        <div
          key={entry.key}
          className="cart-row-exit"
          style={{ "--cart-exit-delay": `${entry.delay}ms` } as CSSProperties}
        >
          <div>
            <CartRow item={entry.item} variant={variant} readonly />
          </div>
        </div>
      ))}

      {showEmptyState ? emptyState : null}
    </div>
  );
}
