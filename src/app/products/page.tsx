"use client";

import ProductManager from "@/services/product";
import ProductCard from "./_components/ProductCard";
import Footer from "@/app/_components/footer";
import { Product } from "@/types/product";
import { useUser } from "@/provider/UserContextProvider";
import { useEffect, useState } from "react";

async function fetchProducts() {
  try {
    const response: Product[] = (await ProductManager.fetchAllProducts()) || [];
    return response;
  } catch (error) {
    if (process.env.NODE_ENV === "development")
      console.error("Product fetch error:", error);
    return [];
  }
}

export default function AllProductsPage() {
  return (
    <div>
      <AllProducts />
      <Footer />
    </div>
  );
}

function AllProducts() {
  const user = useUser();
  const isAdmin: boolean = user?.permission === "1" || false;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      const products = await fetchProducts();
      setProducts(products || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="mx-auto justify-center mb-10">
      {loading ? (
        <div className="mx-auto h-60 justify-center mt-7">
          <div className="flex flex-col justify-center items-center space-y-2">
            <span className="loading loading-spinner loading-lg"></span>
            <span>Yükleniyor..</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap space-y-4 mx-auto justify-center items-end mt-2 grid-cols-2 gap-4 md:gap-8 md:grid-cols-3 lg:grid-cols-4 lg:space-y-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}
