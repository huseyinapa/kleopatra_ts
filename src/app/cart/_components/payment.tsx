/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import NewOrderManager from "@/services/newOrder";
import CartManager from "@/services/cart";
import {
  orderCustomerId,
  orderId,
  orderItemsId,
} from "@/actions/createOrderID";
import ProductManager from "@/services/product";
import Image from "next/image";
import { PayData, PaymentData } from "@/types/payment";
import { CartItem } from "@/types/cart";
import { AddressData } from "@/types/address";

interface UserData {
  id: string;
  ip: string;
  name: string;
  surname: string;
  email: string;
  address: string;
  identityNumber: string;
  phone: string;
  city: string;
  district: string;
  zipCode: string;
  last_login: string;
  date: string;
}

interface PaymentProps {
  cartItems: CartItem[];
  addressData: AddressData | null;
  setPaymentData: (data: PaymentData) => void;
  handleContinue: () => void;
}

const Payment: React.FC<PaymentProps> = ({
  cartItems,
  addressData,
  setPaymentData,
  handleContinue,
}) => {
  const [paymentData, setPayment] = useState<PaymentData>({
    cardNumber: "",
  });

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [effect, setEffect] = useState<boolean>(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const userID = localStorage.getItem("id") || "";
    const userEmail = localStorage.getItem("email") || "";
    const userLastLogin = localStorage.getItem("last_login") || "";
    const userDate = localStorage.getItem("date") || "";

    if (!addressData) {
      return setUserData(null);
    }

    setUserData({
      id: userID,
      ip: addressData.ip || "",
      name: addressData.name,
      surname: addressData.surname,
      email: userEmail,
      address: addressData.address,
      identityNumber: addressData.identityNumber,
      phone: addressData.phone,
      city: addressData.city,
      district: addressData.district,
      zipCode: addressData.zipCode,
      last_login: userLastLogin,
      date: userDate,
    });
  };

  // const getCardType = (cardNumber: string): string => {
  //   const firstDigit = cardNumber[0];
  //   if (firstDigit === "4") {
  //     return "Visa";
  //   } else if (firstDigit === "5") {
  //     return "MasterCard";
  //   }
  //   return "";
  // };

  // const cardType = getCardType(paymentData.cardNumber);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      setPayment({
        ...paymentData,
        [name]: value.replace(/\D/g, "").slice(0, 16),
      });
    } else if (name === "expiryDate") {
      let formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.replace(/^(.{2})/, "$1/");
      }
      setPayment({ ...paymentData, [name]: formattedValue });
    } else {
      setPayment({ ...paymentData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setPaymentData(paymentData);
  };

  const PaymentButton = async () => {
    if (
      !paymentData.cardHolderName ||
      paymentData.cardHolderName.trim() === ""
    ) {
      setEffect(true);
      toast.error("Kredi kartı sahibi adı boş bırakılamaz.");
      return;
    } else if (
      !paymentData.cardNumber ||
      paymentData.cardNumber.trim() === ""
    ) {
      setEffect(true);
      toast.error("Kredi kartı numarası boş bırakılamaz.");
      return;
    } else if (
      !paymentData.expiryDate ||
      paymentData.expiryDate.trim() === ""
    ) {
      setEffect(true);
      toast.error("Son kullanma tarihi boş bırakılamaz.");
      return;
    } else if (!paymentData.cvv || paymentData.cvv.trim() === "") {
      setEffect(true);
      toast.error("Kredi kartı CVV boş bırakılamaz.");
      return;
    }

    setIsLoading(true);

    const url = "https://api.gulgonenkoop.com/api/payment";

    const [expireMonth, expireYear] = paymentData.expiryDate.split("/");
    const user = userData as UserData;

    const gsmNumber = user.phone.includes("+90")
      ? user.phone
      : user.phone.includes("0")
      ? `+9${user.phone}`
      : `+90${user.phone}`;

    const basketItems = cartItems.map((item) => ({
      id: item.pid,
      name: item.name,
      category1: "Gül ürünü",
      category2: "Gül ürünü",
      itemType: "PHYSICAL",
      price: (parseFloat(item.price) * item.amount!).toFixed(2),
    }));

    const totalPrice = basketItems.reduce(
      (total, item) => total + parseFloat(item.price),
      0
    );

    const payData: PayData = {
      price: totalPrice.toFixed(2),
      paymentCard: {
        cardHolderName: paymentData.cardHolderName,
        cardNumber: paymentData.cardNumber,
        expireMonth: expireMonth,
        expireYear: `20${expireYear}`,
        cvc: paymentData.cvv,
        registerCard: "0",
      },
      buyer: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        gsmNumber: gsmNumber,
        email: user.email,
        identityNumber: user.identityNumber,
        lastLoginDate: user.last_login,
        registrationDate: user.date,
        registrationAddress: user.address,
        ip: user.ip,
        city: user.city,
        country: "Turkey",
        zipCode: user.zipCode,
      },
      shippingAddress: {
        contactName: `${user.name} ${user.surname}`,
        city: user.city,
        country: "Turkey",
        address: user.address,
        zipCode: user.zipCode,
      },
      billingAddress: {
        contactName: `${user.name} ${user.surname}`,
        city: user.city,
        country: "Turkey",
        address: user.address,
        zipCode: user.zipCode,
      },
      basketItems: basketItems,
    };

    try {
      // Ürün stok kontrolü
      for (const element of cartItems) {
        const checkProduct = await ProductManager.getProduct(element.pid!);

        if (checkProduct!.stock < element.amount!) {
          toast.error(
            "Sepetinizdeki ürünlerden bir kısmı stoklarımızda kalmamış, lütfen tekrar kontrol ediniz.",
            { duration: 5000 }
          );
          setIsLoading(false);
          return;
        }
      }

      const payResponse = await axios.post(url, payData, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });

      const pay = payResponse.data;

      if (pay.data.status === "success") {
        setPaymentData(payData.paymentCard);
        await fallingOutofCart(payData);
      } else {
        toast.error(pay.data.message);
        console.log(pay.data.message);
      }
    } catch (error) {
      toast.error("Ödeme işlemi sırasında bir hata oluştu.");
      console.log(error);
    }
    setIsLoading(false);
  };

  const fallingOutofCart = async (payData: PayData) => {
    const user = userData as UserData;

    const customer = {
      id: user.id,
      email: user.email,
      full_name: `${user.name} ${user.surname}`,
      address: `${user.address} ${user.zipCode}`,
      district: addressData!.district,
      city: user.city,
      phone: user.phone,
    };

    // const payment = {
    //   paymentId: pay.paymentId,
    //   conversationId: pay.conversationId,
    //   cardType: pay.cardType,
    //   cardFamily: pay.cardFamily,
    //   cardAssociation: pay.cardAssociation,
    // };

    const generateOrderID = await orderId();

    try {
      const id = localStorage.getItem("id") || "";

      const orderForm = new FormData();
      orderForm.append("orderId", generateOrderID);
      orderForm.append("userId", id);
      orderForm.append("status", "0");
      orderForm.append("totalPrice", payData.price);
      orderForm.append("date", Date.now().toString());
      orderForm.append("isDelete", "false");

      const orderResult = await NewOrderManager.add(orderForm);

      if (!orderResult) {
        // OrderItems tablosu için
        for (const element of cartItems) {
          const generateOrderItemID = await orderItemsId();

          const orderItemForm = new FormData();
          orderItemForm.append("orderItemId", generateOrderItemID);
          orderItemForm.append("orderId", orderResult!);
          orderItemForm.append("productId", element.id);
          orderItemForm.append("quantity", element.amount!.toString());
          orderItemForm.append("price", element.price);

          await NewOrderManager.addItems(orderItemForm);
        }

        // Customer tablosu için
        const generateCustomerID = await orderCustomerId();

        const customerForm = new FormData();
        customerForm.append("customerId", generateCustomerID);
        customerForm.append("orderId", orderResult!);
        customerForm.append("userId", customer.id);
        customerForm.append("full_name", customer.full_name);
        customerForm.append("address", customer.address);
        customerForm.append("district", customer.district);
        customerForm.append("city", customer.city);
        customerForm.append("phone", customer.phone);

        await NewOrderManager.addCustomers(customerForm);

        // Sepetten ürünleri kaldırma ve stok güncelleme
        for (const element of cartItems) {
          const cartProductForm = new FormData();
          cartProductForm.append("id", user.id);
          cartProductForm.append("pid", element.pid!);

          await CartManager.removeProductFromCart(cartProductForm);

          const checkProduct = await ProductManager.getProduct(element.pid!);
          const newStock = checkProduct!.stock - element.amount!;

          const productStockForm = new FormData();
          productStockForm.append("id", element.pid!);
          productStockForm.append("stock", newStock.toString());

          await ProductManager.fallingOutofStock(productStockForm);
        }

        toast.success(
          "Sipariş verildi. Siparişinizin onay durumunu Siparişlerim sayfasından kontrol edebilirsiniz.",
          { duration: 5000 }
        );

        handleContinue();
      } else {
        toast.error("Sipariş verilemedi");
      }
    } catch (error) {
      toast.error(`Bilinmeyen hata: Hata kodu: P-323`);
      console.log(error);
    }
  };

  return (
    <div className="flex flex-row lg:w-[500px] lg:ml-60 items-center justify-center">
      <form onSubmit={handleSubmit}>
        <div className="flex w-[340px] h-[400px] p-4 bg-[#cc3b6477] text-neutral-content justify-center items-center rounded-lg shadow-[#c2154677] shadow-lg">
          <div className="flex flex-col w-[300px] space-y-2 justify-center">
            <div className="form-control max-w-xs">
              <label htmlFor="cardNumber" className="label">
                <span className="label-text text-neutral-content font-semibold text-md">
                  Kart Numarası
                </span>
              </label>
              <input
                type="text"
                placeholder="••••  ••••  ••••  ••••"
                className="input input-bordered text-neutral w-full max-w-xs"
                id="cardNumber"
                name="cardNumber"
                maxLength={19}
                value={paymentData.cardNumber || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-control max-w-xs">
              <label htmlFor="cardHolderName" className="label">
                <span className="label-text text-neutral-content font-semibold text-md">
                  Kart Üzerindeki İsim
                </span>
              </label>
              <input
                type="text"
                placeholder="Kart sahibinin adı ve soyadı"
                id="cardHolderName"
                name="cardHolderName"
                className="input input-bordered text-neutral w-full max-w-xs"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className="form-control w-36 max-w-xs">
                <label
                  htmlFor="expiryDate"
                  className="label text-neutral-content"
                >
                  <span className="label-text text-neutral-content font-semibold text-md">
                    Son Kullanma Tarihi
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Ay / Yıl"
                  className="input input-bordered text-neutral w-full max-w-xs"
                  id="expiryDate"
                  name="expiryDate"
                  maxLength={5}
                  value={paymentData.expiryDate || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control w-32 max-w-xs">
                <label htmlFor="cvv" className="label">
                  <span className="label-text text-neutral-content font-semibold text-md">
                    CVV
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="CVC/CVV"
                  id="cvv"
                  name="cvv"
                  maxLength={3}
                  className="input input-bordered text-neutral w-full max-w-xs"
                  onChange={handleChange}
                />
              </div>
            </div>
            <button
              className={`btn ${
                effect && "animate-wiggle"
              } w-[300px] text-white font-semibold rounded-lg ${
                isLoading ? "cursor-not-allowed bg-white" : "bg-secondary"
              }`}
              disabled={isLoading}
              onAnimationEnd={() => setEffect(false)}
              type="button"
              onClick={PaymentButton}
            >
              {isLoading ? "Ödeme İşleniyor..." : "Ödemeyi Tamamla"}
            </button>
            <div className="flex flex-row items-center justify-center space-x-3">
              <Image
                src="images/icons/iyzico.svg"
                alt="iyzico"
                className="h-auto w-32 object-contain rounded-md"
                width={56}
                height={56}
              />
              <Image
                src="images/icons/mastercard.svg"
                alt="mastercard"
                className="h-auto w-14 object-contain rounded-md"
                width={56}
                height={56}
              />
              <Image
                src="images/icons/visa.svg"
                alt="visa"
                className="h-auto w-14 object-contain rounded-md"
                width={56}
                height={56}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Payment;