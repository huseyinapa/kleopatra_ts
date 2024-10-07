import { Product } from "./product";

export type Order = {
  id: string;
  products: Product[];
  status: string;
  date: string;
  total: number;
};

export type NewOrder = {
  orderId: string;
  userId: string;
  status: number;
  totalPrice: number;
  date: string;
  isDelete: boolean;
  orders?: OrderItem[];
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
};

export interface OrderCustomer {
  customerId?: string;
  orderId: string;
  userId: string;
  full_name: string;
  address: string; // zipCode içinde
  city: string;
  district: string;
  phone: string;
  email?: string; //? eklenebilir
}
