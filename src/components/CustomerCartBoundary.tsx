"use client";

import { usePathname } from "next/navigation";
import { CartProvider } from "@/context/CartContext";

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

  return <CartProvider>{children}</CartProvider>;
}
