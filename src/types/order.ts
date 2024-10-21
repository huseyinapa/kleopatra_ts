import { Product } from "./product";

export type Order = {
  id: string;
  products: Product[];
  status: string;
  date: string;
  total: number;
};

export type NewOrder = {
  orderId?: string;
  customerId?: string;
  userId?: string;
  status: string;
  statusText: string;
  totalPrice: string;
  payment: OrderPayment;
  items: OrderItem[];
  customer: OrderCustomer;
  isDelete?: boolean;
  date: string;
};

export type OrderItem = {
  orderItemId: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
};

export type OrderPayment = {
  method: string;
  amount: string;
  status: string;
};

export interface OrderCustomer {
  customerId: string;
  orderId: string;
  userId: string;
  full_name: string;
  address: string; // zipCode içinde
  city: string;
  district: string;
  phone: string;
  email: string; //? şuan yok. eklenebilir.
}
