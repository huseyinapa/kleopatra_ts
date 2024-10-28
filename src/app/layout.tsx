import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import GoogleAnalytics from "./analytics";
import Login from "@/app/modal/login";
import Registration from "@/app/modal/registration";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "gonenkleopatra.com",
    template: "%s | gonenkleopatra.com",
  },
  category: "e-ticaret",
  keywords:
    "Isparta, Gönen, doğal gül, gül ürünleri, gül yağı, gül suyu, gül kremi, gül sabunu, gül şurubu, gül mayası",
  description: "Isparta Gönen doğal gül ve gül ürünleri.",

  openGraph: {
    title: "Gönen Kleopatra",
    description: "Isparta Gönen doğal gül ve gül ürünleri.",
    url: "https://www.gonenkleopatra.com",
    siteName: "gonenkleopatra.com",
    emails: ["gonenkleopatra@gmail.com"],
    images: [
      {
        url: "https://www.gonenkleopatra.com/images/kleopatra-logo.png",
        alt: "gonenkleopatra.com",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "tr-TR",
    type: "website",
    phoneNumbers: ["+905439485180", "+905438511612"],
  },
  icons: {
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  twitter: {
    site: "@gonenkleopatra",
    title: "gonenkleopatra.com",
    card: "summary_large_image",
    description: "Isparta Gönen doğal gül ve gül ürünleri.",
    images: [
      {
        url: "https://www.gonenkleopatra.com/images/kleopatra-logo.png",
        width: 1920,
        height: 1080,
      },
    ],
  },
  creator: "APA Dijital",
  authors: [{ name: "Merve Pektaş", url: "https://www.gonenkleopatra.com/" }],
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
