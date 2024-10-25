/* eslint-disable react-hooks/exhaustive-deps */
"use client";

// pages/logout.jsx

import { useEffect } from "react";
import { clearLocalStorage, clearSessionStorage } from "@/utils/storage";

const Logout = () => {
  useEffect(() => {
    // localStorage verilerini temizle
    clearLocalStorage();
    clearSessionStorage();
    // Ana sayfaya yönlendir
    window.location.href = "/";
  }, []);

  return null; // Sayfada herhangi bir içerik gösterilmeyecek
};

export default Logout;
