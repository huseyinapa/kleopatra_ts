"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

import Nav from "@/app/_components/nav";
import Footer from "@/app/_components/footer";

import CartManager from "@/services/cart";
import ProductManager from "@/services/product";


interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

export default function AllProduct() {
  const [products, setProducts] = useState<Product[]>([]); // Initialize with an empty array
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    fetchAllProduct();
    checkIsAdmin();
  }, []);

  const checkIsAdmin = () => {
    const getPermission = parseInt(localStorage.getItem("permission") ?? "0");

    setIsAdmin(getPermission === 1);
  };

  const fetchAllProduct = async () => {
    try {
      const response = await ProductManager.fetchAllProducts();
      if (response !== null && Array.isArray(response)) {
        setProducts(response);
      } else {
        setProducts([]); // Set products to an empty array if response is not valid
      }
    } catch (error) {
      console.log(error);
      alert("FeaturedProducts bilinmeyen hata!");
    }
  };

  const removeProduct = async (pid: string, path: string) => {
    const removeForm = new FormData();
    removeForm.append("id", pid);
    removeForm.append("path", path);

    try {
      const response = await ProductManager.removeProduct(removeForm);

      if (!response) return toast.error("Bilinmeyen hata!");

      const id = localStorage.getItem("id");

      const getProductInCartForm = new FormData();
      getProductInCartForm.append("id", id as string);
      getProductInCartForm.append("pid", pid);

      await CartManager.removeProductFromCart(getProductInCartForm);
      toast.success("Ürün kaldırıldı.");
      fetchAllProduct();
    } catch (error) {
      toast.error("Bilinmeyen hata!");
      console.error(error);
    }
  };

  const handleAddCart = async (data: Product) => {
    const id = localStorage.getItem("id") ?? null;
    if (id === null) {
      toast.error(
        "Sepete ürün eklemek için kayıt olmanız/giriş yapmanız gerekir."
      );
      return;
    }

    try {
      const idForm = new FormData();
      idForm.append("id", data.id);
      const product = await ProductManager.getProduct(idForm);

      const form = new FormData();
      form.append("id", id);
      form.append("pid", data.id);

      const cartProduct = await CartManager.getProductInCart(form);

      if (product.stock < 1) {
        toast.error("Stok tükenmiştir.");
        return;
      } else if (cartProduct !== null && cartProduct.amount >= product.stock) {
        toast.error(
          `Stoktaki miktardan fazlası sepete eklenemez. Ürün stoğu: ${product.stock}`
        );
        return;
      }

      const formData = new FormData();
      formData.append("id", id); // Müşteri kimliği
      formData.append("pid", data.id);
      formData.append("amount", "1");
      formData.append("date", Date.now().toString());

      const response = await CartManager.addProductToCart(formData);
      if (response) {
        toast.custom((t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="images/icons/warning.png"
                    alt="warning.png"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Sepete eklendi!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Ürün sepete eklendi!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <a
                href="/cart"
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Sepete git
              </a>
            </div>
          </div>
        ));
      } else {
        return toast.error("Ürün sepete eklenemedi.");
      }
    } catch (error) {
      toast.error("Bilinmeyen hata. Kod: #AP-HAC");
      console.log(error);
    }
  };

  function slugify(text: string): string {
    const turkishMap: { [key: string]: string } = {
      'ç': 'c', 'Ç': 'C',
      'ğ': 'g', 'Ğ': 'G',
      'ı': 'i', 'İ': 'I',
      'ö': 'o', 'Ö': 'O',
      'ş': 's', 'Ş': 'S',
      'ü': 'u', 'Ü': 'U'
    };

    return text
      .toLowerCase()
      .replace(/[çÇğĞıİöÖşŞüÜ]/g, (match) => turkishMap[match] || match)
      .replace(/[^a-z0-9\-]/g, '-')  // Alfanümerik olmayan karakterleri "-" ile değiştir
      .replace(/-+/g, '-')           // Birden fazla "-" varsa tek "-"e indir
      .replace(/^-|-$/g, '');        // Başta ve sonda "-" varsa temizle
  }

  const ProductCard = ({ product }: { product: Product }) => {
    return (
      <div
        key={product.id}
        className="card card-compact bg-[#cc3b6477] text-neutral-content w-40 md:w-72 h-80 lg:h-auto shadow-[#c2154677] shadow-2xl"
      >
        <figure className="relative pt-4">
          <Link href={`/products/${slugify(product.name)}-${product.id.toLowerCase()}`}>
            <img
              src={product.image}
              alt={product.name}
              className="w-36 h-48 md:w-56 md:h-52 lg:w-60 lg:h-64 object-cover rounded-lg"
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
                <path d="M 24 4 C 20.491685 4 17.570396 6.6214322 17.080078 10 L 10.238281 10 A 1.50015 1.50015 0 0 0 9.9804688 9.9785156 A 1.50015 1.50015 0 0 0 9.7578125 10 L 6.5 10 A 1.50015 1.50015 0 1 0 6.5 13 L 8.6386719 13 L 11.15625 39.029297 C 11.427329 41.835926 13.811782 44 16.630859 44 L 31.367188 44 C 34.186411 44 36.570826 41.836168 36.841797 39.029297 L 39.361328 13 L 41.5 13 A 1.50015 1.50015 0 1 0 41.5 10 L 38.244141 10 A 1.50015 1.50015 0 0 0 37.763672 10 L 30.919922 10 C 30.429604 6.6214322 27.508315 4 24 4 z M 24 7 C 25.879156 7 27.420767 8.2681608 27.861328 10 L 20.138672 10 C 20.579233 8.2681608 22.120844 7 24 7 z M 11.650391 13 L 36.347656 13 L 33.855469 38.740234 C 33.730439 40.035363 32.667963 41 31.367188 41 L 16.630859 41 C 15.331937 41 14.267499 40.033606 14.142578 38.740234 L 11.650391 13 z M 20.476562 17.978516 A 1.50015 1.50015 0 0 0 19 19.5 L 19 34.5 A 1.50015 1.50015 0 1 0 22 34.5 L 22 19.5 A 1.50015 1.50015 0 0 0 20.476562 17.978516 z M 27.476562 17.978516 A 1.50015 1.50015 0 0 0 26 19.5 L 26 34.5 A 1.50015 1.50015 0 1 0 29 34.5 L 29 19.5 A 1.50015 1.50015 0 0 0 27.476562 17.978516 z"></path>
              </svg>
            </button>
          )}
        </figure>
        <div className="card-body">
          <h1 className="card-title">{product.name}</h1>
          <p>{product.description}</p>
          <div className="card-actions justify-between items-center">
            <div className="font-semibold text-sm lg:text-lg">
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
  };

  return (
    <div data-theme="valentine">
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      <Nav />
      <div className="mx-auto justify-center mb-10">
        {products.length === 0 ? (
          <div className="mx-auto h-60 justify-center mt-7">
            <div className="flex flex-col justify-center items-center space-y-2">
              <span className="loading loading-spinner loading-lg"></span>
              <span className="">Yükleniyor..</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap space-y-4 mx-auto justify-center items-end mt-2 grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-4 xl:space-y-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
