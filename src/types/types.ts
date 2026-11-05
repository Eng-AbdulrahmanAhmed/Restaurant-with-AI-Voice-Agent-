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
};
