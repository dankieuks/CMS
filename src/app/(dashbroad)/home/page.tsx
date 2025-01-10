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
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
    { id: 3, name: "Bathroom Essentials", popularity: 18, sales: "18%" },
    { id: 4, name: "Apple Smartwatches", popularity: 25, sales: "25%" },
  ];

  const salesData = [
    { name: "Home Decor", value: 45 },
    { name: "Disney Bag", value: 29 },
    { name: "Bathroom Essentials", value: 18 },
    { name: "Smartwatches", value: 25 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const handleCheckToken = () => {
    const token = auth?.accessToken;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Token Decoded:", decoded);
      } catch (error) {
        console.error("Invalid Token:", error);
      }
    } else {
      console.log("Token not found.");
    }
  };

  return (
    <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Sales Summary */}
      <div className="col-span-1 lg:col-span-2 bg-gradient-to-r from-blue-300 to-purple-400 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Today's Sales</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            {
              icon: <AiOutlineBarChart />,
              label: "Total Sales",
              value: products.length,
            },
            {
              icon: <AiOutlineOrderedList />,
              label: "Total Orders",
              value: "$1k",
            },
            {
              icon: <AiFillTags />,
              label: "Stock",
              value: "$1k",
            },
            {
              icon: <AiOutlineUserAdd />,
              label: "New Customer",
              value: "$1k",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-y-4 bg-white text-black rounded-lg shadow-md p-4"
            >
              <div className="text-3xl text-purple-500">{item.icon}</div>
              <h1 className="text-center font-medium">
                {item.label}: <strong>{item.value}</strong>
              </h1>
            </div>
          ))}
        </div>
      </div>
      {/* Top Products */}
      <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-5">Top Products</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Popularity</th>
              <th className="py-2 px-3">Sales</th>
            </tr>
          </thead>
          <tbody>
            {product.map((product, index) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-3">{index + 1}</td>
                <td className="py-3 px-3 font-medium text-gray-700">
                  {product.name}
                </td>
                <td className="py-3 px-3">
                  <div className="relative w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className={`absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full`}
                      style={{ width: `${product.popularity}%` }}
                    ></div>
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-600">{product.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pie Chart */}
      <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Sales Distribution
        </h2>
        <div className="flex justify-center items-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={5}
              >
                {salesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#ffffff"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Orders */}
      <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Orders</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-600 text-sm uppercase tracking-wider">
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Total Amount</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className="hover:bg-gray-100 transition-colors border-b last:border-none"
              >
                <td className="py-3 px-4 text-gray-700">{index + 1}</td>
                <td className="py-3 px-4 text-gray-700 font-medium">
                  {order.userId}
                </td>

                <td className="py-3 px-4 text-gray-700 font-bold">
                  {order.totalAmount.toString()} VND
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block py-1 px-3 rounded-full text-xs font-semibold text-white ${
                      order.status === "Completed"
                        ? "bg-green-500"
                        : order.status === "Pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
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
