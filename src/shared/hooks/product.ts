"use client";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { productState } from "../store/Atoms/product";
import { Product } from "../types/product";
import axios from "axios";

export const useGetProduct = () => {
  const [product, setProducts] = useRecoilState(productState);
  const getProduct = async (): Promise<Product[]> => {
    try {
      const respone = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product`
      );
      return respone.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Lỗi khi lấy san pham:", error.message);
        console.error("Chi tiết lỗi từ server:", error.response);
      } else {
        console.error("Lỗi không mong đợi:", error);
      }
      return [];
    }
  };
  return { getProduct, setProducts };
};
export const useAddProduct = () => {
  const setProducts = useSetRecoilState(productState);

  const addProduct = async (newProduct: Product) => {
    const formData = new FormData();

    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price.toString());
    formData.append("description", newProduct.description);
    formData.append("brand", newProduct.brand);
    if (newProduct.image) {
      formData.append("image", newProduct.image);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/product`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setProducts((prevProducts) => [...prevProducts, response.data]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error adding user:", error.message);
        console.error("Response:", error.response);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return { addProduct };
};

export const useUpdateProduct = () => {
  const setProducts = useSetRecoilState(productState);

  const updateProduct = async (updatedProduct: Product) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${updatedProduct.id}`,
        {
          name: updatedProduct.name,
          price: updatedProduct.price,
          description: updatedProduct.description,
          image: updatedProduct.image,
          brand: updatedProduct.brand,
        }
      );
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProduct.id ? response.data : product
        )
      );
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return { updateProduct };
};
export const useDeleteProduct = () => {
  const setProducts = useSetRecoilState(productState);
  const deleteProduct = async (id: string) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`
      );
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    } catch (error) {}
  };
  return { deleteProduct };
};
