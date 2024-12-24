import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Footer from "@/app/_components/footer";
import AddToCartButton from "./_components/addToCartButton";
import ProductList from "./_components/productList";
import { api_url } from "@/utils/api";
import { Product } from "@/types/product";
import NotFound from "./not-found";
import Logger from "@/utils/logger";

async function getProductData(productId: string): Promise<Product | null> {
  try {
    const { data: product } = await axios.get(
      `${api_url}/api_kleopatra/product/get_dev.php?id=${productId}`
    );

    if (!product) {
      return null;
    }
    return product.data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.log("HATA:" + error);
    return null;
  }
}

function extractIdFromUrl(url: string): string {
  // URL'deki son segmenti al
  const lastSegment = url.split("/").pop() || "";
  // ID'nin son iki kısmını birleştir
  const splitSegment = lastSegment.split("-");
  const id = splitSegment.slice(-2).join("-");
  Logger.log("productId: " + id, "log");

  return id;
}

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductPage({
  params: { productId },
}: ProductPageProps) {
  Logger.log("productUrl: " + productId);

  const id = extractIdFromUrl(productId);

  const product = await getProductData(id);
  if (!product) {
    return <NotFound />;
  }

  return (
    <div className="min-w-full">
      {/* <Nav /> */}

      <title>Ürün Detayı - Gönen Kleopatra</title>
      <meta
        name="description"
        content={`Gönen Kleopatra üzerinden ${product.name} ürününü inceleyin.`}
      />

      <div className="container flex flex-row items-center justify-between p-6 mx-auto">
        <Link
          href="/products"
          className="flex items-center gap-4 duration-200 hover:text-[#cc5c8b]"
        >
          <ArrowLeft className="w-6 h-6" />
          <h1 className="font-bold text-2xl text-pretty">{product.name}</h1>
        </Link>
      </div>

      <div className="container flex flex-col lg:flex-row items-center lg:items-start p-4 mx-auto gap-4 duration-500">
        <div
          key={product.id}
          className="flex flex-col md:flex-row border-[#e497b1] border-2 p-3 md:p-4 rounded-lg space-x-4 w-[90%] md:w-[85%] lg:w-[65%]"
        >
          <figure className="relative">
            <Image
              src={product.image}
              alt={product.name}
              className="w-96 py-4 object-contain rounded-lg"
              width={20}
              height={20}
            />
            <div className="absolute top-0 left-0 flex flex-col bg-green-800 size-[70px] rounded-full text-white items-center justify-center font-bold">
              <span>%100</span>
              <span>doğal</span>
            </div>
          </figure>
          <div className="container flex flex-col gap-2 justify-between">
            <div className="flex flex-row items-center">
              <h1 className="font-bold text-2xl text-pretty mr-auto">
                {product.name}
              </h1>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium text-md">{product.description}</p>
              <p
                className={
                  product.stock > 0 ? "text-green-800" : "text-red-500"
                }
              >
                {product.stock > 0 ? "Stokta var" : "Stokta yok"}
              </p>
              {/* <p>
                {product.size} {product.type}
              </p> */}
            </div>
            <div>
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-x-4 md:w-[85%] lg:w-[35%] ">
          <ProductList excludingProductId={product.id} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
