"use client";

import Store from "@/app/_components/store";
import Products from "@/app/_components/products";
import Footer from "@/app/_components/footer";
import { useEffect } from "react";
import Logger from "@/utils/logger";

export default function Home(): JSX.Element {
  //bg-[#f3e1dd]
  useEffect(() => {
    Logger.log(process.env.NEXT_PUBLIC_NODE_ENV, "load");
  }, []);

  return (
    <main>
      {/* <Nav /> */}
      <Store />
      <div className="divider mx-10"></div>
      <Products />
      <Footer />
    </main>
  );
}
