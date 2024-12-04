// hooks/order.ts
import { useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authState } from "../store/Atoms/auth";

export const useGetOrder = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const auth = useRecoilValue(authState);
  const id = auth?.user?.id;
  console.log(id);
  const getOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/order/user/${id}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return { orders, getOrders };
};
