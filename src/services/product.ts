import axios, { AxiosResponse } from "axios";

//? Tanımlar tek bir dosyaya taşınabilir.
interface Product {
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

const apiUrl = `https://www.gonenkleopatra.com/api_kleopatra/product`; // Gerçek URL'nizle değiştirin

const addProduct = async (productData: FormData): Promise<boolean> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await axios.post(
      `${apiUrl}/add.php`,
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
};

const removeProduct = async (productData: any): Promise<boolean> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await axios.post(
      `${apiUrl}/remove.php`,
      productData
    );
    return response.data.success ? true : false;
  } catch (error) {
    console.error("Ürün kaldırma hatası:", error);
    return false;
  }
};

const fallingOutofStock = async (body: any): Promise<boolean> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await axios.post(
      `${apiUrl}/out_of_stock.php`,
      body
    );
    return response.data.success ? true : false;
  } catch (error) {
    console.error("Stok hatası:", error);
    return false;
  }
};

const getProduct = async (data: any): Promise<any | null> => {
  const url = `https://www.gonenkleopatra.com/api_kleopatra/product/get.php`;
  try {
    const response: AxiosResponse<ApiResponse<any>> = await axios.post(
      url,
      data
    );
    console.log(response);
    if (response.data.success) {
      return response.data.data !== null ? response.data.data : null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Ürün getirme hatası:", error);
    return null;
  }
};

const fetchFeaturedProducts = async (): Promise<Product[] | null> => {
  try {
    const response: AxiosResponse<ApiResponse<Product[]>> = await axios.post(
      `${apiUrl}/featured_get.php`
    );
    if (response.data.success && response.data.data) {
      const updatedProducts: Product[] = response.data.data.map((element) => ({
        id: element.id,
        name: element.name,
        description: element.description,
        price: element.price,
        stock: element.stock,
        image: element.image,
      }));
      return updatedProducts;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Featured hatası:", error);
    return null;
  }
};

const fetchAllProduct = async (): Promise<Product[] | null> => {
  try {
    const response: AxiosResponse<ApiResponse<Product[]>> = await axios.post(
      `${apiUrl}/all_get.php`
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
};

const fetchAllProducts = async (): Promise<Product[] | null> => {
  try {
    const response: AxiosResponse<ApiResponse<Product[]>> = await axios.post(
      `${apiUrl}/all_gets.php`
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
};

const ProductManager = {
  addProduct,
  removeProduct,
  fallingOutofStock,
  getProduct,
  fetchFeaturedProducts,
  fetchAllProduct,
  fetchAllProducts,
};

export default ProductManager;
