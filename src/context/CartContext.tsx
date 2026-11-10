"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { ReactNode } from "react";
import type { CartItem, AddToCartInput } from "@/types/cart";

const STORAGE_KEY = "burgerhouse-cart";

type CartState = { items: CartItem[] };

type CartAction =
  | { type: "HYDRATE"; payload: CartItem[] }
  | { type: "ADD"; payload: AddToCartInput }
  | { type: "UPDATE_QTY"; payload: { id: string; delta: number } }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "CLEAR" };

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    item.id.length > 0 &&
    typeof item.productId === "string" &&
    item.productId.length > 0 &&
    typeof item.variantId === "string" &&
    item.variantId.length > 0 &&
    typeof item.name === "string" &&
    item.name.length > 0 &&
    typeof item.variantName === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    typeof item.image === "string" &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

function normalizeQuantity(quantity: unknown) {
  if (typeof quantity !== "number" || !Number.isFinite(quantity) || quantity <= 0) {
    return 1;
  }

  return Math.floor(quantity);
}

function normalizeDelta(delta: number) {
  if (!Number.isFinite(delta)) return 0;
  return Math.trunc(delta);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.payload.filter(isCartItem) };

    case "ADD": {
      const { product, quantity, variantId } = action.payload;
      const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];

      if (!variant) return state;

      const safeQuantity = normalizeQuantity(quantity);

      const existing = state.items.find((item) => item.id === variant.id);

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === variant.id
              ? { ...item, quantity: item.quantity + safeQuantity }
              : item
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            id: variant.id,
            productId: product.id,
            variantId: variant.id,
            name: product.name,
            variantName: variant.name,
            price: variant.price,
            image: product.image,
            quantity: safeQuantity,
          },
        ],
      };
    }

    case "UPDATE_QTY": {
      const { id, delta } = action.payload;
      const safeDelta = normalizeDelta(delta);

      if (safeDelta === 0) return state;

      return {
        items: state.items
          .map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + safeDelta }
              : item
          )
          .filter((item) => item.quantity > 0 && Number.isFinite(item.quantity)),
      };
    }

    case "REMOVE":
      return {
        items: state.items.filter((item) => item.id !== action.payload.id),
      };

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

type CartContextValue = {
  cart: CartItem[];
  addToCart: (product: AddToCartInput["product"], quantity?: number, variantId?: string) => void;
  updateCartQty: (id: string, delta: number) => void;
  removeCartItem: (id: string) => void;
  clearCart: () => void;
  totalItemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            dispatch({ type: "HYDRATE", payload: parsed.filter(isCartItem) });
          } else {
            window.localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const validItems = state.items.filter(isCartItem);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validItems));
    } catch {
      // Ignore quota/storage errors.
    }
  }, [state.items, hydrated]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      try {
        const parsed = event.newValue ? JSON.parse(event.newValue) : [];
        dispatch({ type: "HYDRATE", payload: Array.isArray(parsed) ? parsed.filter(isCartItem) : [] });
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
        dispatch({ type: "HYDRATE", payload: [] });
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addToCart = useCallback(
    (product: AddToCartInput["product"], quantity = 1, variantId?: string) => {
      dispatch({ type: "ADD", payload: { product, quantity, variantId } });
    },
    []
  );

  const updateCartQty = useCallback((id: string, delta: number) => {
    if (!Number.isFinite(delta)) return;
    dispatch({ type: "UPDATE_QTY", payload: { id, delta } });
  }, []);

  const removeCartItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE", payload: { id } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const totalItemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  );

  const subtotal = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  );

  const value = useMemo(
    () => ({
      cart: state.items,
      addToCart,
      updateCartQty,
      removeCartItem,
      clearCart,
      totalItemCount,
      subtotal,
    }),
    [state.items, addToCart, updateCartQty, removeCartItem, clearCart, totalItemCount, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
