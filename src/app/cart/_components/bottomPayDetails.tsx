"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { CartItem } from "@/types/cart";

interface BottomPayDetailsProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  products: CartItem[];
  handleContinue: () => void;
}

const BottomPayDetails: React.FC<BottomPayDetailsProps> = ({
  currentStep,
  onStepClick,
  products,
  handleContinue,
}) => {
  const [isChecked, setChecked] = useState(false);
  const [effect, setEffect] = useState(false);

  useEffect(() => {
    // // console.log("nav bar", products);
  }, [products]);

  const totalPrice = products.reduce(
    (total, item) => total + parseInt(item.price) * item.amount!,
    0
  );

  const discount = 0; // total tutardan düşmesi sağlanacak.
  const ship_fee = 100;
  const total = totalPrice + ship_fee;

  const handleCheckboxChange = () => {
    if (currentStep === 2) {
      toast.error("Ödeme ekranında onayınızı geri alamazsınız!");
      return;
    }
    setChecked(!isChecked);
  };

  return (
    <div className="absolute lg:right-4">
      {/* Büyük ekranlar için */}
      <div className="z-10 lg:w-3/4 hidden lg:block p-4">
        <div className="card w-96 h-auto bg-white rounded-lg ml-5 p-4 shadow-lg">
          <h3 className="text-xl text-center font-semibold mb-4">
            Ödeme Detayları
          </h3>
          <div className="flex justify-between mb-2">
            <span>Ürün Toplamı + KDV:</span>
            <span>{totalPrice}₺</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between mb-2">
              <span>İndirim:</span>
              <span>{discount}₺</span>
            </div>
          )}
          <div className="flex justify-between mb-2">
            <span>Kargo:</span>
            <span>
              {ship_fee.toLocaleString("tr-TR", {
                style: "currency",
                currency: "TRY",
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="divider"></div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className={`checkbox ${
                  effect ? "checkbox-warning stroke-2" : "checkbox-primary"
                }`}
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <a
                onClick={() => {
                  (
                    document.getElementById(
                      "distance_selling_contract"
                    ) as HTMLDialogElement
                  )?.showModal();
                }}
                className={`${effect && "text-red-400"} label-text`}
              >
                Mesafeli Satış Sözleşmesini onaylıyorum.
              </a>
            </label>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-lg font-semibold">Toplam Tutar:</span>
            <span className="text-lg font-semibold">{total}₺</span>
          </div>
          <div className="container flex justify-between">
            <button
              className="btn bg-secondary text-white py-2 px-4"
              onClick={() =>
                onStepClick(currentStep !== 0 ? currentStep - 1 : currentStep)
              }
            >
              Geri Dön
            </button>
            {currentStep === 2 ? (
              <></> // Ödemeyi tamamla eklenebilir
            ) : (
              <button
                className={`btn ${
                  effect && "animate-wiggle"
                } bg-[#cc3b6477] text-white py-2 px-4`}
                onClick={() => {
                  if (!isChecked) {
                    setEffect(true);
                    return toast.error(
                      "Mesafeli satış sözleşmesini onaylamanız gerekmektedir."
                    );
                  }
                  handleContinue();
                }}
                onAnimationEnd={() => setEffect(false)}
              >
                Alışverişi tamamla
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Küçük ekranlar için */}
      <div className="z-10 btm-nav h-28 lg:h-20 bg-white text-neutral-focus rounded-t-lg lg:hidden px-4 lg:px-6">
        <div className="flex flex-col items-start">
          <h1 className="btm-nav-label font-bold text-lg lg:text-2xl">
            Ödeme Detayları ({products.length})
          </h1>
          <div className="flex justify-between text-sm lg:text-lg space-x-1">
            <span>Ürün Toplamı + KDV (%20):</span>
            <span className="font-bold">{totalPrice.toFixed(2)}₺</span>
          </div>
          <div className="flex justify-between mb-2 text-sm lg:text-lg space-x-1">
            <span>Kargo:</span>
            <span className="font-bold">
              {(100).toLocaleString("tr-TR", {
                style: "currency",
                currency: "TRY",
              })}
            </span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-end space-y-2">
          <button
            className="btn btn-outline btn-sm lg:btn-lg text-neutral-focus"
            onClick={() => {
              onStepClick(currentStep !== 0 ? currentStep - 1 : currentStep);
            }}
          >
            Geri Dön
          </button>
          {currentStep === 2 ? (
            <></> // Ödemeyi tamamla eklenebilir
          ) : (
            <button
              className="btn btn-sm lg:btn-lg text-neutral-focus"
              onClick={() => {
                handleContinue();
              }}
            >
              Alışverişi tamamla
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomPayDetails;
