import { NewOrder, OrderCustomer, OrderItem } from "@/types/order";
import { api_url } from "@/utils/api";
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
  /**
   * Yeni bir sipariş ekler.
   * @param data
   * @returns
   */
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
      return response.data.success ? response.data.orderId || null : null;
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
      return null;
    }
  },

  /**
   * Sipariş öğelerini ekler.
   * @param data
   * @returns
   */
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
      if (process.env.NODE_ENV === "development") console.error(error);
      throw error;
    }
  },

  /**
   * Siparişi oluşturan müşteriyi ekler.
   * @param data
   * @returns
   */
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
      if (process.env.NODE_ENV === "development") console.error(error);
      throw error;
    }
  },

  /**
   * Tüm siparişleri getirir.
   * @param data
   * @returns
   */
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
      if (process.env.NODE_ENV === "development") console.error(error);
      throw error;
    }
  },

  /**
   * Müşteri siparişlerini getirir.
   * @param customerId
   * @param includeArchived
   * @returns
   */
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
      if (process.env.NODE_ENV === "development")
        console.error("Error retrieving customer orders: ", error);
      throw error;
    }
  },

  /**
   * Siparişin öğelerini getirir.
   * @param orderId
   * @returns
   */
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
      if (process.env.NODE_ENV === "development")
        console.error("Error retrieving customer orders: ", error);
      throw error;
    }
  },

  /**
   * Siparişin müşterisini getirir.
   * @param orderId
   * @returns
   */
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
      if (process.env.NODE_ENV === "development")
        console.error("Error retrieving customer orders: ", error);
      throw error;
    }
  },

  /**
   * Tüm siparişleri getirir.
   * @returns
   */
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
      if (process.env.NODE_ENV === "development") console.error(error);
      return null;
    }
  },

  /**
   * Siparişi iptal eder.
   * @param data
   * @returns
   */
  cancelOrder: async (data: FormData): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<boolean>> = await axios.post(
        `${api_url}/api_kleopatra/new_order/cancel.php`,
        data
      );
      return response.data.success;
    } catch (error) {
      if (process.env.NODE_ENV === "development")
        console.error("Sipariş iptal etme hatası:", error);
      return false;
    }
  },

  /**
   * Sipariş durumunu günceller.
   * @param orderId
   * @param status
   * @returns
   */
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

      if (response.data.success) {
        return response.data.message || null;
      } else {
        console.error("Sipariş durumu güncellenemedi.");
        return null;
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.log("error:", error);
      return null;
    }
  },

  /**
   * Siparişi yumuşak siler.
   * @param orderId
   * @returns
   */
  //! Soft delete yapacağız. PHP dosyasını da güncellemek gerekecek.
  deleteOrder: async (orderId: string): Promise<boolean> => {
    try {
      const data = new FormData();
      data.append("orderId", orderId);
      const response: AxiosResponse<ApiResponse<boolean>> = await axios.post(
        `${api_url}/api_kleopatra/new_order/delete.php`,
        data
      );

      return response.data.success;
    } catch (error) {
      if (process.env.NODE_ENV === "development")
        console.error("Sipariş silme hatası:", error);
      return false;
    }
  },

  /**
   * Siparişin öğelerini siler.
   * @param orderId
   * @returns
   */
  deleteOrderItems: async (orderId: string): Promise<boolean> => {
    try {
      const data = new FormData();
      data.append("orderId", orderId);

      const response: AxiosResponse<ApiResponse<boolean>> = await axios.post(
        `${api_url}/api_kleopatra/new_order/items/delete.php`,
        data
      );

      return response.data.success;
    } catch (error) {
      if (process.env.NODE_ENV === "development")
        console.error("Sipariş öğelerini silme hatası:", error);
      return false;
    }
  },

  /**
   * Siparişin müşterisini siler.
   * @param orderId
   * @returns
   */
  deleteOrderCustomer: async (orderId: string): Promise<boolean> => {
    try {
      const data = new FormData();
      data.append("orderId", orderId);
      const response: AxiosResponse<ApiResponse<boolean>> = await axios.post(
        `${api_url}/api_kleopatra/new_order/customer/delete.php`,
        data
      );

      return response.data.success;
    } catch (error) {
      if (process.env.NODE_ENV === "development")
        console.error("Sipariş müşterisini silme hatası:", error);
      return false;
    }
  },
};

export default NewOrderManager;
