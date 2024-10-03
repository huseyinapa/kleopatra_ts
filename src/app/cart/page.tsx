/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

import Header from "@/app/_components/nav";
import StepIndicator from "./_components/indicator";
import BottomPayDetails from "./_components/bottomPayDetails";
import CartProduct from "./_components/cartProduct";
import Address from "./_components/address";
import Payment from "./_components/payment";
import Completed from "./_components/completed";
import Footer from "@/app/_components/footer";

import CartManager from "@/services/cart";
import ProductManager from "@/services/product";
import { CartItem } from "@/types/cart";
import { AddressData } from "@/types/address";
import { PaymentData } from "@/types/payment";

const steps = ["Sepetim", "Adres", "Ödeme", "Sipariş Tamamlandı"];

export interface CompletedState {
  product: boolean;
  address: boolean;
  payment: boolean;
}

function Cart(): JSX.Element {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [completed, setCompleted] = useState<CompletedState>({
    product: false,
    address: false,
    payment: false,
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedId = localStorage.getItem("id");

    if (storedEmail && storedId) {
      setIsLoggedIn(true);
      fetchCartItems();
    } else {
      router.push("/");
    }
  }, [router]);

  function isStockAvailable(): boolean {
    return cartItems.every((item) => item.stock > 0);
  }

  function isAmountMoreThanStock(): boolean {
    return cartItems.some((item) => (item.amount || 1) > item.stock);
  }

  const handleContinue = (): void => {
    if (!isStockAvailable()) {
      toast.error("Sepetinizdeki ürün stoklarımızda bulunmamaktadır.");
    } else if (isAmountMoreThanStock()) {
      toast.error(
        "Sepetinizdeki ürün miktarı stoktan fazla, tekrar kontrol ediniz!"
      );
    } else if (currentStep === 0 && !completed.product) {
      toast.error("Sepetiniz boş görünüyor.");
    } else if (currentStep === 1 && !completed.address) {
      toast.error(
        "Adres bilgileri eksik görünüyor. Onayla düğmesine tıklamayı deneyin!"
      );
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = (stepIndex: number): void => {
    if (currentStep !== 3 && stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const fetchCartItems = async (): Promise<void> => {
    try {
      const id = localStorage.getItem("id");
      if (!id) {
        setCompleted((prevCompleted) => ({
          ...prevCompleted,
          product: false,
        }));
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("id", id);

      const response = await CartManager.fetchCart(formData);

      if (response && Array.isArray(response) && response.length > 0) {
        const products: CartItem[] = await Promise.all(
          response.map(async (item) => {
            const product = (await ProductManager.getProduct(
              item.pid
            )) as CartItem;
            console.log();

            return {
              id: item.pid,
              pid: item.pid,
              name: product?.name,
              description: product?.description,
              price: product?.price,
              stock: product?.stock,
              image: product?.image,
              amount: item.amount,
              stockStatus: product?.stock !== 0,
            };
          })
        );
        console.log("products" + products.length);

        setCartItems(products);
        setCompleted((prevCompleted) => ({
          ...prevCompleted,
          product: true,
        }));
      } else {
        setCompleted((prevCompleted) => ({
          ...prevCompleted,
          product: false,
        }));
      }
    } catch (error) {
      console.log(error);
      toast.error("Bilinmeyen sorun oluştu! Hata kodu: C-FCI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main data-theme="valentine" className="w-[100%]">
      <Toaster position="bottom-right" reverseOrder={false} />
      <Header />
      {loading ? (
        <div className="mx-auto h-60 justify-center">
          <div className="flex flex-col items-center space-y-2">
            <span className="loading loading-spinner loading-lg"></span>
            <span className="text-center">Yükleniyor..</span>
          </div>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="mx-auto h-72 justify-center">
          <div className="flex flex-col items-center space-y-4">
            {/* Boş sepet mesajı */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* SVG içeriği */}
            </svg>
            <h1 className="font-bold text-4xl">Sepetiniz şu an boş</h1>
            <p className="pt-2 text-center">
              Doğal ürünlerimizden dilediğinizi sepetinize ekleyebilir,
              dilediğiniz zaman ödemenizi gerçekleştirebilirsiniz.
            </p>
            <a className="btn btn-primary" href="/products">
              Hemen Göz Atın!
            </a>
          </div>
        </div>
      ) : (
        <div className="px-5 justify-center py-8 space-y-4">
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
          <div className={`flex ${currentStep === 3 ? "justify-center" : ""}`}>
            <div>
              {currentStep === 0 && (
                <CartProduct
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  setCompleted={setCompleted}
                />
              )}
              {currentStep === 1 && (
                <Address
                  addressData={addressData}
                  setAddressData={setAddressData}
                  setCompleted={setCompleted}
                />
              )}
              {currentStep === 2 && (
                <Payment
                  cartItems={cartItems}
                  addressData={addressData}
                  setPaymentData={setPaymentData}
                  handleContinue={handleContinue}
                />
              )}
              {currentStep === 3 && (
                <Completed
                  address={addressData}
                  payment={paymentData}
                  orderDetailUrl=""
                /> //! Burası hatalı
              )}
            </div>
            {currentStep !== 3 && (
              <BottomPayDetails
                currentStep={currentStep}
                onStepClick={handleStepClick}
                products={cartItems}
                handleContinue={handleContinue}
              />
            )}
          </div>
        </div>
      )}
      <Footer />

      <dialog id="distance_selling_contract" className="modal">
        {/* Mesafeli Satış Sözleşmesi içeriği */}
      </dialog>
    </main>
  );
}

export default Cart;
