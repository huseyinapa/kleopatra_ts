/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import Header from "../_components/nav";
import Footer from "../_components/footer";

import { OrderItem, NewOrder, OrderCustomer } from "@/types/order";
import NewOrderManager from "@/services/newOrder";
import Image from "next/image";
import { Detail } from "@/types/detail";
import ProductManager from "@/services/product";

interface ConfirmOrderProps {}

export default function ConfirmOrder({}: ConfirmOrderProps) {
  const [orders, setOrders] = useState<NewOrder[]>([]);
  const [details, setDetails] = useState<Detail[]>([]);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async (): Promise<void> => {
    try {
      const orderData = await NewOrderManager.fetchOrders();

      if (!orderData || orderData.length === 0) return;

      // console.log("orderData: ", orderData);

      const orderArray: NewOrder[] = await Promise.all(
        orderData.map(async (order: NewOrder, index: number) => {
          /**
           * Her sipariş için sipariş ürünlerini al
           */
          const orderItems = await Promise.all(
            orderData.map(async (order: NewOrder) => {
              return await NewOrderManager.retrieveOrderItems(order.orderId!);
            })
          );
          /**
           * Her sipariş için müşteri bilgilerini al
           */
          const orderCustomer = await Promise.all(
            orderData.map(async (customer: NewOrder) => {
              return await NewOrderManager.retrieveOrderCustomer(
                customer.orderId!
              );
            })
          );

          /**
           * Siparişlerin müşteri bilgilerini map et
           */
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
          else customer = orderCustomer[index];
          /**
           * Siparişlerin ürünlerini map et
           */
          const items = (orderItems[index] || []).map(
            (item: OrderItem) => item
          );
          // console.log("orderCustomer: ", customer);

          let statusText = "";

          switch (order.status) {
            case "0":
              statusText = "Onay bekliyor";
              break;
            case "1":
              statusText = "Onaylandı";
              break;
            case "2":
              statusText = "Kargoda";
              break;
            case "3":
              statusText = "Teslim edildi";
              break;
            case "4":
              statusText = "İptal Edildi!";
              break;
            default:
              statusText = "Onay bekleniyor..";
              break;
          }

          return {
            ...order,
            customerId: order.customerId,
            userId: order.userId,
            status: order.status,
            statusText,
            items: items,
            customer: customer,
            payment: { method: "", amount: "", status: "" }, //! payment bilgisi eklenecek
            totalPrice: order.totalPrice,
            isDelete: false,
            date: order.date,
          };
        })
      );

      orderArray.sort((a, b) => parseInt(b.date) - parseInt(a.date));

      setOrders(orderArray);
    } catch (error) {
      console.log(error);
      toast.error("Beklenmedik bir sorun oluştu. Hata kodu: O-25");
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const updatedStatus = await NewOrderManager.updateOrderStatus(
        orderId,
        status
      );
      getOrders();
      toast(`${orderId} ${updatedStatus}`);
    } catch (error) {
      toast.error("Beklenmedik bir sorun oluştu. Hata kodu: CO-8");
      console.log(error);
    }
  };

  return (
    <div>
      <title>Kleopatra - Sipariş Onay</title>

      <Toaster position="bottom-right" reverseOrder={false} />

      <Header />
      <div className="mx-auto min-h-[800px] md:min-h-[600px] lg:min-h-[400px]">
        <div
          className="flex-wrap space-y-4 md:space-x-4 lg:space-x-4
        justify-center items-end md:items-center justify-items-center
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2"
        >
          {orders && orders.length !== 0 ? (
            orders.map((order) => (
              <OrderCard
                key={order.orderId}
                data={order}
                setDetails={setDetails}
                updateOrderStatus={updateOrderStatus}
              />
            ))
          ) : (
            <div className="mx-auto w-96 text-center h-32">
              Sipariş bulunmamaktadır.
            </div>
          )}
        </div>
      </div>
      <Footer />

      <ModalDetails details={details} />
    </div>
  );

  interface OrderCardProps {
    data: NewOrder;
    setDetails: (details: Detail[]) => void;
    updateOrderStatus: (orderId: string, status: string) => void;
  }

  function OrderCard({ data, setDetails, updateOrderStatus }: OrderCardProps) {
    const date = new Date(parseInt(data.date));

    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1); // Months are zero-based
    const year = date.getFullYear();
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());

    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;

    function padZero(number: number) {
      return number < 10 ? `0${number}` : number;
    }

    return (
      <div
        key={data.orderId}
        className="card lg:card-side bg-base-100 w-80 lg:w-[700px] h-[650px] lg:h-[260px] shadow-xl"
      >
        <figure>
          <Image
            src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
            alt="Album"
            className="w-auto lg:w-64 h-full"
            width={20}
            height={20}
          />
        </figure>
        <div className="card-body">
          {/* Sipariş Bilgileri */}
          <h2 className="card-title">{`Sipariş #${data.orderId} Onay Bekliyor`}</h2>
          <a className="my-2 space-y-1">
            <p>{`Müşteri: ${data.customer.full_name}`}</p>
            <p>{`Ürün Sayısı: ${data.items.length}`}</p>
            <p>{`Toplam Tutar: ${data.totalPrice}₺`}</p>
            <p>{`Sipariş Tarihi: ${formattedDate}`}</p>
          </a>
          {/* Sipariş Onay Butonu */}
          <div className="card-actions justify-between">
            <button
              className="btn btn-secondary"
              onClick={async () => {
                const details = await Promise.all(
                  data.items.map(async (item) => {
                    const product = await ProductManager.getProduct(
                      item.productId
                    );
                    return {
                      id: item.productId,
                      name: product!.name || "Ürün",
                      description: product!.description || "Ürün açıklaması",
                      price: item.price,
                      amount: item.quantity,
                      image: product!.image || "/images/icons/shopping-bag.svg",
                    };
                  })
                );
                setDetails(details);

                (
                  document.getElementById("my_modal_5") as HTMLDialogElement
                )?.showModal();
              }}
            >
              Detayları
            </button>
            {data.status === "1" ? (
              <button
                className="btn btn-outline"
                onClick={() => updateOrderStatus(data.orderId!, "2")}
              >
                Kargoya Ver
              </button>
            ) : data.status == "2" ? (
              <button className="btn btn-primary pointer-events-none">
                Kargoda
              </button>
            ) : data.status === "3" ? (
              <button className="btn btn-accent pointer-events-none">
                Teslim Edildi
              </button>
            ) : data.status === "4" ? (
              <button className="btn btn-error pointer-events-none">
                İptal Edildi
              </button>
            ) : (
              <button
                className="btn btn-neutral"
                onClick={() => updateOrderStatus(data.orderId!, "1")}
              >
                Siparişi Onayla
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function ModalDetails({ details }: { details: Detail[] }) {
  function multiplication(detail: Detail) {
    const total = detail.price * detail.amount;
    return total;
  }

  return (
    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Ürünler</h3>

        <div className="py-4 h-auto space-y-4">
          {details.map((detail: Detail) => (
            <div className="flex flex-row space-x-4" key={detail.id}>
              <figure>
                <Image
                  src={detail.image}
                  className="w-28 h-auto"
                  alt={detail.name}
                  width={20}
                  height={20}
                />
              </figure>
              <div className="flex flex-col justify-between">
                <div className="">
                  <h2 className="font-bold text-lg">{detail.name}</h2>
                  <a className="font-normal">{detail.description}</a>
                </div>
                <h2 className="font-semibold text-md">
                  {`${detail.price}₺ x ${detail.amount} = 
                  ${multiplication(detail)}₺`}
                </h2>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Kapat</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
