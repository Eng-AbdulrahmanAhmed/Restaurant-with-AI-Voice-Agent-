
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { CartItem, AddToCartInput } from "@/types/cart";
import {
  emitCartBusEvent,
  type CartEventSource,
  type CartFeedbackEvent,
} from "@/lib/cartFeedback";

const STORAGE_KEY = "burgerhouse-cart";

type CartActionResult = {
  success: boolean;
  message: string;
};

type CartAcknowledgement = {
  requestId: number;
  result: CartActionResult;
  feedback?: CartFeedbackEvent;
};

type CartState = {
  items: CartItem[];
  revision: number;
  acknowledgements: CartAcknowledgement[];
};

type CartAction =
  | { type: "HYDRATE"; payload: CartItem[] }
  | {
      type: "ADD";
      requestId: number;
      source: CartEventSource;
      payload: {
        product: AddToCartInput["product"];
        quantity: number;
        variantId?: string;
      };
    }
  | {
      type: "UPDATE_QTY";
      requestId: number;
      source: CartEventSource;
      payload: { id: string; delta: number };
    }
  | {
      type: "REMOVE";
      requestId: number;
      source: CartEventSource;
      payload: { id: string };
    }
  | {
      type: "CLEAR";
      requestId: number;
      source: CartEventSource;
    }
  | {
      type: "ACKNOWLEDGEMENTS_PROCESSED";
      requestIds: number[];
    };


