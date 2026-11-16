"use client";

import { useEffect, useRef, useState } from "react";
import { useCartBusEvent } from "@/lib/cartFeedback";

/**
 * Screen-reader status region for meaningful cart changes.
 *
 * Concise, coalesced messages (rapid bursts announce once); it never
 * narrates animation frames and duplicates nothing the visual layer shows.
 */
const FLUSH_DELAY_MS = 300;

export function CartAnnouncer() {
  const [message, setMessage] = useState("");
  const pendingRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useCartBusEvent((event) => {
    // Fly-impact events are for the cart icon only.

    const name = event.name ?? "Item";
    let text: string | null = null;

    switch (event.kind) {
      case "add":
        text = `${event.quantity ?? 1}x ${name} added to your tray.`;
        break;
      case "increase":
        text = `${name} increased to ${event.quantity ?? ""}x.`;
        break;
      case "decrease":
        text = `${name} decreased to ${event.quantity ?? ""}x.`;
        break;
      case "remove":
        text = `${name} removed from your tray.`;
        break;
      case "clear":
        text = "Your tray was cleared.";
        break;
      default:
        return;
    }

    if (!text) return;

    // Coalesce bursts: keep only the newest pending message.
    pendingRef.current = text;
    if (timerRef.current !== null) return;
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      if (pendingRef.current !== null) {
        setMessage(pendingRef.current);
        pendingRef.current = null;
      }
    }, FLUSH_DELAY_MS);
  });

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div aria-live="polite" role="status" className="sr-only">
      {message}
    </div>
  );
}
