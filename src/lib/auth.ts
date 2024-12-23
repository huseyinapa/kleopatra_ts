import { CookieUser } from "@/types/cookie";
import axios from "axios";
import { jwtVerify } from "jose";

export async function getUserFromSessionToken(token: string) {
  const secret = process.env.JWT_SECRET;

  try {
    // const token = cookies().get("session-token")?.value;

    if (!token) {
      console.warn("Token boş!");
      return null;
    }

    const { payload }: { payload: CookieUser } = await jwtVerify(
      token!,
      new TextEncoder().encode(secret)
    );
    return payload;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return null;
  }
}
