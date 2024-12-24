// utils/address.api.ts

import axios, { AxiosResponse } from "axios";
import axiosRetry from "axios-retry";

// Şehir ve ilçe için arayüz tanımlamaları
export interface District {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  districts: District[];
}

// API yanıtı için arayüz tanımı
interface ProvinceAPIResponse {
  data: City[];
}

// Axios retry ayarları
axiosRetry(axios, {
  retries: 3, // Deneme sayısı
  retryDelay: (retryCount) => retryCount * 1000, // Her deneme arasında bekleme süresi (ms)
  retryCondition: (error) => {
    // Sadece ağ hatalarında veya 5xx hatalarında tekrar denesin
    return (
      axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error)
    );
  },
});

// AddressAPI fonksiyonu
const AddressAPI = async (): Promise<City[]> => {
  const API_URL = "https://turkiyeapi.herokuapp.com/api/v1/provinces";

  try {
    const response: AxiosResponse<ProvinceAPIResponse> = await axios.get(
      API_URL
    );

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error(
        `API çağrısı başarısız oldu. Durum Kodu: ${response.status}`
      );
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development")
      console.error("Şehir ve ilçe verileri alınırken bir hata oluştu:", error);
    alert("Şehir ve ilçe verileri alınırken bir sorun oluştu.");
    throw new Error("Şehir ve ilçe verileri alınamadı.");
  }
};

export default AddressAPI;
