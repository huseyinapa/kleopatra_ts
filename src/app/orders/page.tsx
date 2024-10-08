"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import Nav from "@/app/_components/nav";
import Footer from "@/app/_components/footer";
import OrderCard from "./_components/OrderCard";
import ModalDetails from "./_components/ModalDetails";
import NewOrderManager from "@/services/newOrder";
import { NewOrder } from "@/types/order";

interface Order {
  orderId: string;
  status: string;
  statusText: string;
  payment: any;
  items: any[];
  date: string;
  customer: {
    address: string;
  };
  totalPrice: string;
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [details, setDetails] = useState<any[]>([]);

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    //! İşlevlerine göre isimler değiştirilecek.
    try {
      const id = localStorage.getItem("id");
      if (!id) return;

      const orderData = await NewOrderManager.retrieveCustomerOrders(id);
      //! Burada birden fazla tablodan veri çekiliyor. Bu verileri birleştirmek gerekiyor.
      console.log(orderData);

      if (orderData === null) return;

      const orderArray: Order[] = orderData.map((order: any) => {
        let status = "";

        switch (order["status"]) {
          case "0":
            status = "Onay bekliyor";
            break;
          case "1":
            status = "Onaylandı";
            break;
          case "2":
            status = "Kargoda";
            break;
          case "3":
            status = "Teslim edildi";
            break;
          case "4":
            status = "İptal Edildi!";
            break;
          default:
            status = "Onay bekleniyor..";
            break;
        }

        return {
          ...order,
          status: order["status"],
          statusText: status,
          payment: JSON.parse(order["payment"]), //? payment tablosu vs.
          items: JSON.parse(order["items"]), //? order_items tablosu vs.
        };
      });

      orderArray.sort((a, b) => parseInt(b.date) - parseInt(a.date));

      setOrders(orderArray);
    } catch (error) {
      console.log(error);
      toast.error("Beklenmedik bir sorun oluştu. Hata kodu: O-25");
    }
  }

  async function cancelOrder(orderId: string) {
    try {
      const cancelOrderForm = new FormData();
      cancelOrderForm.append("orderId", orderId);
      cancelOrderForm.append("status", "4");
      const cancelledOrder = await NewOrderManager.cancelOrder(cancelOrderForm);

      if (cancelledOrder) {
        toast.success(`${orderId} siparişiniz iptal edilmiştir!`);
        getOrders();
        return true;
      } else {
        toast.error("İptal işlemi gerçekleştirilemedi.");
        return false;
      }
    } catch (error) {
      console.log(error);
      toast.error("Beklenmedik bir sorun oluştu. Hata kodu: CO-8");
      return false;
    }
  }

  return (
    <main data-theme="valentine" className="min-w-fit">
      <title>Kleopatra - Siparişlerim</title>

      <Toaster position="bottom-right" reverseOrder={false} />

      <Nav />
      <div className="min-h-96">
        <h1 className="ml-10 mb-4 text-start font-bold text-2xl">
          Siparişlerim
        </h1>
        <div className="">
          {orders && orders.length !== 0 ? (
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
