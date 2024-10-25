/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

import CartManager from "@/services/cart";
import ProductManager from "@/services/product";
import Functions from "@/utils/functions";
import Image from "next/image";
import { Product } from "@/types/product";

interface ProductListProps {
  excludingProductId: string;
}

export default function ProductList({ excludingProductId }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    try {
      const products = await ProductManager.fetchAllProducts();
      // console.log(products);

      if (products !== null) {
        setProducts(
          products.filter((e: Product) => e.id !== excludingProductId)
        );
      } else {
        setProducts([]);
        toast.error("Stoğumuzda ürün bulunmuyor.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Ürünler getirilirken bir hata oluştu.");
    }
  }

  return (
    <div className="flex flex-wrap space-y-4 mx-auto justify-center items-end mt-2 grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-4 xl:space-y-4">
      {products.length === 0 ? (
        <div></div>
      ) : (
        products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );

  function ProductCard({ product }: { product: Product }) {
    return (
      <div className="card card-compact bg-[#cc3b6477] text-neutral-content w-48 md:w-60 xl:w-72 h-[320px] md:h-[400px] lg:h-auto shadow-[#c2154677] shadow-2xl">
        <figure className="relative pt-4">
          <Link
            href={`/products/${Functions.slugify(
              product.name
            )}-${product.id.toLowerCase()}`}
          >
            <Image
              src={product.image}
              alt={product.name}
              className="w-36 h-48 md:w-56 md:h-52 lg:w-60 lg:h-64 object-contain rounded-lg"
              width={20}
              height={20}
            />
          </Link>
        </figure>
        <div className="card-body">
          <h1 className="card-title">{product.name}</h1>
          <p>{product.description}</p>
          <div className="card-actions justify-between items-center">
            <div className="font-semibold text-sm md:text-base lg:text-lg">
              {product.price}₺
            </div>
            <button
              className="btn btn-xs md:btn-sm lg:btn-md text-xs lg:text-md shadow-sm"
              onClick={() => handleAddCart(product)}
            >
              Sepete Ekle
            </button>
          </div>
        </div>
      </div>
    );
  }

  async function handleAddCart(data: Product) {
    const id = localStorage.getItem("id") ?? null;
    if (id === null) {
      toast.error(
        "Sepete ürün eklemek için kayıt olmanız/giriş yapmanız gerekir."
      );
      return;
    }

    try {
      const productData = await ProductManager.getProduct(data.id);

      const productInCartForm = new FormData();
      productInCartForm.append("id", id);
      productInCartForm.append("pid", data.id);

      const cartProductData = await CartManager.getProductInCart(
        productInCartForm
      );

      if (productData !== null && productData.stock < 1) {
        return toast.error("Ürün stokta bulunmuyor.");
      } else if (
        cartProductData !== null &&
        productData !== null &&
        cartProductData.amount >= productData.stock
      ) {
        return toast.error(`Stoktaki tutardan fazlası sepete eklenemez.`);
      }

      const formData = new FormData();
      formData.append("id", id); // Müşteri kimliği
      formData.append("pid", data.id);
      formData.append("amount", "1");
      formData.append("date", Date.now().toString());

      await toast.promise(CartManager.addProductToCart(formData), {
        loading: "Ekleniyor...",
        success: "Ürün sepete eklendi!",
        error: "Ürün sepete eklenemedi.",
      });
    } catch (error) {
      toast.error("Bilinmeyen hata. Kod: PC-HAC");
      console.log(error);
    }
  }
}
