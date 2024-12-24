import { CartProduct } from "@/types/cart";
import { api_url } from "@/utils/api";
import axios, { AxiosResponse } from "axios";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

const CartManager = {
  addProductToCart: async (productData: FormData): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<CartProduct[]>> =
        await axios.post(`${api_url}/api_kleopatra/cart/add.php`, productData, {
          headers: {
            "Content-Type": "multipart/form-data;",
          },
        });

      return response.data.success;
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.log(error);
      return false;
    }
  },

  getProductInCart: async (data: FormData): Promise<CartProduct | null> => {
    try {
      const response: AxiosResponse<ApiResponse<CartProduct>> =
        await axios.post(`${api_url}/api_kleopatra/cart/get.php`, data);

      return response.data.success ? response.data.data || null : null;
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
      return null;
    }
  },

  getProductsInCart: async (data: FormData): Promise<CartProduct | null> => {
    try {
      const response: AxiosResponse<ApiResponse<CartProduct>> =
        await axios.post(`${api_url}/api_kleopatra/cart/all_get.php`, data);
      return response.data.success ? response.data.data || null : null;
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
      return null;
    }
  },

  fetchCart: async (formData: FormData): Promise<CartProduct[] | null> => {
    try {
      const response: AxiosResponse<ApiResponse<CartProduct[]>> =
        await axios.post(`${api_url}/api_kleopatra/cart/all_get.php`, formData);
      return response.data.success ? response.data.data || null : null;
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
      return null;
    }
  },

  removeProductFromCart: async (productData: FormData): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<CartProduct>> =
        await axios.post(
          `${api_url}/api_kleopatra/cart/remove.php`,
          productData
        );

      return response.data.success;
    } catch (error) {
      if (process.env.NODE_ENV === "development")
        console.error("Ürün kaldırma hatası:", error);
      return false;
    }
  },
};

export default CartManager;
