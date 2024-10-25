import { NewOrder, OrderCustomer, OrderItem } from "@/types/order";
import api_url from "@/utils/api";
import axios, { AxiosResponse } from "axios";

// Define interfaces for API responses if possible
interface ApiResponse<T> {
  success: boolean;
  orders?: T | null;
  items?: T | null;
  data?: T | null;
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
      // console.log(response.data);
      return response.data.success ? response.data.orderId || null : null;
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
      // console.log("addCustomers", response.data);
      return response.data.success;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getOrder: async (data: FormData): Promise<NewOrder | null> => {
    const url = `${api_url}/api_kleopatra/new_order/get.php`;

    try {
      const response: AxiosResponse<ApiResponse<NewOrder>> = await axios.post(
        url,
        data
      );

      if (response.data.success) {
        if (response.data.orders !== null) {
          return response.data.orders || null;
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

  retrieveCustomerOrders: async (
    customerId: string,
    includeArchived: boolean = false
  ): Promise<NewOrder[] | null> => {
    const getOrderForm = new FormData();
    getOrderForm.append("customerId", customerId);
    getOrderForm.append("includeArchived", includeArchived.toString());

    try {
      const response: AxiosResponse<ApiResponse<NewOrder[]>> = await axios.post(
        `${api_url}/api_kleopatra/new_order/get_customer_orders.php`,
        getOrderForm
      );

      if (response.data.success && response.data.orders) {
        return response.data.orders;
      }
      return null;
    } catch (error) {
      console.error("Error retrieving customer orders: ", error);
      throw error;
    }
  },

  retrieveOrderItems: async (orderId: string): Promise<OrderItem[] | null> => {
    try {
      const response: AxiosResponse<ApiResponse<OrderItem[]>> = await axios.get(
        `${api_url}/api_kleopatra/new_order/items/get.php?orderId=${orderId}`
      );

      if (response.data.success && response.data.items) {
        return response.data.items;
      }
      return null;
    } catch (error) {
      console.error("Error retrieving customer orders: ", error);
      throw error;
    }
  },

  retrieveOrderCustomer: async (
    orderId: string
  ): Promise<OrderCustomer | null> => {
    try {
      const response: AxiosResponse<ApiResponse<OrderCustomer>> =
        await axios.get(
          `${api_url}/api_kleopatra/new_order/customer/get.php?orderId=${orderId}`
        );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("Error retrieving customer orders: ", error);
      throw error;
    }
  },

  fetchOrders: async (): Promise<NewOrder[] | null> => {
    try {
      const response: AxiosResponse<ApiResponse<NewOrder[] | null>> =
        await axios.get(`${api_url}/api_kleopatra/new_order/get_all.php`);

      if (response.data.success && Array.isArray(response.data.orders)) {
        if (response.data.orders !== null) {
          return response.data.orders;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  cancelOrder: async (data: FormData): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<boolean>> = await axios.post(
        `${api_url}/api_kleopatra/new_order/cancel.php`,
        data
      );
      return response.data.success;
    } catch (error) {
      console.error("Sipariş iptal etme hatası:", error);
      return false;
    }
  },

  updateOrderStatus: async (
    orderId: string,
    status: string
  ): Promise<string | null> => {
    try {
      const data = new FormData();
      data.append("orderId", orderId);
      data.append("status", status);
      const response: AxiosResponse<ApiResponse<string>> = await axios.post(
        `${api_url}/api_kleopatra/new_order/update_status.php`,
        data
      );

      // console.log(response);

      if (response.data.success) {
        return response.data.message || null;
      } else {
        console.error("Sipariş durumu güncellenemedi.");
        return null;
      }
    } catch (error) {
      console.log("error:", error);
      return null;
    }
  },
};

export default NewOrderManager;
