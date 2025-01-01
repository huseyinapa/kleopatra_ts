import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { api_url } from "./utils/api";

const NODE_ENV = process.env.NEXT_PUBLIC_NODE_ENV as
  | "development"
  | "production";

const adminRoutes = ["/add-product", "/confirm-order"];
const protectedRoutes = ["/cart", "/orders"];
const secret = NODE_ENV ?? "falan-filan87fsd7f";

if (!secret) {
  console.error("JWT_SECRET tanımlanmadı!");
}

if (NODE_ENV === "development") {
  console.log("Node env:", NODE_ENV);
  console.log(api_url);
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

  if (NODE_ENV === "development") {
    console.log("Kontrol edilen yol:", pathname);
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
