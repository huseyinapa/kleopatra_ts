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
  cartItems: CartItem[];
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
  setCompleted: Dispatch<SetStateAction<CompletedState>>;
}

const CartProduct: FC<CartProductProps> = ({
  cartItems,
  setCartItems,
  setCompleted,
}) => {
  const [cartLength, setCartLength] = useState<number>(cartItems.length);

  useEffect(() => {
    setCartLength(cartItems.length);
  }, [cartItems]);

  const handleDecreaseAmount = (itemId: string) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              amount: item.amount! > 1 ? item.amount! - 1 : item.amount || 1,
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
                item.amount! < (product?.stock || 1)
                  ? item.amount! + 1
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
          {cartItems.map((item) => (
            <div
              key={item.id}
              className={`card card-compact bg-[#cc3b6477] text-neutral-content w-[170px] md:w-[300px] h-[350px] md:h-[400px] lg:h-[450px] shadow-[#c2154677] shadow-2xl
                ${
                  item.amount! > item.stock || item.stock === 0
                    ? "bg-error"
                    : "bg-[#cc3b6477]"
                }`}
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
                    <path d="M 24 4 C 20.491685 4 17.570396 6.6214322 17.080078 10 L 10.238281 10 A 1.50015 1.50015 0 0 0 9.9804688 9.9785156 A 1.50015 1.50015 0 0 0 9.7578125 10 L 6.5 10 A 1.50015 1.50015 0 1 0 6.5 13 L 8.6386719 13 L 11.15625 39.029297 C 11.427329 41.835926 13.811782 44 16.630859 44 L 31.367188 44 C 34.186411 44 36.570826 41.836168 36.841797 39.029297 L 39.361328 13 L 41.5 13 A 1.50015 1.50015 0 1 0 41.5 10 L 38.244141 10 A 1.50015 1.50015 0 0 0 37.763672 10 L 30.919922 10 C 30.429604 6.6214322 27.508315 4 24 4 z M 24 7 C 25.879156 7 27.420767 8.2681608 27.861328 10 L 20.138672 10 C 20.579233 8.2681608 22.120844 7 24 7 z M 11.650391 13 L 36.347656 13 L 33.855469 38.740234 C 33.730439 40.035363 32.667963 41 31.367188 41 L 16.630859 41 C 15.331937 41 14.267499 40.033606 14.142578 38.740234 L 11.650391 13 z M 20.476562 17.978516 A 1.50015 1.50015 0 0 0 19 19.5 L 19 34.5 A 1.50015 1.50015 0 1 0 22 34.5 L 22 19.5 A 1.50015 1.50015 0 0 0 20.476562 17.978516 z M 27.476562 17.978516 A 1.50015 1.50015 0 0 0 26 19.5 L 26 34.5 A 1.50015 1.50015 0 1 0 29 34.5 L 29 19.5 A 1.50015 1.50015 0 0 0 27.476562 17.978516 z"></path>
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
