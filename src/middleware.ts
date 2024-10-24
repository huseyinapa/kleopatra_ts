import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import toast from "react-hot-toast";

// Kontrol edilmesi gereken sayfalar
// const adminRoute = ["/add-product"];
const protectedRoutes = ["/cart", "/orders", "/add-product", "/confirm-order"];

export function middleware(req: NextRequest) {
  // Oturum verilerini kontrol et (örneğin token)
  const token = req.cookies.get("session-token");
  // const perm = req.cookies.get("permission"); //! biz yine de permission ekleyelim.

  // Eğer korumalı bir sayfaya erişim varsa ve oturum yoksa yönlendir
  console.log(req.nextUrl.pathname + " korunuyor.");

  if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    toast.error("Bu sayfaya erişmek için giriş yapmalısınız!");

    return NextResponse.redirect(url);
  }
  // if (adminRoute.includes(req.nextUrl.pathname) && perm?.value !== "admin") {
  //   const url = req.nextUrl.clone();
  //   url.pathname = "/";
  //   toast.error("Bu sayfaya erişmek için yönetici olmalısınız!");

  //   return NextResponse.redirect(url);
  // }

  // Oturum varsa ya da korumasız sayfalarda erişim sağlanır
  return NextResponse.next();
}

// Middleware sadece bu yollar için çalışacak
export const config = {
  matcher: ["/cart", "/orders", "/add-product", "/confirm-order"],
};
