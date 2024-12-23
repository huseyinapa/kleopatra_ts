"use server";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { CookiePayload } from "@/types/cookie";

export async function GET(): Promise<NextResponse<CookiePayload>> {
  console.log("GET /api/cookie called");

  const cookieStore = cookies();
  const token = cookieStore.get("session-token")?.value;
  const secret = process.env.JWT_SECRET;

  console.warn("GET /api/cookie - Token: ", token);
  if (!token) {
    console.warn("GET /api/cookie - Token eksik");
    return NextResponse.json(
      { success: false, message: "Oturum token'i bulunamadı. Giriş yapın." }
      // { status: 400 }
    );
  }

  if (!secret) {
    console.error("GET /api/cookie - JWT_SECRET eksik");
    return NextResponse.json(
      { success: false, message: "Sunucu yapılandırmasında eksiklik var." }
      // { status: 500 }
    );
  }

  try {
    console.log("GET /api/cookie - Token doğrulanıyor...");
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    console.log("GET /api/cookie - Token doğrulandı: ", payload);

    return NextResponse.json({ success: true, payload });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
    console.error("GET /api/cookie - Token doğrulama hatası:", errorMessage);

    return NextResponse.json(
      { success: false, message: "Token doğrulanamadı.", error: errorMessage },
      { status: 401 }
    );
  }
}
