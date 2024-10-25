// utils/user.ts

import api_url from "@/utils/api";
import axios, { AxiosResponse } from "axios";

// API response interface
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// User data interface - burada kullanıcıya ait bilgileri tanımlayabilirsin
interface UserData {
  email: string;
  password: string;
  id?: string;
  permission?: number;
  last_login?: string;
}

const User = {
  /**
   * Kullanıcı kayıt fonksiyonu
   * @param userData Kullanıcı bilgileri
   * @returns API yanıtı
   */
  register: async (
    userData: FormData
  ): Promise<ApiResponse<UserData> | null> => {
    try {
      const response: AxiosResponse<ApiResponse<UserData>> = await axios.post(
        `${api_url}/api_kleopatra/user/register.php`,
        userData
      );

      if (response.data.success) {
        return response.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  /**
   * Kullanıcı giriş fonksiyonu
   * @param userData Kullanıcı giriş bilgileri
   * @returns API yanıtı
   */
  login: async (userData: FormData): Promise<ApiResponse<UserData> | null> => {
    try {
      const response: AxiosResponse<ApiResponse<UserData>> = await axios.post(
        `${api_url}/api_kleopatra/user/login.php`,
        userData
      );

      if (response.data.success) {
        return response.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Kullanıcıyı API üzerinden almak için fonksiyon
   * @param email Kullanıcı email adresi
   * @returns Kullanıcı bilgileri
   * @since v1.1.0
   * @author Hüseyin
   * @example const user = await User.get("[email]");
   */
  get: async (email: string): Promise<UserData | null> => {
    try {
      const response: AxiosResponse<ApiResponse<UserData>> = await axios.get(
        `${api_url}/api_kleopatra/user/get.php?email=${email}`
      );

      if (response.data.success) {
        return response.data.data as UserData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Get User error:", error);
      return null;
    }
  },
};

export default User;
