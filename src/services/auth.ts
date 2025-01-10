"use server";

import { NodeEnv } from "@/utils/api";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

// JWT secret key (Güvenli bir ortam değişkeni olarak saklayın)
const JWT_SECRET = process.env.JWT_SECRET || "falan-filan";

/**
 * Kullanıcıya ait bir JWT token oluşturur.
 *
 * @param user Kullanıcı bilgileri (id ve email)
 * @returns Oluşturulan JWT token
 * @example const token = await createToken({ id: "123", email: "user@example.com" });
 * @async true
 */
export async function createToken(user: {
  id: string;
  email: string;
  permission: string;
}): Promise<string> {
  // JWT payload (içerik)
  const payload = {
    sub: user.id,
    email: user.email,
    permission: user.permission,
  };

  // Token'ı oluşturma (expiresIn: 7 gün)
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

  return token;
}

/**
 * Kullanıcı giriş yaptıktan sonra JWT token'ı tarayıcıya kaydeder.
 *
 * @param user Kullanıcı bilgileri (id ve email)
 * @returns Oluşturulan token
 * @example await loginUser({ id: "123", email: "user@example.com" });
 * @async true
 */
export async function loginUser(user: {
  id: string;
  email: string;
  permission: string;
}) {
  const token = await createToken(user);
  const cookieStore = cookies();

  // Cookie'yi kalıcı olarak kaydet (30 gün)
  cookieStore.set("session-token", token, {
    path: "/",
    httpOnly: true,
    secure: false,
    maxAge: 2592000, // 30 gün
  });

  return token;
}

/**
 * Belirtilen JWT token'ı doğrular ve payload bilgilerini döner.
 *
 * @param token JWT token
 * @returns Token geçerli ise JWT payload, geçersiz ise null
 * @example const userData = await verifyToken("your-jwt-token");
 * @async true
 */
export async function verifyToken(
  token: string
): Promise<JwtPayload | string | null> {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (NodeEnv === "development") console.error("Invalid token:", error);
    return null;
  }
}

/**
 * Kullanıcı çıkışı yaparak tarayıcıdaki token cookie'sini siler.
 *
 * @example await logoutUser();
 * @async true
 */
export async function logoutUser() {
  const cookieStore = cookies();

  cookieStore.delete("session-token");
}