type PendingCartAction = {
  requestId: number;
  source: CartEventSource;
  type: "ADD" | "UPDATE_QTY" | "REMOVE" | "CLEAR";
  id?: string;
  quantity?: number;
  delta?: number;
  resolve: (result: CartActionResult) => void;
};

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
      return {
        ...state,
        items: action.payload.filter(isCartItem),
      };

    case "ACKNOWLEDGEMENTS_PROCESSED": {
      const processedIds = new Set(action.requestIds);

      return {
        ...state,
        acknowledgements: state.acknowledgements.filter(
          (ack) => !processedIds.has(ack.requestId)
        ),
      };
    }

    case "ADD": {
      const { product, quantity, variantId } = action.payload;
      const variant =
        product.variants.find((v) => v.id === variantId) ??
        product.variants[0];

      if (!variant) {
        return {
          ...state,
          acknowledgements: [
            ...state.acknowledgements,
            {
              requestId: action.requestId,
              result: {
                success: false,
                message: "No valid product variant was found.",
              },
            },
          ],
        };
      }

      const safeQuantity = normalizeQuantity(quantity);
      const existing = state.items.find((item) => item.id === variant.id);

      const addedItem: CartItem = existing
        ? { ...existing, quantity: existing.quantity + safeQuantity }
        : {
            id: variant.id,
            productId: product.id,
            variantId: variant.id,
            name: product.name,
            variantName: variant.name,
            price: variant.price,
            image: product.image,
            quantity: safeQuantity,
          };

      const nextItems = existing
        ? state.items.map((item) =>
            item.id === variant.id ? addedItem : item
          )
        : [...state.items, addedItem];

      const feedback: CartFeedbackEvent = existing
        ? {
            kind: "increase",
            source: action.source,
            requestId: String(action.requestId),
            id: addedItem.id,
            productId: addedItem.productId,
            variantId: addedItem.variantId,
            name: addedItem.name,
            image: addedItem.image,
            quantity: addedItem.quantity,
            delta: safeQuantity,
            at: 0,
          }
        : {
            kind: "add",
            source: action.source,
            requestId: String(action.requestId),
            id: addedItem.id,
            productId: addedItem.productId,
            variantId: addedItem.variantId,
            name: addedItem.name,
            image: addedItem.image,
            quantity: addedItem.quantity,
            at: 0,
          };

      return {
        items: nextItems,
        revision: state.revision + 1,
        acknowledgements: [
          ...state.acknowledgements,
          {
            requestId: action.requestId,
            result: {
              success: true,
              message: "Cart updated successfully.",
            },
            feedback,
          },
        ],
      };
    }

    case "UPDATE_QTY": {
      const { id, delta } = action.payload;
      const safeDelta = normalizeDelta(delta);
      const existing = state.items.find((item) => item.id === id);

      if (!existing || safeDelta === 0) {
        return {
          ...state,
          acknowledgements: [
            ...state.acknowledgements,
            {
              requestId: action.requestId,
              result: {
                success: false,
                message: "The requested quantity change was not applied.",
              },
            },
          ],
        };
      }

      const nextQuantity = existing.quantity + safeDelta;

      const nextItems =
        nextQuantity <= 0
          ? state.items.filter((item) => item.id !== id)
          : state.items.map((item) =>
              item.id === id
                ? { ...item, quantity: nextQuantity }
                : item
            );

      const feedback: CartFeedbackEvent =
        nextQuantity <= 0
          ? {
              kind: "remove",
              source: action.source,
              requestId: String(action.requestId),
              id: existing.id,
              productId: existing.productId,
              variantId: existing.variantId,
              name: existing.name,
              image: existing.image,
              at: 0,
            }
          : {
              kind: safeDelta > 0 ? "increase" : "decrease",
              source: action.source,
              requestId: String(action.requestId),
              id: existing.id,
              productId: existing.productId,
              variantId: existing.variantId,
              name: existing.name,
              image: existing.image,
              quantity: nextQuantity,
              delta: safeDelta,
              at: 0,
            };

      return {
        items: nextItems,
        revision: state.revision + 1,
        acknowledgements: [
          ...state.acknowledgements,
          {
            requestId: action.requestId,
            result: {
              success: true,
              message: "Cart updated successfully.",
            },
            feedback,
          },
        ],
      };
    }

    case "REMOVE": {
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (!existing) {
        return {
          ...state,
          acknowledgements: [
            ...state.acknowledgements,
            {
              requestId: action.requestId,
              result: {
                success: false,
                message: "The requested cart item was not found.",
              },
            },
          ],
        };
      }

      const feedback: CartFeedbackEvent = {
        kind: "remove",
        source: action.source,
        requestId: String(action.requestId),
        id: existing.id,
        productId: existing.productId,
        variantId: existing.variantId,
        name: existing.name,
        image: existing.image,
        at: 0,
      };

      return {
        items: state.items.filter(
          (item) => item.id !== action.payload.id
        ),
        revision: state.revision + 1,
        acknowledgements: [
          ...state.acknowledgements,
          {
            requestId: action.requestId,
            result: {
              success: true,
              message: "Cart item removed successfully.",
            },
            feedback,
          },
        ],
      };
    }

    case "CLEAR": {
      if (state.items.length === 0) {
        return {
          ...state,
          acknowledgements: [
            ...state.acknowledgements,
            {
              requestId: action.requestId,
              result: {
                success: false,
                message: "The cart is already empty.",
              },
            },
          ],
        };
      }

      const feedback: CartFeedbackEvent = {
        kind: "clear",
        source: action.source,
        requestId: String(action.requestId),
        at: 0,
      };

      return {
        items: [],
        revision: state.revision + 1,
        acknowledgements: [
          ...state.acknowledgements,
          {
            requestId: action.requestId,
            result: {
              success: true,
              message: "Cart cleared successfully.",
            },
            feedback,
          },
        ],
      };
    }

    default:
      return state;
  }
}



type CartContextValue = {
  cart: CartItem[];
  addToCart: (
  product: AddToCartInput["product"],
  quantity?: number,
  variantId?: string,
  source?: CartEventSource
) => Promise<CartActionResult>;

updateCartQty: (
  id: string,
  delta: number,
  source?: CartEventSource
) => Promise<CartActionResult>;

removeCartItem: (
  id: string,
  source?: CartEventSource
) => Promise<CartActionResult>;

clearCart: (source?: CartEventSource) => Promise<CartActionResult>;
  totalItemCount: number;
  subtotal: number;
  /** True once localStorage has been restored; animated values stay silent until then. */
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
const [state, dispatch] = useReducer(cartReducer, {
  items: [],
  revision: 0,
  acknowledgements: [],
});
  const [hydrated, setHydrated] = useState(false);

  // Actions that were requested but not yet matched to a committed state
  // change. Cleared on every commit.
  const pendingActionsRef = useRef<PendingCartAction[]>([]);
  const requestCounterRef = useRef(0);
  const processedAcknowledgementsRef = useRef(new Set<number>());
  // Diff bookkeeping for feedback events (last processed revision / commit).

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
  (
    product: AddToCartInput["product"],
    quantity = 1,
    variantId?: string,
    source: CartEventSource = "manual"
  ): Promise<CartActionResult> => {
    return new Promise((resolve) => {
      const variant =
        product.variants.find((candidate) => candidate.id === variantId) ??
        product.variants[0];

      if (!variant) {
        resolve({
          success: false,
          message: "No valid product variant was found.",
        });
        return;
      }

      const requestId = ++requestCounterRef.current;
      const safeQuantity = normalizeQuantity(quantity);

      pendingActionsRef.current.push({
        requestId,
        source,
        type: "ADD",
        id: variant.id,
        quantity: safeQuantity,
        resolve,
      });

      dispatch({
        type: "ADD",
        requestId,
        source,
        payload: { product, quantity: safeQuantity, variantId },
      });
    });
  },
  []
);

