import React from "react";
import Nav from "../_components/nav";
import Footer from "../_components/footer";

const NotFound: React.FC = () => {
  return (
    <div className="m-auto w-[100%]">
      <Nav />
      <div className="h-[600px] md:h-[400px] flex justify-center items-center">
        <div className="flex flex-col items-center space-y-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h1 className="font-bold text-4xl">Sepetiniz şu an boş</h1>
          <p className="pt-2 text-center">
            Doğal ürünlerimizden dilediğinizi sepetinize ekleyebilir,
            dilediğiniz zaman ödemenizi gerçekleştirebilirsiniz.
          </p>
          <a className="btn btn-primary text-white" href="/products">
            Hemen Göz Atın!
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
