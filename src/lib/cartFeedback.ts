/**
 * Cart feedback event bus.
 *
 * The single source of truth for "what actually changed in the cart" is the
 * committed cart state inside `CartContext`. This module is the lightweight
 * side-channel that turns committed state changes into typed events the UI
 * can animate against — it holds NO cart data of its own.
 *
 * Event flow:
 *   1. A UI (or voice RPC) calls `addToCart` / `updateCartQty` / ... with an
 *      optional `source` ("manual" | "voice").
 *   2. `CartContext` records that action as "pending", dispatches to the
 *      reducer, and after the state commits diffs previous vs. next items.
 *   3. Every real change becomes exactly one `CartFeedbackEvent` emitted here.
 *   4. Any mounted component (tray row, cart page, badge...) can subscribe.
 *
 * Guarantees this design gives us:
 *   - Hydration, refresh-restore and cross-tab sync dispatch `HYDRATE` with no
 *     pending action, so they never produce events (no fake "just added").
 *   - No-op actions (invalid variant, delta 0, removing an absent id) never
 *     change state, so they never produce events (no fake success).
 *   - Rapid successive actions each produce their own event, matched per item.
 */

import { useEffect, useRef } from "react";

export type CartEventKind = "add" | "increase" | "decrease" | "remove" | "clear";

/** Where the change originated. */
export type CartEventSource = "manual" | "voice";

export type CartFeedbackEvent = {
  kind: CartEventKind;
  source: CartEventSource;
  /** Unique per action; lets consumers correlate events (e.g. StrictMode safety). */
  requestId: string;
  /** Snapshot of the affected item (already resolved from committed state). */
  id?: string;
  productId?: string;
  variantId?: string;
  name?: string;
  image?: string;
  /** Resulting quantity of the affected item after the change. */
  quantity?: number;
  /** Quantity delta for increase/decrease. */
  delta?: number;
  at: number;
};

export type CartBusEvent = CartFeedbackEvent;

type Listener = (event: CartBusEvent) => void;

const listeners = new Set<Listener>();

export function emitCartBusEvent(event: CartBusEvent): void {
  for (const listener of listeners) {
    listener(event);
  }
}

export function onCartBusEvent(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * React binding for the cart event bus. The handler is kept in a ref so
 * consumers can pass inline closures without resubscribing on every render.
 */
export function useCartBusEvent(handler: (event: CartBusEvent) => void): void {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => onCartBusEvent((event) => handlerRef.current(event)), []);
}
