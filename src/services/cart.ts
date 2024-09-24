// utils/cart.ts

import axios, { AxiosResponse } from "axios";

const apiUrl = `http://3.124.99.216/api_kleopatra/cart`;

const CartManager = {
  addProductToCart: async (productData: FormData): Promise<boolean> => {
    try {
      const response: AxiosResponse<any> = await axios.post(
        `${apiUrl}/add.php`,
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
        `${apiUrl}/get.php`,
        data
      );
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error("Bir hata oluştu.");
      return null;
    }
  },

  getProductsInCart: async (data: any): Promise<any | null> => {
    try {
      const response: AxiosResponse<any> = await axios.post(
        `${apiUrl}/all_get.php`,
        data
      );
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error("Bir hata oluştu.");
      return null;
    }
  },

  fetchCart: async (formData: FormData): Promise<any | null> => {
    try {
      const response: AxiosResponse<any> = await axios.post(
        `${apiUrl}/all_get.php`,
        formData
      );
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error("Bir hata oluştu.");
      return null;
    }
  },

  removeProductFromCart: async (productData: FormData): Promise<boolean> => {
    try {
      const response: AxiosResponse<any> = await axios.post(
        `${apiUrl}/remove.php`,
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
