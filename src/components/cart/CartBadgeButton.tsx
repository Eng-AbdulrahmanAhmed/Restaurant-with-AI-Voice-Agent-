"use client";

import { ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCartBusEvent } from "@/lib/cartFeedback";
import { AnimatedCount } from "./AnimatedValue";

/**
 * The menu header cart button. Reacts to real cart feedback events:
 *
 * - manual add: immediate short bounce on the committed add;
 * - voice action: synchronized bounce + orange AI pulse and a small
 *   voice-wave accent so the origin is visible;
 * - any other change: the animated count carries the feedback.
 */
type CartBadgeButtonProps = {
  count: number;
  onClick: () => void;
  ariaLabel?: string;
};

const AI_INDICATOR_MS = 1600;

export function CartBadgeButton({ count, onClick, ariaLabel }: CartBadgeButtonProps) {
  const [impactKey, setImpactKey] = useState(0);
  const [aiActive, setAiActive] = useState(false);
  const aiTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (aiTimerRef.current !== null) clearTimeout(aiTimerRef.current);
    };
  }, []);

  const triggerImpact = () => {
    setImpactKey((key) => key + 1);
  };

  const triggerAiIndicator = () => {
    setAiActive(true);
    if (aiTimerRef.current !== null) clearTimeout(aiTimerRef.current);
    aiTimerRef.current = window.setTimeout(() => setAiActive(false), AI_INDICATOR_MS);
  };

  useCartBusEvent((event) => {
    if (event.source === "voice") {
      // Every voice action gets the synchronized bounce + AI pulse/wave so
      // the origin is visible without touching any cart row styling.
      triggerAiIndicator();
      triggerImpact();
      return;
    }

    // Manual: bounce on add (committed event, not on the click); other
    // manual changes are carried by the animated count alone.
    if (event.kind === "add") triggerImpact();
  });

  return (
    <button
      type="button"
      data-cart-target
      onClick={onClick}
      aria-label={ariaLabel ?? `Open order tray (${count} items)`}
      className="relative flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2.5 shadow-sm transition hover:border-orange"
    >
      <span key={impactKey} className={`inline-flex ${impactKey > 0 ? "cart-fx-icon-bounce cart-fx-icon-glow" : ""}`}>
        <ShoppingCart size={18} className="text-orange" />
      </span>
      <span className="text-xs font-bold">
        <AnimatedCount value={count} />
      </span>
      {aiActive && (
        <span
          aria-hidden
          className="cart-fx-ai-pulse pointer-events-none absolute -inset-1 rounded-full"
        >
          <span className="absolute -right-1 -top-1 flex h-3.5 items-end gap-[2px] rounded-full bg-orange px-[3px] pb-[3px] pt-[2px]">
            <span className="cart-ai-wave-bar h-[3px] w-[2px] rounded-full bg-cream" />
            <span className="cart-ai-wave-bar h-[5px] w-[2px] rounded-full bg-cream [animation-delay:120ms]" />
            <span className="cart-ai-wave-bar h-[4px] w-[2px] rounded-full bg-cream [animation-delay:240ms]" />
          </span>
        </span>
      )}
    </button>
  );
}
