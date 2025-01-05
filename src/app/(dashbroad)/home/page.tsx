"use client";
import {
  AiOutlineBarChart,
  AiOutlineOrderedList,
  AiFillTags,
  AiOutlineUserAdd,
} from "react-icons/ai";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { productState } from "@/shared/store/Atoms/product";
import { useGetProduct } from "@/shared/hooks/product";
import { authState } from "@/shared/store/Atoms/auth";
import { Button } from "antd";
import { jwtDecode } from "jwt-decode";
import { useGetOrder } from "@/shared/hooks/order";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
const Page = () => {
  const { getProduct } = useGetProduct();
  const [products, setProducts] = useRecoilState(productState);
  const auth = useRecoilValue(authState);
  const { orders, getOrders } = useGetOrder();

  const getProducts = async () => {
    const data = await getProduct();
    setProducts(data);
  };

  useEffect(() => {
    getProducts();
    getOrders();
  }, []);

  const product = [
    { id: 1, name: "Home Decor Range", popularity: 45, sales: "45%" },
    {
      id: 2,
      name: "Disney Princess Pink Bag 18'",
      popularity: 29,
      sales: "29%",
    },
    { id: 3, name: "Bathroom Essentials", popularity: 18, sales: "1.8%" },
    { id: 4, name: "Apple Smartwatches", popularity: 25, sales: "25%" },
  ];
  const salesData = [
    { name: "Home Decor", value: 45 },
    { name: "Disney Bag", value: 29 },
    { name: "Bathroom Essentials", value: 18 },
    { name: "Smartwatches", value: 25 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  interface DecodedToken {
    exp: number;
    iat?: number;
    sub?: string;
  }
  const handleCheckToken = () => {
    const token = auth?.accessToken;

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);

        const expTime = decoded.exp;
        const currentTime = Math.floor(Date.now() / 1000);

        const timeRemainingMinutes = (expTime - currentTime) / 60;

        console.log("Token đã được giải mã:", decoded);
        console.log("Thời gian hết hạn (exp):", expTime);
        console.log("Thời gian hiện tại:", currentTime);
        console.log("Token còn hiệu lực:", expTime > currentTime);
        console.log(
          "Thời gian hết hạn còn lại:",
          timeRemainingMinutes.toFixed(2),
          "phút"
        );
      } catch (error) {
        console.error("Token không hợp lệ:", error);
      }
    } else {
      console.log("Token không tồn tại.");
    }
    const getElapsedTime = () => {
      const loginTime = parseInt(localStorage.getItem("loginTime") || "0", 10);
      const currentTime = Date.now();
      const elapsedTimeInSeconds = Math.floor((currentTime - loginTime) / 1000);

      const minutes = Math.floor(elapsedTimeInSeconds / 60);
      const seconds = elapsedTimeInSeconds % 60;

      return { minutes, seconds };
    };
    const elapsedTime = getElapsedTime();
    console.log(
      `Đã đăng nhập được ${elapsedTime.minutes} phút ${elapsedTime.seconds} giây`
    );
  };

  return (
    <div className="p-0 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sales Summary */}
      <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Today's Sales</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: <AiOutlineBarChart />,
              color: "bg-red-400",
              background: "bg-red-200",
              label: "Total Sales",
              value: products.length,
            },
            {
              icon: <AiOutlineOrderedList />,
              color: "bg-green-400",
              background: "bg-green-200",
              label: "Total Orders",
              value: "$1k",
            },
            {
              icon: <AiFillTags />,
              color: "bg-blue-400",
              background: "bg-blue-200",
              label: "Stock",
              value: "$1k",
            },
            {
              icon: <AiOutlineUserAdd />,
              color: "bg-violet-400",
              background: "bg-violet-200",
              label: "New Customer",
              value: "$1k",
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`flex flex-col items-center gap-y-4 ${item.background} rounded-lg py-5`}
            >
              <div
                className={`${item.color} text-white rounded-3xl text-4xl p-2`}
              >
                {item.icon}
              </div>
              <h1 className="text-center">
                {item.label}: <strong>{item.value}</strong>
              </h1>
            </div>
          ))}
        </div>
      </div>
      {/* Top Products */}
      <div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-5">Top Products</h2>
        <table className="w-full table-auto text-sm">
          <thead>
            <tr>
              <th className="text-left py-2">#</th>
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Popularity</th>
              <th className="text-left py-2">Sales</th>
            </tr>
          </thead>
          <tbody>
            {product.map((product, index) => (
              <tr key={product.id} className="border-b">
                <td className="py-3">{index + 1}</td>
                <td className="py-3">{product.name}</td>
                <td className="py-3">
                  <div className="relative w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className={`absolute top-0 left-0 h-full ${
                        product.popularity >= 40
                          ? "bg-blue-500"
                          : product.popularity >= 20
                          ? "bg-green-500"
                          : "bg-purple-500"
                      } rounded-full`}
                      style={{ width: `${product.popularity}%` }}
                    ></div>
                  </div>
                </td>
                <td className="py-3">{product.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PieChart width={600} height={400}>
        <Pie
          data={salesData}
          cx="50%"
          cy="50%"
          outerRadius={160}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {salesData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="horizontal" align="center" verticalAlign="bottom" />
      </PieChart>
      ;{/* Orders */}
      <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-5">Orders</h2>
        <table className="w-full table-auto text-sm">
          <thead>
            <tr>
              <th className="text-left py-2">#</th>
              <th className="text-left py-2">Customer</th>
              <th className="text-left py-2">Table</th>
              <th className="text-left py-2">Total Amount</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} className="border-b">
                <td className="py-3">{index + 1}</td>
                <td className="py-3">{order.userId}</td>
                <td className="py-3">{order.table}</td>
                <td className="py-3">${order.totalAmount}</td>
                <td className="py-3">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Buttons */}
      <div className="col-span-1 flex flex-wrap gap-4 justify-center">
        <Button onClick={handleCheckToken}>Check Token</Button>
        <Button onClick={() => getOrders()}>Refresh Orders</Button>
      </div>
    </div>
  );
};

export default Page;
