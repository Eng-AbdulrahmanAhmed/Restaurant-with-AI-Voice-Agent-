"use client";

import { Trash2 } from "lucide-react";
import type { CartItem } from "@/types/cart";
import { PriceText } from "./AnimatedValue";
import { QtyStepper } from "./QtyStepper";

/**
 * One animated cart row, shared by the menu tray and the full cart page so
 * quantity changes, line totals and removals feel identical in both.
 *
 * At rest every row looks exactly the same, no matter how it was added.
 * Voice feedback is a temporary background tint rendered by a keyed overlay
 * (`aiHighlightSeq`), owned by `CartRowList` so only the latest voice action
 * is ever highlighted; it never touches borders or permanent styling.
 */
type CartRowProps = {
  item: CartItem;
  variant: "tray" | "cart";
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
  /** Entrance animation, set by the list when this row was just added. */
  entering?: boolean;
  /** Non-interactive clone rendered while the row animates out. */
  readonly?: boolean;
  /**
   * When defined, the row is the target of the latest voice action; the
   * sequence number keys the tint overlay so consecutive voice actions on
   * the same row restart the animation from a clean state.
   */
  aiHighlightSeq?: number;
};

/** Voice tint overlay: subtle warm cream/orange wash that fades to nothing. */
function AiHighlightOverlay({ seq }: { seq: number }) {
  return (
    <span
      key={seq}
      aria-hidden
      className="cart-fx-row-ai-tint pointer-events-none absolute inset-0 rounded-[inherit]"
    />
  );
}

export function CartRow({
  item,
  variant,
  onIncrease,
  onDecrease,
  onRemove,
  entering = false,
  readonly = false,
  aiHighlightSeq,
}: CartRowProps) {
  const accent = `${entering ? "cart-row-enter" : ""} ${readonly ? "cart-row-leave" : ""}`;

  if (variant === "tray") {
    return (
      <div
        className={`relative flex items-center justify-between gap-2.5 rounded-xl border border-ink/5 bg-cream/60 p-2 ${accent}`}
      >
        {aiHighlightSeq !== undefined && <AiHighlightOverlay seq={aiHighlightSeq} />}

        <img
          src={item.image}
          alt={item.name}
          className="flex h-11 w-11 items-center justify-center rounded-lg bg-cream-deep object-contain p-1"
        />
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-xs font-bold text-ink">
            {item.name}
            {item.variantName ? ` \u00B7 ${item.variantName}` : ""}
          </h4>
          <p className="font-display text-xs font-bold text-orange">
            <PriceText value={item.price * item.quantity} />
          </p>
        </div>

        {!readonly && (
          <QtyStepper
            size="mini"
            quantity={item.quantity}
            decreaseLabel={`Decrease ${item.name} quantity`}
            increaseLabel={`Increase ${item.name} quantity`}
            onIncrease={() => onIncrease?.()}
            onDecrease={() => onDecrease?.()}
          />
        )}

        {!readonly && (
          <button
            type="button"
            aria-label={`Remove ${item.name} from tray`}
            onClick={() => onRemove?.()}
            className="text-brown/50 transition-colors hover:text-tomato"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    );
  }

  return (
    <article
      className={`relative flex items-center gap-3 rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-[0_14px_30px_-24px_rgba(36,23,8,0.35)] ${accent}`}
    >
      {aiHighlightSeq !== undefined && <AiHighlightOverlay seq={aiHighlightSeq} />}

      <img
        src={item.image}
        alt={item.name}
        className="h-14 w-14 shrink-0 rounded-xl bg-cream-deep object-contain p-1"
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-sm font-bold text-ink">
          {item.name}
          {item.variantName ? ` \u00B7 ${item.variantName}` : ""}
        </h3>
        <p className="font-display text-sm font-bold text-orange">
          EGP {item.price.toFixed(2)}
        </p>
      </div>

      {!readonly && (
        <QtyStepper
          size="row"
          quantity={item.quantity}
          decreaseLabel={`Decrease ${item.name} quantity`}
          increaseLabel={`Increase ${item.name} quantity`}
          onIncrease={() => onIncrease?.()}
          onDecrease={() => onDecrease?.()}
        />
      )}

      <span className="font-display text-sm font-bold text-ink">
        <PriceText value={item.price * item.quantity} />
      </span>

      {!readonly && (
        <button
          type="button"
          onClick={() => onRemove?.()}
          aria-label={`Remove ${item.name}`}
          className="flex h-8 w-8 items-center justify-center rounded-full text-brown/50 transition hover:bg-tomato/10 hover:text-tomato"
        >
          <Trash2 size={14} />
        </button>
      )}
    </article>
  );
}
