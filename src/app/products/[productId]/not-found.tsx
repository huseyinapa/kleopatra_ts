import Image from "next/image";
import React from "react";
import ProductManager from "@/services/product";

interface Product {
  id: string;
  image: string;
  name: string;
  description: string;
  index?: number;
}

const NotFound: React.FC = async () => {
  const products: Product[] =
    (await ProductManager.fetchFeaturedProducts()) || [];

  return (
    <div
      data-theme="valentine"
      className="flex flex-col justify-center items-center h-screen"
    >
      <Image
        src="/images/icons/product-not-found.svg"
        className="size-64"
        alt="Product Not Found"
        width={64}
        height={64}
      />
      <a>Ürün bulunamadı.</a>
      <div className="divider mx-auto w-[60%]">
        <a>Şimdi diğer ürünlerimize bir göz atın</a>
      </div>
      <div className="flex flex-wrap space-y-4 justify-center items-end grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 xl:gap-10 xl:space-y-5">
        {products.length > 0 ? (
          products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div>Ürün bulunamadı.</div>
        )}
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div
      key={product.id}
      className="relative card card-compact bg-[#cc3b6477] text-neutral-content w-52 lg:w-56 h-[330px] max-h-[500px] shadow-[#c2154677] shadow-2xl"
    >
      <figure className="relative pt-4">
        <Image
          src={product.image}
          alt={product.name}
          className="w-44 lg:w-44 h-44 object-cover rounded-lg"
          width={64}
          height={64}
        />
      </figure>
      <div className="card-body">
        <h1 className="card-title">{product.name}</h1>
        <p>{product.description}</p>
      </div>
      {product.index === 3 && (
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
      )}
    </div>
  );
};

export default NotFound;