const updateCartQty = useCallback(
  (
    id: string,
    delta: number,
    source: CartEventSource = "manual"
  ): Promise<CartActionResult> => {
    return new Promise((resolve) => {
      const safeDelta = normalizeDelta(delta);

      if (!id || safeDelta === 0) {
        resolve({
          success: false,
          message: "Invalid item or quantity change.",
        });
        return;
      }

      const requestId = ++requestCounterRef.current;

      pendingActionsRef.current.push({
        requestId,
        source,
        type: "UPDATE_QTY",
        id,
        delta: safeDelta,
        resolve,
      });

      dispatch({
        type: "UPDATE_QTY",
        requestId,
        source,
        payload: { id, delta: safeDelta },
      });
    });
  },
  []
);

const removeCartItem = useCallback(
  (
    id: string,
    source: CartEventSource = "manual"
  ): Promise<CartActionResult> => {
    return new Promise((resolve) => {
      if (!id) {
        resolve({
          success: false,
          message: "Invalid cart item ID.",
        });
        return;
      }

      const requestId = ++requestCounterRef.current;

      pendingActionsRef.current.push({
        requestId,
        source,
        type: "REMOVE",
        id,
        resolve,
      });

      dispatch({
        type: "REMOVE",
        requestId,
        source,
        payload: { id },
      });
    });
  },
  []
);

const clearCart = useCallback(
  (source: CartEventSource = "manual"): Promise<CartActionResult> => {
    return new Promise((resolve) => {
      const requestId = ++requestCounterRef.current;

      pendingActionsRef.current.push({
        requestId,
        source,
        type: "CLEAR",
        resolve,
      });

      dispatch({
        type: "CLEAR",
        source,
        requestId,
      });
    });
  },
  []
);


  /**
   * Turns committed cart changes into exactly one feedback event per real
   * change, tagged with the originating source (manual vs. voice).
   *
   * Safety properties:
   *   - Runs on committed state only, and diffs against the previous commit —
   *     never against transient render state.
   *   - React StrictMode replays effects with the same refs, and the
   *     revision check makes the replay a no-op (no duplicate animations).
   *   - Hydration / cross-tab `HYDRATE` never bumps `revision`, and skipped
   *     commits still keep the prev/next refs in sync, so refresh-restore,
     *     first mount and other-tab updates never emit events.
   *   - Only emits when the change came from a tracked action (pending
   *     queue non-empty), and only for items that genuinely changed.
   */


useEffect(() => {
  if (state.acknowledgements.length === 0) return;

  const pendingByRequestId = new Map(
    pendingActionsRef.current.map((action) => [
      action.requestId,
      action,
    ]),
  );

  const processedIds: number[] = [];

  for (const acknowledgement of state.acknowledgements) {
    const { requestId, result, feedback } = acknowledgement;

    if (processedAcknowledgementsRef.current.has(requestId)) {
      continue;
    }

    processedAcknowledgementsRef.current.add(requestId);
    processedIds.push(requestId);

    const pendingAction = pendingByRequestId.get(requestId);
    pendingAction?.resolve(result);

    if (hydrated && result.success && feedback) {
      emitCartBusEvent({
        ...feedback,
        at: Date.now(),
      });
    }
  }

  if (processedIds.length > 0) {
    const processedSet = new Set(processedIds);

    pendingActionsRef.current =
      pendingActionsRef.current.filter(
        (action) => !processedSet.has(action.requestId),
      );

    dispatch({
      type: "ACKNOWLEDGEMENTS_PROCESSED",
      requestIds: processedIds,
    });
  }
}, [state.acknowledgements, hydrated]);



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
      hydrated,
    }),
    [state.items, addToCart, updateCartQty, removeCartItem, clearCart, totalItemCount, subtotal, hydrated]
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
