// components/orders/OrderCard.tsx - Sipariş kartı bileşenini oluşturuyor
import Image from "next/image";
import React from "react";
import { Detail } from "../page";
import { NewOrder } from "@/types/order";
import ProductManager from "@/services/product";

interface OrderCardProps {
  data: NewOrder;
  setDetails: (details: Detail[]) => void;
  cancelOrder: (orderId: string) => Promise<boolean>;
}

const OrderCard: React.FC<OrderCardProps> = ({
  data,
  setDetails,
  cancelOrder,
}) => {
  function padZero(number: number) {
    return number < 10 ? `0${number}` : number;
  }

  const date = new Date(parseInt(data.date));
  const formattedDate = `${padZero(date.getDate())}.${padZero(
    date.getMonth() + 1
  )}.${date.getFullYear()} ${padZero(date.getHours())}:${padZero(
    date.getMinutes()
  )}`;

  return (
    <div
      key={data.orderId}
      className="relative mx-auto items-center lg:items-start mb-4 min-w-72 w-[80%] flex flex-col lg:flex-row p-4 space-x-4 shadow-neutral shadow-[0_0_10px] rounded-lg"
    >
      <figure className="relative">
        <Image
          src="/images/icons/shopping-bag.svg"
          alt="Ürün görseli"
          className="w-40 h-auto md:w-40 md:h-36 object-cover"
          width={20}
          height={20}
        />
      </figure>
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col justify-between">
            <div className="">
              <h2 className="font-bold text-md">Sipariş Tarihi</h2>
              <a className="font-normal">{formattedDate}</a>
            </div>
          </div>
          <div className="divider w-40 md:w-auto md:divider-horizontal h-0 md:h-14"></div>
          <div className="flex flex-col justify-between">
            <div className="">
              <h2 className="font-bold text-md">Sipariş Detayları</h2>
              <a
                className="btn-link font-normal cursor-pointer"
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
                        image:
                          product!.image || "/images/icons/shopping-bag.svg",
                      };
                    })
                  );
                  setDetails(details);
                  (
                    document.getElementById("my_modal_5") as HTMLDialogElement
                  )?.showModal();
                }}
              >
                Görmek için tıklayın
              </a>
            </div>
          </div>
          <div className="divider w-40 md:w-auto md:divider-horizontal h-0 md:h-14"></div>
          <div className="flex flex-col justify-between">
            <div className="">
              <h2 className="font-bold text-md">Kargo Detayları</h2>
              <a className="font-normal">PTT Kargo</a>
            </div>
          </div>
          <div className="divider w-40 md:w-auto md:divider-horizontal h-0 md:h-14"></div>
          <div className="flex flex-col justify-between">
            <div className="">
              <h2 className="font-bold text-md">Tutar</h2>
              <a className="font-normal">{data.totalPrice}₺ (KDV Dahil)</a>
            </div>
          </div>
        </div>
        <div className="divider w-40 md:w-auto h-0 md:divider-vertical"></div>
        <div className="mb-3 md:mb-0">
          <h2 className="font-bold text-md">Teslimat Adresi</h2>
          <a className="font-normal">{data.customer.address}</a>
        </div>
      </div>
      <div className="md:absolute md:bottom-0 right-4 space-x-3">
        <div
          className={`btn ${
            data.status === "0" ? "" : "hidden"
          } rounded-md md:rounded-t-md md:rounded-b-none btn-error`}
          onClick={() => cancelOrder(data.orderId!)}
        >
          İptal Et
        </div>
        <div
          className={`btn rounded-md md:rounded-t-md md:rounded-b-none ${
            data.status === "0"
              ? "bg-purple-300"
              : data.status === "1"
              ? "bg-purple-400"
              : data.status === "2"
              ? "bg-button-rose"
              : data.status === "3"
              ? "bg-neutral"
              : "bg-error"
          } pointer-events-none`}
        >
          {data.statusText}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
