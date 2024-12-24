/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { FC } from "react";
import { AddressData } from "@/types/address";
import { PaymentData } from "@/types/payment";
import Link from "next/link";
import { getSessionStorage } from "@/utils/storage";

interface CompletedProps {
  address?: AddressData | null;
  payment: PaymentData | null;
}

const Completed: FC<CompletedProps> = ({ address, payment }) => {
  const paymentCard = payment?.paymentCard;

  const censoredCardNumber = (cardNumber: string): string | null =>
    cardNumber.replace(/\d(?=\d{4})/g, "*");

  const orderId: string = getSessionStorage("orderID");

  return (
    <div className="mx-auto justify-center">
      <div className="card lg:card-side mx-auto">
        <figure>
          <Image
            src="images/shopping-success.png"
            alt="shopping"
            className=""
            width={200}
            height={200}
          />
        </figure>
        <div className="card-body md:flex-row space-x-0 md:space-x-4 space-y-4 md:space-y-0">
          <div className="card bg-white shadow-[#cc3b6477] shadow-md h-[305px]">
            <div className="card-body flex-col space-y-1">
              <h2 className="card-title font-bold text-xl">Adres Bilgileri</h2>
              <div className="flex-row space-x-2">
                <span className="font-semibold">İsim:</span>
                <span className="">{address?.name}</span>
              </div>
              <div className="flex-row space-x-2">
                <span className="font-semibold">Soyisim:</span>
                <span className="">{address?.surname}</span>
              </div>
              <div className="flex-row space-x-2">
                <span className="font-semibold">İl:</span>
                <span className="">{address?.city}</span>
              </div>
              <div className="flex-row space-x-2">
                <span className="font-semibold">İlçe:</span>
                <span className="">{address?.district}</span>
              </div>
              <div className="flex-row space-x-2">
                <span className="font-semibold">Posta kodu:</span>
                <span className="">{address?.zipCode}</span>
              </div>
              <div className="flex-row space-x-2">
                <span className="font-semibold">Telefon:</span>
                <span className="">{address?.phone}</span>
              </div>
            </div>
          </div>
          <div className="card card-normal bg-white shadow-[#cc3b6477] shadow-md h-[305px] flex-col">
            <div className="card-body flex-col justify-around space-y-1">
              <h2 className="card-title font-bold text-xl">Ödeme Bilgileri</h2>

              <div className="flex flex-col mt-4 space-y-1">
                <div>
                  <div className="flex-row space-x-2">
                    <span className="font-semibold">Toplam tutar:</span>
                    <span className="">₺{payment?.price}</span>
                  </div>
                  <div className="flex-row space-x-2">
                    <span className="font-semibold">Kart üzerindeki isim:</span>
                    <span className="">{paymentCard?.cardHolderName}</span>
                  </div>
                  <div className="flex-row space-x-2">
                    <span className="font-semibold">Kart Numarası:</span>
                    <span className="">
                      {censoredCardNumber(paymentCard?.cardNumber || "")}
                    </span>
                  </div>
                  <div className="flex-row space-x-2">
                    <span className="font-semibold">Son Kullanım Tarihi:</span>
                    <span className="">
                      {paymentCard?.expireMonth} / {paymentCard?.expireYear}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-sm">
                Uyarı: Kart bilgileri tarafımızca saklanmamaktadır!
              </span>
              <Link href={`/orders`} className="btn">
                {/* /${orderId.toLowerCase()} */}
                Sipariş detaylarını görüntüle
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Sipariş tamamlandı içeriğini burada oluşturun */}
    </div>
  );
};

export default Completed;
