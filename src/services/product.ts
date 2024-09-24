import api_url from "@/utils/api";
import axios, { AxiosResponse } from "axios";

//? Tanımlar tek bir dosyaya taşınabilir.
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  index?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const ProductManager = {
  addProduct: async (productData: FormData): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await axios.post(
        `${api_url}/add.php`,
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data;",
          },
        }
      );
      return response.data.success ? true : false;
    } catch (error) {
      console.error("Ürün ekleme hatası:", error);
      return false;
    }
  },

  removeProduct: async (productData: any): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await axios.post(
        `${api_url}/remove.php`,
        productData
      );
      return response.data.success ? true : false;
    } catch (error) {
      console.error("Ürün kaldırma hatası:", error);
      return false;
    }
  },

  fallingOutofStock: async (body: any): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await axios.post(
        `${api_url}/out_of_stock.php`,
        body
      );
      return response.data.success ? true : false;
    } catch (error) {
      console.error("Stok hatası:", error);
      return false;
    }
  },

  getProduct: async (data: any): Promise<Product | null> => {
    const url = `${api_url}/api_kleopatra/product/get.php`;
    try {
      const response: AxiosResponse<ApiResponse<Product>> = await axios.post(
        url,
        data
      );

      console.log(response);

      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Ürün getirme hatası:", error);
      return null;
    }
  },

  fetchFeaturedProducts: async (): Promise<Product[] | null> => {
    try {
      const response: AxiosResponse<ApiResponse<Product[]>> = await axios.post(
        `${api_url}/featured_get.php`
      );
      if (response.data.success && response.data.data) {
        const updatedProducts: Product[] = response.data.data.map(
          (element) => ({
            id: element.id,
            name: element.name,
            description: element.description,
            price: element.price,
            stock: element.stock,
            image: element.image,
          })
        );
        return updatedProducts;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Featured hatası:", error);
      return null;
    }
  },

  fetchAllProduct: async (): Promise<Product[] | null> => {
    try {
      const response: AxiosResponse<ApiResponse<Product[]>> = await axios.post(
        `${api_url}/all_get.php`
      );
      console.log(response.data.success);
      if (response.data.success && response.data.data) {
        const updatedProducts: Product[] = response.data.data
          .slice(0, 4)
          .map((element, index) => ({
            id: element.id,
            name: element.name,
            description: element.description,
            price: element.price,
            stock: element.stock,
            image: element.image,
            index: index,
          }));
        return updatedProducts;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Ürün getirme hatası:", error);
      return null;
    }
  },

  fetchAllProducts: async (): Promise<Product[] | null> => {
    try {
      const response: AxiosResponse<ApiResponse<Product[]>> = await axios.post(
        `${api_url}/all_gets.php`
      );
      if (response.data.success && response.data.data) {
        const updatedProducts: Product[] = response.data.data.map(
          (element, index) => ({
            id: element.id.toString(),
            name: element.name,
            description: element.description,
            price: element.price,
            stock: element.stock,
            image: element.image,
            index: index,
          })
        );
        return updatedProducts;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Ürün getirme hatası:", error);
      return null;
    }
  },
};

export default ProductManager;
