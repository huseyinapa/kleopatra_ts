// utils/orderManager.ts

import axios, { AxiosResponse } from "axios";

interface ApiResponse<T> {
  success: boolean;
  orders?: T;
  data?: T;
  message?: string;
}

interface OrderData {
  // Sipariş verilerinizin yapısını burada tanımlayın
  // Örneğin:
  // productId: number;
  // quantity: number;
  // userId: number;
  // vb.
}

interface Order {
  // Sipariş nesnesinin yapısını burada tanımlayın
  // Örneğin:
  // id: number;
  // status: string;
  // items: OrderItem[];
  // vb.
}

const apiUrl = `http://3.124.99.216/api_kleopatra/order`;
const secureApiUrl = `https://www.gonenkleopatra.com/api_kleopatra/order`;

/**
 * Sipariş eklemek için kullanılan fonksiyon.
 * @param data Sipariş verilerini içeren FormData nesnesi.
 * @returns Sipariş ekleme işleminin başarılı olup olmadığını belirten boolean değeri.
 */
export const addOrder = async (data: FormData): Promise<boolean> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await axios.post(
      `${apiUrl}/add.php`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data;",
        },
      }
    );
    // console.log("addOrder:", response.data);
    return response.data.success;
  } catch (error) {
    console.error("Sipariş ekleme hatası:", error);
    return false;
  }
};

/**
 * Belirli bir siparişi almak için kullanılan fonksiyon.
 * @param data Siparişle ilgili veri (örneğin sipariş ID'si).
 * @returns Sipariş bilgilerini veya null değerini döndürür.
 */
export const getOrder = async (data: OrderData): Promise<Order | null> => {
  const url = `${secureApiUrl}/get.php`;

  try {
    const response: AxiosResponse<ApiResponse<Order>> = await axios.post(url, data);

    if (response.data.success && response.data.orders !== null) {
      return response.data.orders;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Sipariş alma hatası:", error);
    throw new Error("Bir hata oluştu.");
  }
};

/**
 * Tüm siparişleri almak için kullanılan fonksiyon.
 * @returns Siparişlerin bulunduğu bir dizi veya null değerini döndürür.
 */
export const fetchOrders = async (): Promise<Order[] | null> => {
  try {
    const response: AxiosResponse<ApiResponse<Order[]>> = await axios.get(
      `${apiUrl}/all_get.php`
    );

    if (response.data.success && response.data.orders !== null) {
      return response.data.orders;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Tüm siparişleri çekme hatası:", error);
    return null;
  }
};

/**
 * Siparişi onaylamak için kullanılan fonksiyon.
 * @param data Siparişle ilgili veri (örneğin sipariş ID'si).
 * @returns Sipariş onaylama işleminin başarılı olup olmadığını belirten boolean değeri.
 */
export const confirmOrder = async (data: OrderData): Promise<boolean> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await axios.post(
      `${apiUrl}/confirm.php`,
      data
    );
    // console.log(response.data);
    return response.data.success;
  } catch (error) {
    console.error("Sipariş onaylama hatası:", error);
    return false;
  }
};

/**
 * Siparişi kargolamak için kullanılan fonksiyon.
 * @param data Siparişle ilgili veri (örneğin sipariş ID'si).
 * @returns Kargolama işleminin başarılı olup olmadığını belirten boolean değeri.
 */
export const shipIt = async (data: OrderData): Promise<boolean> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await axios.post(
      `${apiUrl}/ship.php`,
      data
    );
    // console.log(response.data);
    return response.data.success;
  } catch (error) {
    console.error("Kargolama hatası:", error);
    return false;
  }
};

/**
 * Siparişi iptal etmek için kullanılan fonksiyon.
 * @param data Siparişle ilgili veri (örneğin sipariş ID'si).
 * @returns Sipariş iptal etme işleminin başarılı olup olmadığını belirten boolean değeri.
 */
export const cancelOrder = async (data: OrderData): Promise<boolean> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await axios.post(
      `${apiUrl}/cancel.php`,
      data
    );
    // console.log(response.data);
    return response.data.success;
  } catch (error) {
    console.error("Sipariş iptal etme hatası:", error);
    return false;
  }
};
