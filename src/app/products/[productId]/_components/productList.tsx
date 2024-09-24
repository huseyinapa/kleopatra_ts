"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

import CartManager from "@/services/cart";
import ProductManager from "@/services/product";
import { Product } from "../page";

interface ProductListProps {
    excludingProductId: string;
}

export default function ProductList({ excludingProductId }: ProductListProps) {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        checkIsAdmin();
        getProducts();
    }, []);

    const formatter = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
    });


    function checkIsAdmin() {
        const getPermission = parseInt(localStorage.getItem("permission") ?? "0");
        setIsAdmin(getPermission === 1);
    }

    async function getProducts() {
        try {
            const products = await ProductManager.fetchAllProducts();
            if (products !== null) {
                setProducts(products.filter((e: Product) => e.id !== excludingProductId));
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
        <div className="">
            {loading && (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )}
            <div
                className={`flex flex-wrap mx-auto justify-center sm:items-center grid-cols-2 md:grid-cols-3 gap-4 md:gap-6
          ${loading ? "opacity-50" : ""}
          `}
            >
                {products.length === 0 ? (
                    <div></div>
                ) : (
                    products.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </div>
        </div>
    );

    function slugify(text: string) {
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
            .replace(/[çÇğĞıİöÖşŞüÜ]/g, function (match) {
                return turkishMap[match];
            })
            .replace(/[^a-z0-9\-]/g, '-')  // Alfanümerik olmayan karakterleri - ile değiştir
            .replace(/-+/g, '-')           // Birden fazla "-" varsa tek "-"e indir
            .replace(/^-|-$/g, '');
    }

    function ProductCard({ product }: { product: Product }) {

        return (
            <div
                key={product.id}
                className="card bg-white text-neutral-content w-[170px] sm:w-[180px] md:w-[260px] h-[330px] md:h-[400px]  shadow-[#FFA4D5] shadow-[0_0_40px_3px]"
            >
                <figure className="relative">
                    <Link href={`/products/${slugify(product.name)}-${product.id.toLowerCase()}`}>
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-[160px] sm:h-[180px] md:h-[200px] w-72 object-cover rounded-t-lg"

                            onClick={() => { }}
                        />
                    </Link>

                    <div className="absolute bg-secondary w-14 sm:w-20 h-6 sm:h-8 md:h-10 place-content-center bottom-3 right-0 rounded-l-xl">
                        <span className="pl-4 text-xs sm:text-sm md:text-md  font-bold">
                            {product.size} {product.type}
                        </span>
                    </div>
                </figure>
                <div className="card-body relative mx-auto p-0 pt-3 px-1">
                    <h1 className="card-title text-base md:text-lg justify-center text-[#8a4269] font-bold">
                        {product.name}
                    </h1>
                    <div className="divider bg-[#e2a9c8] h-[1px] w-36 md:w-48 m-auto"></div>
                    <p className="text-base text-center md:text-lg text-[#8a4269]">
                        {product.description}
                    </p>
                </div>
                <div className="card-actions flex-col-reverse sm:flex-row sm:justify-between items-center gap-3 pb-3 sm:p-3">
                    <button
                        className="btn btn-xs md:btn-sm w-32 h-8 bg-secondary text-white"
                        onClick={() => handleAddCart(product)}
                    >
                        Sepete Ekle
                    </button>
                    <div className="text-[#8a4269] font-semibold text-base">
                        {product.price
                            ? parseInt(product.price.toString()).toLocaleString("tr-TR", {
                                style: "currency",
                                currency: "TRY",
                            })
                            : "Fiyat bilgisi yok"}
                    </div>
                </div>
            </div>
        );
    }

    async function handleAddCart(data: Product) {
        const id = localStorage.getItem("id") ?? null;
        if (id === null) {
            toast.error("Sepete ürün eklemek için kayıt olmanız/giriş yapmanız gerekir.");
            return;
        }

        try {
            const productData = await ProductManager.getProduct(data.id);

            const productInCartForm = new FormData();
            productInCartForm.append("id", id);
            productInCartForm.append("pid", data.id);

            const cartProductData = await CartManager.getProductInCart(productInCartForm);

            if (productData !== null && productData.stock < 1) {
                return toast.error("Ürün stokta bulunmuyor.");
            } else if (cartProductData !== null && productData !== null && cartProductData.amount >= productData.stock) {
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
