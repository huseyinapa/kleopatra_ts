// utils/createId.ts

import axios, { AxiosResponse } from "axios";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const fetchAllIds = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<any> = await axios.get(
      "http://3.124.99.216/api_kleopatra/user/getID.php"
    );
    return response.data.success ? response.data.userIDS : [];
  } catch (error) {
    console.error("Error fetching ids:", error);
    return [];
  }
};

export const generateUniqueId = async (): Promise<string> => {
  const allIds = await fetchAllIds();

  let newId = "";
  do {
    newId = "";
    for (let i = 0; i < 3; i++) {
      newId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  } while (allIds.includes(newId));

  return newId;
};

export const userIdentifier = async (): Promise<string> => {
  return await generateUniqueId();
};

export const productIdentifier = async (): Promise<string> => {
  return `P-${await generateUniqueId()}`;
};
