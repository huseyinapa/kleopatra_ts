"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { productIdentifier } from "../../../actions/idCreator";
import Footer from "../../_components/footer";
import Header from "../../_components/nav";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import ProductManager from "@/services/product";
import { NODE_ENV } from "@/utils/api";

const ProductAdd: React.FC = () => {
  const [image, setImage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const [isFeatured, setIsFeatured] = useState<boolean>(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImage(reader.result as string);
          setImageName(file.name);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      if (NODE_ENV === "development") console.error(error);
    }
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleStockChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStock(event.target.value);
  };

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };

  const handleFeaturedChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsFeatured(event.target.checked);
  };

  const handleAddProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (image === "") {
      alert("Görsel ekleyiniz.");
      return;
    }

    const kdv = parseInt(price) * 0.2;
    const pprice = parseInt(price) + kdv;
    const id = await productIdentifier();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("id", id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", pprice.toString());
    formData.append("stock", stock);
    formData.append("featured", isFeatured.toString());
    formData.append("imageName", imageName);

    try {
      await toast.promise(ProductManager.addProduct(formData), {
        loading: "Ekleniyor...",
        success: () => {
          setName("");
          setImage("");
          setImageName("");
          setDescription("");
          setStock("");
          setPrice("");
          setIsFeatured(false);

          window.location.reload();
          return "Ürün sepete eklendi!";
        },
        error: <b>Ürün sepete eklenemedi.</b>,
      });
    } catch (error) {
      toast.error("Ürün eklenemedi." + error);
    }
  };

  return (
    <div data-theme="valentine">
      <Toaster position="bottom-right" reverseOrder={false} />

      <Header />
      <div className="flex flex-row mx-auto">
        <div className="mx-auto">
          <div className="w-96 h-96 mx-auto rounded-lg overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt="Ürün Görseli"
                className="w-full h-full mx-auto object-cover"
                width={20}
                height={20}
              />
            ) : (
              <div className="w-64 h-64 mx-auto bg-gray-400"></div>
            )}
          </div>
        </div>
        <div className="w-[700px] p-4 pr-52 mx-auto">
          <h2 className="text-2xl font-semibold mb-4 ">Ürün Ekle</h2>
          <input
            type="file"
            accept="image/*"
            id="imageUpload"
            onChange={handleImageChange}
            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
          />
          <form onSubmit={handleAddProduct}>
            <div className="mb-4 mt-5">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Ürün Adı</span>
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="input input-bordered w-full max-w-xs"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
              </div>
            </div>
            <label className="label">
              <span className="label-text">Ürün Açıklaması</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              className="textarea textarea-bordered h-20 w-full max-w-xs"
              placeholder=""
              required
            ></textarea>
            <div className="flex flex-row mb-4 space-x-4">
              <div>
                <label
                  htmlFor="amount"
                  className="block font-medium text-gray-700"
                >
                  Stok:
                </label>
                <input
                  type="number"
                  id="amount"
                  value={stock}
                  onChange={handleStockChange}
                  className="w-40 px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder="Ürün Stok Miktari"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block font-medium text-gray-700"
                >
                  Fiyat (kdv otomatik eklenecektir):
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={handlePriceChange}
                  className="w-52 px-4 py-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder="Ürün Fiyatı"
                  required
                />
              </div>
            </div>
            <label className="label cursor-pointer justify-start space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={isFeatured}
                onChange={handleFeaturedChange}
                className="checkbox checkbox-primary"
              />
              <span className="label-text">Öne Çıkan Ürün</span>
            </label>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Kaydet
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductAdd;
