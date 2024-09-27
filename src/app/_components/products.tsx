"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import CartManager from "@/services/cart";
import ProductManager from "@/services/product";
import Link from "next/link";
import Image from "next/image";
import Functions from "@/utils/functions";
import { Product } from "@/types/product";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchAllProducts();
    checkIsAdmin();
  }, []);

  const checkIsAdmin = () => {
    const getPermission = parseInt(localStorage.getItem("permission") ?? "0");
    setIsAdmin(getPermission === 1);
  };

  const fetchAllProducts = async () => {
    try {
      const response = await ProductManager.fetchAllProduct();
      if (response !== null) {
        setProducts(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeProduct = async (id: string, path: string) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("path", path);

    try {
      const response = await ProductManager.removeProduct(formData);
      if (response) {
        fetchAllProducts();
        toast.success("Ürün kaldırıldı.");
      } else {
        toast.error("Bilinmeyen hata! Hata kodu: AP-58");
      }
    } catch (error) {
      console.error(error);
      toast.error("Bilinmeyen hata! Hata kodu: AP-60");
    }
  };

  const handleAddCart = async (data: Product) => {
    const id = localStorage.getItem("id") ?? null;
    if (id === null) {
      toast.error("Sepete ürün eklemek için kayıt olmanız gerekir.");
      return;
    }

    try {
      const product = await ProductManager.getProduct(data.id);
      const form = new FormData();
      form.append("id", id);
      form.append("pid", data.id);

      const cartProduct = await CartManager.getProductInCart(form);
      if (product !== null && product.stock < 1) {
        toast.error("Stok tükenmiştir.");
        return;
      } else if (
        cartProduct !== null &&
        product !== null &&
        cartProduct.amount >= product.stock
      ) {
        toast.error(
          `Stoktaki miktardan fazlası sepete eklenemez. Ürün stoğu: ${product.stock}`
        );
        return;
      }

      const formData = new FormData();
      formData.append("id", id);
      formData.append("pid", data.id);
      formData.append("amount", "1");
      formData.append("date", Date.now().toString());

      const result = await CartManager.addProductToCart(formData);
      if (result === true) {
        const formData = new FormData();
        formData.append("id", id);
        // const response = await CartManager.fetchCart(formData);

        toast.success("Ürün sepete eklendi!");
      } else {
        toast.error("Ürün sepete eklenemedi.");
      }
    } catch (error) {
      toast.error(`Bir sorun oluştu! Hata kodu: HAC-114`);
      console.log(error);
    }
  };

  // const toggleText = (text: string, size: number = 40) => {
  //   const isShortened = text.length > size;
  //   const shortenedText = isShortened ? `${text.substring(0, size)}..` : text;

  //   const handleClick = () => {
  //     if (isShortened) {
  //       alert(text);
  //     }
  //   };

  //   return (
  //     <span
  //       onClick={handleClick}
  //       className={`cursor-${isShortened ? "pointer" : "auto"}`}
  //     >
  //       {shortenedText}
  //     </span>
  //   );
  // };

  return products.length === 0 ? (
    <div></div>
  ) : (
    <section
      id="all"
      className="relative pl-4 pr-4 mx-auto my-8 sm:px-8 space-y-4"
    >
      <div className="flex flex-wrap space-y-4 mx-auto justify-center items-end mt-2 grid-cols-2 gap-4 md:gap-8 md:grid-cols-3 lg:grid-cols-4 lg:space-y-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            isAdmin={isAdmin}
            product={product}
            removeProduct={removeProduct}
            handleAddCart={handleAddCart}
          />
        ))}
      </div>
    </section>
  );
};

export default Products;

type ProductCardProps = {
  isAdmin: boolean;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    stock: number;
    image: string;
    index?: number;
  };
  removeProduct: (id: string, path: string) => void;
  handleAddCart: (product: Product) => void;
};

const ProductCard = ({
  isAdmin,
  product,
  removeProduct,
  handleAddCart,
}: ProductCardProps) => (
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
    {product.index === 3 ? (
      <div>
        <div className="absolute top-0 bottom-0 w-full h-full rounded-2xl justify-center items-center bg-white opacity-40"></div>
        <a
          href="/products"
          className="absolute btn bottom-1/2 left-0 right-0 mx-4"
        >
          <span className="text-neutral text-base text-center">
            Tüm ürünler için tıklayın
          </span>
        </a>
      </div>
    ) : (
      <></>
    )}
  </div>
);
