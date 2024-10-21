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
  description: "Doğal gül ve gül ürünleri",
  openGraph: {
    title: "gonenkleopatra.com",
    description: "Space enthusiast who loves creating and building things.",
    url: "https://www.gonenkleopatra.com",
    siteName: "gonenkleopatra.com",
    emails: ["gonenkleopatra@gmail.com"],
    images: [
      {
        url: "https://www.gonenkleopatra.com/images/kleopatra-logo.png",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "tr-TR",
    type: "website",
  },
  icons: {
    shortcut: "/favicon.png",
  },
  twitter: {
    site: "@gonenkleopatra",
    title: "gonenkleopatra.com",
    card: "summary_large_image",
  },
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
