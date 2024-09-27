// utils/axiosConfig.ts
import axios from "axios";
import axiosRetry from "axios-retry";

// Axios instance oluştur
const axiosInstance = axios.create();

// Retry ayarlarını yap
axiosRetry(axiosInstance, {
  retries: 3, // Maksimum tekrar deneme sayısı
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Her tekrar denemesi arasında bekleme süresi (ms)
  },
  retryCondition: (error) => {
    // Retry yapma koşulları
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.response?.status === 500
    );
  },
});

export default axiosInstance;
