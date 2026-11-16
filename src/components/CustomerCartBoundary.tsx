"use client";

import { usePathname } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import { CartAnnouncer } from "@/components/cart/CartAnnouncer";

export function CustomerCartBoundary({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isCustomerRoute =
    pathname === "/" ||
    pathname.startsWith("/menu") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/table-selection") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/reserve");

  if (!isCustomerRoute) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      {children}
      {/* One screen-reader status region for all customer cart routes. */}
      <CartAnnouncer />
    </CartProvider>
  );
}
