"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import CartManager from "@/services/cart";
import ProductManager from "@/services/product";

import { Product } from "@/types/product";
import { NODE_ENV } from "@/utils/api";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(1);

  const handleIncreaseAmount = () => setAmount((prev) => prev + 1);
  const handleDecreaseAmount = () => {
    if (amount > 1) setAmount((prev) => prev - 1);
  };

  const handleAddToCart = async () => {
    const id = localStorage.getItem("id") ?? null;
    if (id === null) {
      toast.error(
        "Sepete ürün eklemek için kayıt olmanız/giriş yapmanız gerekir."
      );
      return;
    }

    try {
      setIsLoading(true);

      const productData = await ProductManager.getProduct(product.id);

      const productInCartForm = new FormData();
      productInCartForm.append("id", id);
      productInCartForm.append("pid", product.id);
      const cartProductData = await CartManager.getProductInCart(
        productInCartForm
      );

      if (productData !== null && productData.stock === 0) {
        toast.error("Ürün stokta bulunmuyor.");
      } else if (
        cartProductData !== null &&
        productData !== null &&
        cartProductData.amount >= productData.stock
      ) {
        toast.error("Stoktaki tutardan fazlası sepete eklenemez.");
      } else {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("pid", product.id);
        formData.append("amount", amount.toString());
        formData.append("date", Date.now().toString());

        await toast.promise(CartManager.addProductToCart(formData), {
          loading: "Ekleniyor...",
          success: "Ürün sepete eklendi!",
          error: "Ürün sepete eklenemedi.",
        });
        setAmount(1);
      }
    } catch (error) {
      toast.error("Bilinmeyen hata. Kod: AC-HAC");
      if (NODE_ENV === "development") console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <p className="font-semibold text-lg md:text-xl text-[#007646]">
        {product.price
          ? parseInt(product.price.toString()).toLocaleString("tr-TR", {
              style: "currency",
              currency: "TRY",
            })
          : "Fiyat bilgisi yok"}
      </p>
      <div className="flex justify-center items-center w-20 h-8 shadow-lg bg-[#cc3b6477] rounded-2xl space-x-1">
        <button
          className="btn btn-xs md:btn-sm btn-ghost btn-circle bg-[#cc3b6477] text-white transition hover:opacity-75"
          onClick={handleDecreaseAmount}
        >
          &minus;
        </button>
        <span className="text-white font-bold">{amount}</span>
        <button
          className="btn btn-xs md:btn-sm btn-ghost btn-circle bg-[#cc3b6477] text-white transition hover:opacity-75"
          onClick={handleIncreaseAmount}
        >
          +
        </button>
      </div>
      <button
        className="btn btn-xs md:btn-sm lg:btn-md w-32 h-8 mr-4 md:mr-0"
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? "Ekleniyor..." : "Sepete Ekle"}
      </button>
    </div>
  );
}
