import { NewOrder } from "@/types/order";
import api_url from "@/utils/api";
import axios, { AxiosResponse } from "axios";

// Define interfaces for API responses if possible
interface ApiResponse<T> {
  success: boolean;
  orders?: T | null;
  orderId?: string;
  message?: string;
}

const NewOrderManager = {
  add: async (data: FormData): Promise<string | null> => {
    try {
      const response: AxiosResponse<ApiResponse<string>> = await axios.post(
        `${api_url}/api_kleopatra/new_order/add.php`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      return response.data.orderId || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  addItems: async (data: FormData): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<boolean>> = await axios.post(
        `${api_url}/api_kleopatra/new_order/items/add.php`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.success;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  addCustomers: async (data: FormData): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<boolean>> = await axios.post(
        `${api_url}/api_kleopatra/new_order/customer/add.php`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.success;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // getOrder: async (data: FormData): Promise<any> => {
  //   const url = `https://www.gonenkleopatra.com/api_kleopatra/new_order/get.php`;

  //   try {
  //     const response: AxiosResponse<ApiResponse<any>> = await axios.post(
  //       url,
  //       data
  //     );
  //     if (response.data.success) {
  //       if (response.data.orders !== null) {
  //         return response.data.orders;
  //       } else {
  //         throw new Error("No orders found");
  //       }
  //     } else {
  //       throw new Error("Request failed");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // },

  fetchOrders: async (): Promise<NewOrder> => {
    try {
      const response: AxiosResponse<ApiResponse<NewOrder>> = await axios.get(
        `${api_url}/api_kleopatra/new_order/get_all.php`
      );
      if (response.data.success && Array.isArray(response.data.orders)) {
        if (response.data.orders !== null) {
          return response.data.orders;
        } else {
          throw new Error("No orders found");
        }
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default NewOrderManager;
