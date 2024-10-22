"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { trackGAEvent } from "@/utils/google-analytics";
import { logoutUser } from "@/services/auth";

// Props için TypeScript tipi tanımlıyoruz

export default function Nav() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const logOut = async () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("permission");
    localStorage.removeItem("last_login");
    localStorage.removeItem("date");

    await logoutUser();
    window.location.href = "/";
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");

    if (storedEmail) {
      setEmail(storedEmail);
      setIsLoggedIn(true);
    }
    checkIsAdmin();
  }, []);

  function checkIsAdmin() {
    const getPermission = parseInt(localStorage.getItem("permission") ?? "0");

    if (getPermission === 1) setIsAdmin(true);
    else setIsAdmin(false);
  }

  return (
    <header className="flex flex-row justify-center md:justify-between flex-wrap gap-6 p-4 shadow-gray-600/10 translate-y-1 transition-all duration-300 scale-95 origin-top lg:relative lg:scale-100 lg:peer-checked:translate-y-0 lg:translate-y-0 lg:flex lg:flex-row lg:items-center lg:gap-0 lg:p-8 lg:bg-transparent lg:visible lg:opacity-100 peer-checked:scale-100">
      {/* sm screen */}

      <div className="flex items-center lg:justify-between sm:flex-row">
        <Link href="/">
          <Image
            src="/images/kleopatra-logo.png"
            alt="Kleopatra Logo"
            className="mr-4 cursor-pointer"
            width={250}
            height={0}
            priority
          />
        </Link>
      </div>
      <div className="flex items-center justify-center">
        {isLoggedIn ? (
          <div className="flex space-x-4">
            <Link
              href={"/orders"}
              className="btn btn-ghost w-auto px-4 btn-square shadow-md"
              onClick={() => {
                trackGAEvent(
                  "Test Kategorisi",
                  "Siparişlerim",
                  "Butona Tıklama"
                );
              }}
            >
              <div className="flex flex-row items-center space-x-2">
                <Image
                  alt="bag"
                  src="/images/icons/shopping-bag.svg"
                  width={20}
                  height={20}
                />
                <span>Siparişlerim</span>
              </div>
            </Link>
            <Link href={"/cart"} className="btn btn-ghost btn-square shadow-md">
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
              </div>
            </Link>
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-square shadow-md"
              >
                <div className="rounded-full">
                  <Image
                    src={"/images/user.png"}
                    alt="user"
                    width={30}
                    height={30}
                    priority
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content w-52 mt-3 z-50 p-2 shadow bg-base-100 rounded-box"
              >
                <li>
                  <a className="justify-between">{email}</a>
                </li>
                <div className="divider h-1"></div>
                <li>
                  {isAdmin && (
                    <Link
                      href="/add-product"
                      className="block px-4 py-2 hover:bg-gray-100 truncate"
                    >
                      Ürün Ekle
                    </Link>
                  )}
                </li>
                <li>
                  <button
                    className="block px-4 py-2 text-red-500 hover:bg-gray-100 truncate"
                    onClick={logOut}
                  >
                    Çıkış
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-x-4">
            <button
              className="btn"
              onClick={() =>
                (
                  document.getElementById("register_modal") as HTMLDialogElement
                )?.showModal()
              }
            >
              Kayıt Ol
            </button>
            <button
              className="btn hover:bg-button-rose hover:text-white"
              onClick={() =>
                (
                  document.getElementById("login_modal") as HTMLDialogElement
                )?.showModal()
              }
            >
              Giriş Yap
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
