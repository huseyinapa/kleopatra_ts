"use server";

import { CookiePayload } from "@/types/cookie";
import { NodeEnv } from "@/utils/api";
import axios from "axios";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function getCookie(): Promise<CookiePayload | null> {
  const secret = process.env.JWT_SECRET;

  try {
    const token = cookies().get("session-token")?.value;

    if (!token) {
      console.warn("Token boş!");
      return null;
    }

    const { payload }: { payload: CookiePayload } = await jwtVerify(
      token!,
      new TextEncoder().encode(secret)
    );
    return payload;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (NodeEnv === "development")
        console.error("Axios Error:", error.response?.data || error.message);
    } else {
      if (NodeEnv === "development") console.error("Unexpected Error:", error);
    }
    throw error; // Hatanın üst katmana iletilmesini sağlar
  }
}
