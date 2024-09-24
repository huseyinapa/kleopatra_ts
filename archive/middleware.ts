import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import toast from "react-hot-toast";

// Kontrol edilmesi gereken sayfalar
const protectedRoutes = ["/cart", "/products", "/orders", "/account"];

export function middleware(req: NextRequest) {
  // Oturum verilerini kontrol et (örneğin token)
  const token = req.cookies.get("session-token");

  // Eğer korumalı bir sayfaya erişim varsa ve oturum yoksa yönlendir
  if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    toast.error("Bu sayfaya erişmek için giriş yapmalısınız!");

    return NextResponse.redirect(url);
  }

  // Oturum varsa ya da korumasız sayfalarda erişim sağlanır
  return NextResponse.next();
}

// Middleware sadece bu yollar için çalışacak
export const config = {
  matcher: ["/cart", "/products/:path*", "/orders", "/account"],
};
