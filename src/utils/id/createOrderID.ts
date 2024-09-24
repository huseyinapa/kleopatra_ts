// utils/createOrderID.ts

import axios, { AxiosResponse } from "axios";

const characters = "0123456789";

export const fetchOrdersId = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<any> = await axios.get(
      "http://3.124.99.216/api_kleopatra/order/getid.php"
    );
    return response.data.success ? response.data.orderIDS : [];
  } catch (error) {
    console.error("Error fetching ids:", error);
    return [];
  }
};

export const fetchOrderItemsId = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<any> = await axios.get(
      "http://3.124.99.216/api_kleopatra/new_order/items/getid.php"
    );
    return response.data.success ? response.data.orderItemsId : [];
  } catch (error) {
    console.error("Error fetching ids:", error);
    return [];
  }
};

export const fetchOrderCustomersId = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<any> = await axios.get(
      "http://3.124.99.216/api_kleopatra/new_order/customer/getid.php"
    );
    return response.data.success ? response.data.orderIDS : [];
  } catch (error) {
    console.error("Error fetching ids:", error);
    return [];
  }
};

export const generateOrderUId = async (): Promise<string> => {
  const allIds = await fetchOrdersId();
  let newId = "";

  do {
    newId = "";
    for (let i = 0; i < 3; i++) {
      newId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  } while (allIds.includes(newId));

  return newId;
};

export const generateOrderItemUId = async (): Promise<string> => {
  const allIds = await fetchOrderItemsId();
  let newId = "";

  do {
    newId = "";
    for (let i = 0; i < 3; i++) {
      newId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  } while (allIds.includes(newId));

  return newId;
};

export const generateOrderCustomerUId = async (): Promise<string> => {
  const allIds = await fetchOrderCustomersId();
  let newId = "";

  do {
    newId = "";
    for (let i = 0; i < 3; i++) {
      newId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  } while (allIds.includes(newId));

  return newId;
};

export const orderId = async (): Promise<string> => {
  const newIdentifier = await generateOrderUId();
  return `KLEO-${newIdentifier}`;
};

export const orderItemsId = async (): Promise<string> => {
  const newIdentifier = await generateOrderItemUId();
  return `KPROD-${newIdentifier}`;
};

export const orderCustomerId = async (): Promise<string> => {
  const newIdentifier = await generateOrderCustomerUId();
  return `KCUST-${newIdentifier}`;
};
