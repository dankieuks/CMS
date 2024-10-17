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
        console.error("Lỗi khi lấy người dùng:", error.message);
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
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/product`,
        newProduct
      );

      setProducts((prevProducts) => [...prevProducts, response.data]);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return { addProduct };
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
