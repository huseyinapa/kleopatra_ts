"use client";

import React, { useState } from "react";

const Store: React.FC = () => {
  const images = ["images/magaza1.jpg", "images/magaza2.jpg"];
  const [currentIndex, setCurrentIndex] = useState(0);

  const changeImage = (index: number) => {
    setCurrentIndex(index);
    const magazaFoto = document.getElementById("magazaFoto") as HTMLImageElement;
    if (magazaFoto) {
      magazaFoto.src = images[index];
    }
  };

  return (
    <div className="container mx-auto my-8 pl-10 pr-10">
      <div className="flex flex-col items-center my-8 sm:flex-row">
        <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
          <div className="w-full h-64 sm:h-96 rounded-lg overflow-hidden">
            <img
              id="magazaFoto"
              src="images/magaza1.jpg"
              alt="Mağaza Fotoğrafı"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="w-10 h-10 mt-2 bg-gradient-to-br from-[#c21546] to-[#d96a81] text-white rounded-full opacity-50 transition-opacity duration-300 hover:opacity-100 focus:outline-none transform hover:scale-110 ml-1 flex items-center justify-center shadow-lg"
              onClick={() => changeImage(0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <img
              src="images/magaza1.jpg"
              alt="Mağaza 1"
              className="w-20 h-15 rounded-lg mx-1 cursor-pointer"
              onClick={() => changeImage(0)}
            />
            <img
              src="images/magaza2.jpg"
              alt="Mağaza 2"
              className="w-20 h-15 rounded-lg mx-1 cursor-pointer"
              onClick={() => changeImage(1)}
            />
            <button
              className="w-10 h-10 mt-2 bg-gradient-to-br from-[#c21546] to-[#d96a81] text-white rounded-full opacity-50 transition-opacity duration-300 hover:opacity-100 focus:outline-none transform hover:scale-110 ml-1 flex items-center justify-center shadow-lg"
              onClick={() => changeImage(1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="w-full sm:w-1/2 ml-0 sm:ml-8 mb-14">
          <h1 className="mb-8 text-5xl sm:text-6xl text-center tracking-tight font-bold">
            <span className="animate-text bg-gradient-to-r from-[#c21546] via-[#c21546b6] to-[#c215465b] bg-clip-text text-transparent text-5xl font-bold">
              Gönen Kleopatra
            </span>
          </h1>
          <p className="text-gray-700 mb-4 font-medium text-center">
            En güzel ve taze gül ürünlerini sizlere sunmaktan mutluluk
            duyuyoruz. Gül Bahçesi olarak, sevgi dolu ve zarif güllerle dolu bir
            dünyaya kapılarınızı açıyoruz.
          </p>
          <p className="text-gray-700 mb-4 font-medium text-center">
            Mağazamızda birbirinden şık ve etkileyici güllerin yanı sıra, gül
            yağları, gülsuyu, güllü kozmetik ürünleri ve daha birçok özel ürün
            bulabilirsiniz. Her bir ürünümüz özenle seçilen ve yetiştirilen
            güllerden elde edilmektedir.
          </p>
          <p className="text-gray-700 mb-4 font-medium text-center">
            Doğanın en güzel armağanlarından biri olan güller, güzellik, aşk ve
            romantizm sembolüdür.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Store;
