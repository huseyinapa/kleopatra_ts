"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import ProductManager from "@/services/product";
import CartManager from "@/services/cart";
import { Product } from "@/types/product";
import Functions from "@/utils/functions";
import Logger from "@/utils/logger";

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
}

export default function ProductCard({ product, isAdmin }: ProductCardProps) {
  const removeProduct = async (productId: string, imagePath: string) => {
    const formData = new FormData();
    formData.append("id", productId);
    formData.append("path", imagePath);

    try {
      const response = await ProductManager.removeProduct(formData);
      if (response) {
        await CartManager.removeProductFromCart(formData);
        toast.success("Ürün kaldırıldı! Sayfayı yenileyin.");
      } else {
        toast.error("Bilinmeyen hata!");
      }
    } catch (error) {
      toast.error("Bilinmeyen hata!");
      Logger.log("Product removal error:" + error, "error");
    }
  };

  const handleAddCart = async (product: Product) => {
    const userId = localStorage.getItem("id");
    if (!userId) {
      return toast.error("Sepete ürün eklemek için giriş yapmanız gerekir.");
    }

    try {
      const productData = await ProductManager.getProduct(product.id);
      if (!productData || productData.stock < 1) {
        return toast.error("Stok tükenmiştir.");
      }

      const formData = new FormData();
      formData.append("id", userId);
      formData.append("pid", product.id);
      formData.append("amount", "1");
      formData.append("date", Date.now().toString());

      const response = await CartManager.addProductToCart(formData);
      if (response) {
        toast.success("Ürün sepete eklendi!");
      } else {
        toast.error("Ürün sepete eklenemedi.");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu.");
      Logger.log("Cart error:" + error, "error");
    }
  };

  return (
    <div className="card card-compact bg-[#cc3b6477] text-neutral-content w-[170px] md:w-[300px] h-[350px] md:h-[400px] lg:h-[450px] shadow-[#c2154677] shadow-2xl">
      <figure className="relative pt-4">
        <Link
          href={`/products/${Functions.slugify(
            product.name
          )}-${product.id.toLowerCase()}`}
        >
          <Image
            src={product.image}
            alt={product.name}
            className="w-32 h-40 md:w-56 md:h-52 lg:w-60 lg:h-64 object-cover rounded-lg"
            width={20}
            height={20}
          />
        </Link>
        {isAdmin && (
          <button
            className="absolute top-3 right-3 btn btn-sm btn-circle lg:btn-md shadow-sm"
            onClick={() => removeProduct(product.id, product.image)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 48 48"
            >
              <path d="M24 4c-3.5 0-6.4 2.6-6.9 6H10.2l-.3-.1H6.5a1.5 1.5 0 100 3h2.1L11.2 39c.3 2.8 2.7 5 5.5 5H31c2.8 0 5.2-2.2 5.5-5l2.5-26H41.5a1.5 1.5 0 100-3h-3.3l-.5-.1h-6.8c-.5-3.4-3.4-6-6.9-6zM24 7c1.9 0 3.4 1.3 3.9 3H20.1c.5-1.7 2-3 3.9-3zm-12.4 6h24.7l-2.5 25.7c-.1 1.2-1.1 2.3-2.4 2.3H16.3c-1.2 0-2.3-1.1-2.4-2.3L11.6 13zm9 4.2a1.5 1.5 0 00-1.5 1.5v15a1.5 1.5 0 103 0v-15a1.5 1.5 0 00-1.5-1.5zm7 0a1.5 1.5 0 00-1.5 1.5v15a1.5 1.5 0 103 0v-15a1.5 1.5 0 00-1.5-1.5z" />
            </svg>
          </button>
        )}
      </figure>
      <div className="card-body">
        <h1 className="card-title text-lg md:text-xl">{product.name}</h1>
        <p className="text-xs md:text-base">{product.description}</p>
        <div className="card-actions justify-between items-center">
          <div className="font-semibold text-sm md:text-md lg:text-lg">
            {product.price}₺
          </div>
          <button
            className="btn btn-xs lg:btn-md text-xs lg:text-md shadow-sm"
            onClick={() => handleAddCart(product)}
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
