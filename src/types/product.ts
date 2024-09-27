export type Product = {
  id: string;
  name: string;
  size?: string;
  type?: string;
  featured?: boolean;
  description: string;
  stock: number;
  image: string;
  price: string;
  index?: number;
};
