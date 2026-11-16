"use client";

import type { ReactNode } from "react";

/**
 * Empty-cart state with the small BurgerHouse 3D takeaway-bag accent.
 *
 * The bag is pure CSS (layered gradients + transform-style: preserve-3d
 * gussets + a rope handle) — no 3D library, no emoji. It floats gently and
 * tilts slightly; everything is disabled under reduced motion.
 */
type EmptyTrayStateProps = {
  title: string;
  description: string;
  /** Optional call-to-action under the copy. */
  children?: ReactNode;
  /** "page" uses slightly larger vertical padding. */
  variant?: "tray" | "page";
};

export function EmptyTrayState({ title, description, children, variant = "tray" }: EmptyTrayStateProps) {
  const wrapper =
    variant === "page"
      ? "cart-empty-in mt-10 rounded-[1.75rem] border border-dashed border-ink/15 bg-white/60 p-12 text-center"
      : "cart-empty-in py-8 text-center";

  return (
    <div className={wrapper}>
      <div
        aria-hidden
        className="cart-3d-scene mx-auto flex h-[118px] w-[110px] items-end justify-center"
      >
        <div>
          <div className="cart-3d-bag mx-auto h-[84px] w-[74px]">
            <div className="cart-3d-bag-handle" />
            <div className="cart-3d-bag-body relative">
              <div className="cart-3d-bag-band font-display text-[7px] font-black uppercase tracking-[0.14em] text-cream">
                BurgerHouse
              </div>
            </div>
            <div className="cart-3d-bag-gusset cart-3d-bag-gusset-left" />
            <div className="cart-3d-bag-gusset cart-3d-bag-gusset-right" />
          </div>
          <div className="cart-3d-bag-shadow" />
        </div>
      </div>

      <h2 className="mt-3 font-display text-lg font-bold text-ink">{title}</h2>
      <p className="mt-1 text-xs text-brown/60">{description}</p>
      {children}
    </div>
  );
}
