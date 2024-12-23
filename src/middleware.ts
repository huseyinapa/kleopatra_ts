import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const adminRoutes = ["/add-product", "/confirm-order"];
const protectedRoutes = ["/cart", "/orders"];
const secret = process.env.JWT_SECRET;

if (!secret) {
  console.error("JWT_SECRET tanımlanmadı!");
}

function isProtectedRoute(pathname: string) {
  return protectedRoutes.includes(pathname);
}

function isAdminRoute(pathname: string) {
  return adminRoutes.includes(pathname);
}

async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  return payload.permission as string | undefined;
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session-token")?.value;
  const { pathname } = req.nextUrl;

  if (process.env.NODE_ENV === "development") {
    console.log("Kontrol edilen yol:", pathname, "token:", token);
  }

  // Korunan sayfalar için oturum kontrolü
  if (isProtectedRoute(pathname) && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Admin sayfaları için ek kontrol
  if (isAdminRoute(pathname)) {
    if (!token) {
      // Token yoksa direkt engelle
      return NextResponse.redirect(new URL("/", req.url));
    }

    const permission = await verifyToken(token);
    if (permission !== "1") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|sitemap|.*\\..*|/).*)"],
  runtime: "nodejs",
};
