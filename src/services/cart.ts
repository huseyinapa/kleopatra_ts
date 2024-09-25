// utils/cart.ts

import api_url from "@/utils/api";
import axios, { AxiosResponse } from "axios";

const apiUrl = `${api_url}/api_kleopatra/cart`;

const CartManager = {
  addProductToCart: async (productData: FormData): Promise<boolean> => {
    try {
      const response: AxiosResponse<any> = await axios.post(
        `${api_url}/api_kleopatra/cart/add.php`,
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data;",
          },
        }
      );
      return response.data.success;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  getProductInCart: async (data: any): Promise<any | null> => {
    try {
      const response: AxiosResponse<any> = await axios.post(
        `${api_url}/api_kleopatra/cart/get.php`,
        data
      );
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  getProductsInCart: async (data: any): Promise<any | null> => {
    try {
      const response: AxiosResponse<any> = await axios.post(
        `${api_url}/api_kleopatra/cart/all_get.php`,
        data
      );
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  fetchCart: async (formData: FormData): Promise<any | null> => {
    try {
      const response: AxiosResponse<any> = await axios.post(
        `${api_url}/api_kleopatra/cart/all_get.php`,
        formData
      );
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  removeProductFromCart: async (productData: FormData): Promise<boolean> => {
    try {
      const response: AxiosResponse<any> = await axios.post(
        `${api_url}/api_kleopatra/cart/remove.php`,
        productData
      );
      return response.data.success;
    } catch (error) {
      console.log("Ürün kaldırma hatası:", error);
      return false;
    }
  },
};

export default CartManager;
