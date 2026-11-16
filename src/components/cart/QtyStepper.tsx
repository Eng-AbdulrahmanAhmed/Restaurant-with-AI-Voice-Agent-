"use client";

import { Minus, Plus } from "lucide-react";
import { useState, type AnimationEvent } from "react";
import { AnimatedCount } from "./AnimatedValue";

/**
 * The shared quantity stepper used by product cards, tray rows and cart rows
 * so quantity changes feel identical everywhere.
 *
 * Press feedback is immediate (it is a control response, not a success
 * claim); the animated count only moves when cart state actually changes.
 */
type QtyStepperProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  /** Matches the three places steppers appear. */
  size?: "card" | "row" | "mini";
  /** Brief accent when the last change on this item came from the assistant. */
  aiActive?: boolean;
  decreaseLabel?: string;
  increaseLabel?: string;
};

const SIZE_STYLES = {
  card: {
    wrap: "gap-1.5 rounded-full border border-ink/10 bg-cream p-1",
    button: "flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-transform active:scale-90",
    minus: "bg-white text-brown transition-colors hover:bg-tomato/10 hover:text-tomato",
    plus: "bg-orange text-cream shadow-sm transition-colors hover:bg-orange-deep",
    count: "w-6 text-center text-xs font-extrabold text-ink",
  },
  row: {
    wrap: "gap-1.5 rounded-full border border-ink/10 bg-cream p-1",
    button: "flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-transform active:scale-90",
    minus: "bg-white text-brown transition-colors hover:bg-tomato/10 hover:text-tomato",
    plus: "bg-orange text-cream shadow-sm transition-colors hover:bg-orange-deep",
    count: "w-7 text-center text-xs font-extrabold text-ink",
  },
  mini: {
    wrap: "gap-1 rounded-full border border-ink/10 bg-white p-0.5",
    button: "flex h-5 w-5 items-center justify-center rounded-full transition-transform active:scale-90",
    minus: "text-brown hover:bg-cream",
    plus: "text-brown hover:bg-cream",
    count: "w-4 text-center text-[11px] font-bold",
  },
} as const;

export function QtyStepper({
  quantity,
  onIncrease,
  onDecrease,
  size = "row",
  aiActive = false,
  decreaseLabel,
  increaseLabel,
}: QtyStepperProps) {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const styles = SIZE_STYLES[size];

  const clearFlash = (event: AnimationEvent<HTMLElement>) => {
    if (event.animationName.startsWith("cart-btn-flash")) setFlash(null);
  };

  return (
    <div
      className={`flex items-center ${styles.wrap} ${aiActive ? "ring-2 ring-orange/50" : ""} transition-shadow`}
    >
      <button
        type="button"
        aria-label={decreaseLabel ?? "Decrease quantity"}
        onClick={() => {
          setFlash("down");
          onDecrease();
        }}
        onAnimationEnd={clearFlash}
        className={`${styles.button} ${styles.minus} ${flash === "down" ? "cart-fx-btn-down" : ""}`}
      >
        <Minus size={size === "mini" ? 11 : 13} />
      </button>
      <span className={styles.count}>
        <AnimatedCount value={quantity} />
      </span>
      <button
        type="button"
        aria-label={increaseLabel ?? "Increase quantity"}
        onClick={() => {
          setFlash("up");
          onIncrease();
        }}
        onAnimationEnd={clearFlash}
        className={`${styles.button} ${styles.plus} ${flash === "up" ? "cart-fx-btn-up" : ""}`}
      >
        <Plus size={size === "mini" ? 11 : 13} />
      </button>
    </div>
  );
}
