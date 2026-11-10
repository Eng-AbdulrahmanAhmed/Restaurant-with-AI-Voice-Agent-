  import type { MenuProduct } from "@/types/types";

  export type CartItem = {
    id: string;
    productId: string;
    variantId: string;
    name: string;
    variantName: string;
    price: number;
    image: string;
    quantity: number;
  };

  export type AddToCartInput = {
    product: Pick<MenuProduct, "id" | "name" | "image" | "variants">;
    quantity?: number;
    variantId?: string;
  };
