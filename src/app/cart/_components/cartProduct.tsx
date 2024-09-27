/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, {
  useState,
  useEffect,
  Dispatch,
  FC,
  SetStateAction,
} from "react";
import toast from "react-hot-toast";

import Image from "next/image";
import CartManager from "@/services/cart";
import ProductManager from "@/services/product";
import { CartItem } from "@/types/cart";

interface CompletedState {
  product: boolean;
  address: boolean;
  payment: boolean;
}

interface CartProductProps {
  cartProducts: CartItem[];
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
  setCompleted: Dispatch<SetStateAction<CompletedState>>;
}

const CartProduct: FC<CartProductProps> = ({
  cartProducts,
  setCartItems,
  setCompleted,
}) => {
  const [cartLength, setCartLength] = useState<number>(cartProducts.length);

  useEffect(() => {
    console.log("cartProducts", cartProducts);

    setCartLength(cartProducts.length);
  }, [cartProducts]);

  const handleDecreaseAmount = (itemId: string) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              amount:
                (item.amount || 1) > 1
                  ? (item.amount || 1) - 1
                  : item.amount || 1,
            }
          : item
      )
    );
  };

  const handleIncreaseAmount = async (itemId: string) => {
    const product = await ProductManager.getProduct(itemId);

    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              amount:
                (item.amount || 1) < (product?.stock || 1)
                  ? (item.amount || 1) + 1
                  : item.amount || 1,
            }
          : item
      )
    );
  };

  const handleRemoveItem = async (pid: string) => {
    const id = localStorage.getItem("id");

    const formData = new FormData();
    formData.append("id", id || "");
    formData.append("pid", pid);

    // Sepetten ürünü kaldırma
    setCartItems((prevCartItems) => {
      const updatedCart = prevCartItems.filter((x) => x.id !== pid);

      // Eğer sepet boşaldıysa
      if (updatedCart.length < 1) {
        setCartLength(0);
      }

      return updatedCart;
    });

    // Sunucudan ürünü kaldırma
    const response = await CartManager.removeProductFromCart(formData);

    if (response) {
      return toast.success("Ürün sepetinizden kaldırıldı!");
    } else {
      return toast.error("Ürün sepetinizden kaldırılamadı.");
    }
  };

  return (
    <div className="">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold m-2">
        Sepetim
      </h2>
      {cartLength === 0 ? (
        <div className="container mx-auto h-52 w-auto justify-center items-center">
          <div className="flex flex-col space-y-4 w-60 mt-5 justify-center items-center">
            <Image
              alt="sepetboş"
              src="/images/icons/cart-2.png"
              width={64}
              height={64}
            />
            <p className="text-center text-gray-600">Sepetiniz boş.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap mt-4 lg:mt-0 space-y-4 grid-cols-2 justify-center items-end gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 xl:gap-10 xl:space-y-5">
          {cartProducts.map((item) => (
            <div
              key={item.id}
              className={`card relative card-compact ${
                item.amount! > item.stock || item.stock === 0
                  ? "bg-error"
                  : "bg-[#cc3b6477]"
              } text-neutral-content w-50 md:w-72 h-80 lg:h-auto shadow-[#c2154677] shadow-2xl`}
            >
              <figure className="relative pt-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  className="w-36 lg:w-60 h-48 lg:h-64 object-cover rounded-lg"
                  width={240}
                  height={256}
                />
                <button
                  className="absolute top-5 right-5 btn btn-square btn-ghost bg-neutral-content shadow-lg"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  {/* Silme ikonu */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 48 48"
                  >
                    {/* SVG içeriği */}
                  </svg>
                </button>
              </figure>
              <div className="card-body">
                <h2 className="card-title">{item.name}</h2>
                <p>{item.description}</p>
                <div className="card-actions items-center justify-between">
                  <div className="font-semibold text-sm lg:text-lg">
                    {item.price}₺
                  </div>
                  {!item.stock ? (
                    <div>
                      <span className="text-white font-bold">
                        Stok tükenmiştir.
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="btn-group shadow-lg rounded-2xl">
                        <button
                          className="btn btn-xs lg:btn-sm btn-square"
                          onClick={() => handleDecreaseAmount(item.id)}
                        >
                          -
                        </button>
                        <span className="px-4 lg:pt-1 text-center justify-center">
                          {item.amount}
                        </span>
                        <button
                          className="btn btn-xs lg:btn-sm btn-square hover:bg-red-300"
                          onClick={() => handleIncreaseAmount(item.id)}
                        >
                          +
                        </button>
                      </div>
                      <div
                        data-tip="Adet sayısı, stok miktarını geçemez."
                        className="tooltip"
                      >
                        {/* Bilgi ikonu */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="stroke-neutral-content shrink-0 w-6 h-6"
                        >
                          {/* SVG içeriği */}
                        </svg>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartProduct;
