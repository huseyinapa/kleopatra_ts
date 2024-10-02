"use client";

import Image from "next/image";
import React from "react";
import { AddressData } from "@/types/address";
import { PaymentData } from "@/types/payment";

interface CompletedProps {
  address?: AddressData | null;
  payment: PaymentData | null;
}

const Completed: React.FC<CompletedProps> = ({ address, payment }) => {
  const [expireMonth, expireYear] = payment?.expiryDate
    ? payment.expiryDate.split("/")
    : ["", ""]; // Eğer expiryDate yoksa boş değer atansın

  const censoredCardNumber = (cardNumber: string): string | null => {
    // Kredi kartı numarasının uzunluğunu kontrol et
    if (cardNumber.length < 16) {
      console.error("Geçersiz kredi kartı numarası");
      return null;
    }

    // Kart numarasının son 4 hanesini al
    const last4Digit = cardNumber.slice(-4);

    // Sansürlenmiş kart numarasını oluştur
    const censoredNumber = "************" + last4Digit;

    return censoredNumber;
  };

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
          <div className="card bg-white shadow-[#cc3b6477] shadow-md h-[305px] ">
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
            <div className="card-body flex-col space-y-1">
              <h2 className="card-title font-bold text-xl">Ödeme Bilgileri</h2>

              <div className="flex-row mt-4 space-y-1">
                <div className="flex-row space-x-2">
                  <span className="font-semibold">Toplam tutar:</span>
                  <span className="">payment?.price ₺</span>
                </div>
                <div className="flex-row space-x-2">
                  <span className="font-semibold">Kart üzerindeki isim:</span>
                  <span className="">{payment?.cardHolderName}</span>
                </div>
                <div className="flex-row space-x-2">
                  <span className="font-semibold">Kart Numarası:</span>
                  <span className="">
                    {censoredCardNumber(payment!.cardNumber)}
                  </span>
                </div>
                <div className="flex-row space-x-2">
                  <span className="font-semibold">Son Kullanım Tarihi:</span>
                  <span className="">
                    {expireMonth} / {expireYear}
                  </span>
                </div>
                <span className=""></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sipariş tamamlandı içeriğini burada oluşturun */}
    </div>
  );
};

export default Completed;
