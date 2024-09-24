"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import CartManager from "@/services/cart";
import ProductManager from "@/services/product";

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
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

  const handleAddCart = async (data: any) => {
    const id = localStorage.getItem("id") ?? null;
    if (id === null) {
      toast.error("Sepete ürün eklemek için kayıt olmanız gerekir.");
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
    }
  };

  const toggleText = (text: string, size: number = 40) => {
    const isShortened = text.length > size;
    const shortenedText = isShortened ? `${text.substring(0, size)}..` : text;

    const handleClick = () => {
      if (isShortened) {
        alert(text);
      }
    };

    return (
      <span
        onClick={handleClick}
        className={`cursor-${isShortened ? "pointer" : "auto"}`}
      >
        {shortenedText}
      </span>
    );
  };

  return products.length === 0 ? (
    <div></div>
  ) : (
    <section
      id="all"
      className="relative pl-4 pr-4 mx-auto my-8 sm:px-8 space-y-4"
    >
      <div className="flex flex-wrap space-y-4 justify-center sm:items-end sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-6 xl:gap-10 xl:space-y-5">
        {products.map((product) => (
          <ProductCard key={product.id} isAdmin={isAdmin} product={product} removeProduct={removeProduct} handleAddCart={handleAddCart} />
        ))}
      </div>
    </section>
  );

};

export default Products;

type ProductCardProps = {
  isAdmin: boolean,
  product: {
    id: string,
    name: string,
    description: string,
    price: any,
    stock: any,
    image: string,
    index: number,
  },
  removeProduct: (id: string, path: string) => void,
  handleAddCart: (product: any) => void
}

const ProductCard = ({ isAdmin, product, removeProduct, handleAddCart }: ProductCardProps) => (
  <div
    key={product.id}
    className="relative card card-compact bg-[#cc3b6477] text-neutral-content w-60 lg:w-72 h-[450px] max-h-[500px] shadow-[#c2154677] shadow-2xl"
  >
    <figure className="relative pt-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-52 lg:w-60 h-64 object-cover rounded-lg"
      />
      {isAdmin && (
        <button
          className="absolute top-5 right-5 btn btn-sm lg:btn-md btn-circle shadow-sm"
          onClick={() => removeProduct(product.id, product.image)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
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
        <div className="font-semibold text-lg">{product.price}₺</div>
        <button
          className="btn btn-sm lg:btn-md shadow-lg"
          onClick={() => handleAddCart(product)}
        >
          Sepete Ekle
        </button>
      </div>
    </div>
    {product.index === 3 ? (
      <div>
        <div className="absolute top-0 bottom-0 w-full h-full rounded-2xl justify-center items-center bg-white !opacity-40"></div>
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
