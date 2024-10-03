export type CardInfo = {
  cardHolderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
};

export interface PaymentData {
  price?: string;
  paymentCard: {
    cardHolderName?: string;
    cardNumber?: string;
    expireMonth?: string;
    expireYear?: string;
    cvc?: string;
    registerCard?: "0";
  };
  buyer?: {
    id: string;
    name: string;
    surname: string;
    gsmNumber: string;
    email: string;
    identityNumber: string;
    lastLoginDate: string;
    registrationDate: string;
    registrationAddress: string;
    ip: string | number;
    city: string;
    country: "Turkey";
    zipCode: string | number;
  };
  shippingAddress?: {
    contactName: string;
    city: string;
    country: "Turkey";
    address: string;
    zipCode: string | number;
  };
  billingAddress?: {
    contactName: string;
    city: string;
    country: "Turkey";
    address: string;
    zipCode: string | number;
  };
  basketItems?: {
    id?: string;
    name: string;
    category1: string;
    category2: string;
    itemType: string;
    price: string;
  }[];
}

export type PaymentTable = {
  paymentId: string;
  orderId: string;
  userId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  method: string;
  discount: number;
  tax: number;
  fee: number;
  paymentData: PaymentData;
};
