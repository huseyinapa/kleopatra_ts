/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import Nav from "@/app/_components/nav";
import Footer from "@/app/_components/footer";
import OrderCard from "./_components/OrderCard";
import ModalDetails from "./modal/ModalDetails";
import NewOrderManager from "@/services/newOrder";
import { NewOrder, OrderCustomer, OrderItem } from "@/types/order";
import { Detail } from "@/types/detail";

export default function OrderPage() {
  const [orders, setOrders] = useState<NewOrder[]>([]);
  const [details, setDetails] = useState<Detail[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const id = localStorage.getItem("id");
      if (!id) return;

      // Müşterinin siparişlerini al
      const orderData = await NewOrderManager.retrieveCustomerOrders(id);
      if (!orderData || orderData.length === 0) return;

      // Her sipariş için sipariş ürünlerini al
      const orderItems = await Promise.all(
        orderData.map(async (order: NewOrder) => {
          return await NewOrderManager.retrieveOrderItems(order.orderId!);
        })
      );

      const orderCustomer = await Promise.all(
        orderData.map(async (customer: NewOrder) => {
          return await NewOrderManager.retrieveOrderCustomer(customer.orderId!);
        })
      );

      // Siparişleri ve ürünleri birleştir
      const orderArray: NewOrder[] = orderData.map(
        (order: NewOrder, index: number) => {
          // // console.log("orderCustomer: ", orderCustomer[index]);
          //
          const items = (orderItems[index] || []).map(
            (item: OrderItem) => item
          );

          if (orderCustomer[index] === null) {
            // console.log("order: ", orderData[index]);
          }

          let customer: OrderCustomer;
          if (orderCustomer[index] === null)
            customer = {
              customerId: "",
              orderId: "",
              userId: "",
              full_name: "",
              address: "",
              city: "",
              district: "",
              phone: "",
              email: "",
            };
          else
            customer = {
              ...orderCustomer[index],
            };

          // console.log("customer: ", customer);

          return {
            orderId: order.orderId!,
            status: order.status,
            statusText: getOrderStatus(order.status),
            items: items,
            customer: customer,
            payment: { method: "", amount: "", status: "" }, //! payment bilgisi eklenecek
            totalPrice: order.totalPrice,
            isDelete: false,
            date: order.date,
          };
        }
      );

      // Siparişleri tarih sırasına göre sırala
      orderArray.sort((a, b) => parseInt(b.date) - parseInt(a.date));

      // Durum güncellemesi
      setOrders(orderArray);
    } catch (error) {
      console.error(error);
      toast.error("Beklenmedik bir sorun oluştu. Hata kodu: O-25");
    }
  };

  const getOrderStatus = (statusCode: string) => {
    switch (statusCode) {
      case "0":
        return "Onay bekliyor";
      case "1":
        return "Onaylandı";
      case "2":
        return "Kargoda";
      case "3":
        return "Teslim edildi";
      case "4":
        return "İptal Edildi!";
      default:
        return "Onay bekleniyor..";
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const cancelOrderForm = new FormData();
      cancelOrderForm.append("orderId", orderId);
      cancelOrderForm.append("status", "4");

      const cancelledOrder = await NewOrderManager.cancelOrder(cancelOrderForm);
      if (cancelledOrder) {
        toast.success(`${orderId} siparişiniz iptal edilmiştir!`);
        fetchOrders();
        return true;
      } else {
        toast.error("İptal işlemi gerçekleştirilemedi.");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Beklenmedik bir sorun oluştu. Hata kodu: CO-8");
      return false;
    }
  };

  return (
    <main data-theme="valentine" className="min-w-fit">
      <title>Kleopatra - Siparişlerim</title>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Nav />
      <div className="min-h-96">
        <h1 className="ml-10 mb-4 text-start font-bold text-2xl">
          Siparişlerim
        </h1>
        <div className="mx-auto">
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrderCard
                key={order.orderId}
                data={order}
                setDetails={setDetails}
                cancelOrder={cancelOrder}
              />
            ))
          ) : (
            <div className="mx-auto w-96 text-center h-32">
              Siparişiniz bulunmamaktadır.
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ModalDetails details={details} />
    </main>
  );
}
