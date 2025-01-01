"use server";

import { CookiePayload } from "@/types/cookie";
import { NODE_ENV } from "@/utils/api";
/* eslint-disable @typescript-eslint/no-unused-vars */
import axiosInstance from "@/utils/axiosConfig";
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
      if (NODE_ENV === "development")
        console.error("Axios Error:", error.response?.data || error.message);
    } else {
      if (NODE_ENV === "development") console.error("Unexpected Error:", error);
    }
    throw error; // Hatanın üst katmana iletilmesini sağlar
  }
}
