import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "react-hot-toast";
import GoogleAnalytics from "./analytics";
import Login from "@/modal/login";
import Registration from "@/modal/registration";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Gönen Kleopatra",
  description: "Doğal gül ve gül ürünleri",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.className}>
      <GoogleAnalytics />

      <body
        data-theme="valentine"
        className={`${
          process.env.NODE_ENV === "development" ? "debug-screens" : undefined
        }`}
      >
        <Toaster position="bottom-right" reverseOrder={false} />
        {children}

        <Registration />
        <Login />
      </body>
    </html>
  );
}
