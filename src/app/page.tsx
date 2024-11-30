"use client";

import Nav from "@/app/_components/nav";
import Store from "@/app/_components/store";
import Products from "@/app/_components/products";
import Footer from "@/app/_components/footer";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getCookie } from "@/services/cookie";

export default function Home(): JSX.Element {
  //bg-[#f3e1dd]

  useEffect(() => {
    const cookie = getCookie("test");
    toast.success("Welcome to our store!");
    console.log("cookie: " + cookie);
  }, []);

  return (
    <main>
      <Nav />
      <Store />
      <div className="divider mx-10"></div>
      <Products />
      <Footer />
    </main>
  );
}
