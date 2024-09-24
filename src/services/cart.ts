// utils/cart.ts

import axios, { AxiosResponse } from "axios";

const apiUrl = `http://3.124.99.216/api_kleopatra/cart`;

export const addProductToCart = async (
  productData: FormData
): Promise<boolean> => {
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
};

export const getProductInCart = async (data: any): Promise<any | null> => {
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
};

export const getProductsInCart = async (data: any): Promise<any | null> => {
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
};

export const fetchCart = async (formData: FormData): Promise<any | null> => {
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
};

export const removeProductFromCart = async (
  productData: FormData
): Promise<boolean> => {
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${apiUrl}/remove.php`,
      productData
    );
    return response.data.success;
  } catch (error) {
    console.error("Ürün kaldırma hatası:", error);
    return false;
  }
};

const CartManager = {
  addProductToCart,
  getProductInCart,
  getProductsInCart,
  fetchCart,
  removeProductFromCart,
};

export default CartManager;
