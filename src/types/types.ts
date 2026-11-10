export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  stock?: number | null;
  popular?: boolean;
  spicy?: boolean;
  variants?: MenuProductVariant[];
};

export type MenuProductVariant = {
  id: string;
  name: string;
  price: number;
  calories: number | null;
};

export type MenuProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  popular?: boolean;
  prepTime: string;
  calories: string;
  ingredients: string[];
  spicy?: boolean;
  aliases: string[];
  variants: MenuProductVariant[];
};
