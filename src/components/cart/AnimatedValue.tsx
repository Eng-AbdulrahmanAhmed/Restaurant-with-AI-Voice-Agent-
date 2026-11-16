"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";

/**
 * A number/price that animates whenever its value changes:
 * the previous value leaves, the new value rolls in from the direction of
 * the change with a brief orange flash. Pure transform/opacity/color — no
 * layout reads or writes.
 *
 * The display always settles on the real value derived from cart state;
 * this component never keeps its own source of truth.
 *
 * While the cart is not yet hydrated (mount, refresh-restore, cross-tab
 * sync) value changes are applied silently so restored carts never look
 * like items were "just added".
 */
type AnimatedValueProps = {
  value: number;
  /** Format the displayed number. Defaults to a plain integer. */
  format?: (value: number) => string;
  className?: string;
  /** Smoothly count from the previous value to the new one (best for totals). */
  interpolate?: boolean;
};

const INTERPOLATE_DURATION_MS = 240;

export function AnimatedValue({
  value,
  format = (candidate) => String(Math.round(candidate)),
  className,
  interpolate = false,
}: AnimatedValueProps) {
  const { hydrated } = useCart();
  const [state, setState] = useState({ shown: value, key: 0, dir: "up" as "up" | "down" });
  const prevRef = useRef(value);
  const wasHydratedRef = useRef(false);

  useEffect(() => {
    const justHydrated = hydrated && !wasHydratedRef.current;
    wasHydratedRef.current = hydrated;

    // 1) Before hydration (mount, refresh-restore, cross-tab sync) values
    //    update silently — a restored cart must not look freshly added.
    // 2) The hydrate transition itself is also silent: the very first filled
    //    values are the restored cart, not an interaction.
    if (!hydrated || justHydrated) {
      prevRef.current = value;
      const raf = requestAnimationFrame(() => {
        setState((current) =>
          current.shown === value ? current : { ...current, shown: value }
        );
      });
      return () => cancelAnimationFrame(raf);
    }

    const from = prevRef.current;
    if (from === value) return;
    prevRef.current = value;

    const dir = value > from ? "up" : "down";
    let loopRaf: number | null = null;

    // All state updates happen inside animation callbacks (never
    // synchronously in the effect body).
    const raf = requestAnimationFrame(() => {
      setState((current) => ({ shown: from, key: current.key + 1, dir }));

      if (!interpolate) {
        setState((current) => ({ ...current, shown: value }));
        return;
      }

      const startedAt = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / INTERPOLATE_DURATION_MS);
        const eased = 1 - Math.pow(1 - progress, 3);
        const shown = from + (value - from) * eased;
        setState((current) => ({ ...current, shown }));
        if (progress < 1) loopRaf = requestAnimationFrame(step);
      };
      loopRaf = requestAnimationFrame(step);
    });

    return () => {
      cancelAnimationFrame(raf);
      if (loopRaf !== null) cancelAnimationFrame(loopRaf);
    };
  }, [value, hydrated, interpolate]);

  return (
    <span
      key={state.key}
      data-dir={state.dir}
      className={`cart-value-in ${className ?? ""}`}
    >
      {format(state.shown)}
    </span>
  );
}

/** Animated "EGP 123.45" money text used for totals and line totals. */
export function PriceText({
  value,
  className,
  interpolate = false,
}: {
  value: number;
  className?: string;
  interpolate?: boolean;
}) {
  return (
    <AnimatedValue
      value={value}
      format={(candidate) => `EGP ${candidate.toFixed(2)}`}
      className={className}
      interpolate={interpolate}
    />
  );
}

/** Animated integer used for cart counts. */
export function AnimatedCount({ value, className }: { value: number; className?: string }) {
  return (
    <AnimatedValue
      value={value}
      format={(candidate) => String(Math.max(0, Math.round(candidate)))}
      className={className}
    />
  );
}
