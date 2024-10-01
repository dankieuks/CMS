"use client";
import { AiOutlineBarChart } from "react-icons/ai";
import { AiOutlineOrderedList } from "react-icons/ai";
import { AiFillTags } from "react-icons/ai";
import { AiOutlineUserAdd } from "react-icons/ai";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const page = () => {
  const salesData = [
    { name: "Mon", online: 10, offline: 20 },
    { name: "Tue", online: 15, offline: 25 },
    { name: "Wed", online: 12, offline: 30 },
    { name: "Thu", online: 18, offline: 22 },
    { name: "Fri", online: 14, offline: 28 },
    { name: "Sat", online: 20, offline: 35 },
    { name: "Sun", online: 25, offline: 40 },
  ];

  const products = [
    {
      id: 1,
      name: "Home Decor Range",
      popularity: 45,
      sales: "45%",
    },
    {
      id: 2,
      name: "Disney Princess Pink Bag 18'",
      popularity: 29,
      sales: "29%",
    },
    {
      id: 3,
      name: "Bathroom Essentials",
      popularity: 18,
      sales: "1.8%",
    },
    {
      id: 4,
      name: "Apple Smartwatches",
      popularity: 25,
      sales: "25%",
    },
  ];
  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Today's Sales</h2>
        <div className="flex justify-between gap-4  text-lg">
          <div className="h-full w-full flex flex-col gap-y-4 bg-red-200 rounded-lg py-5 justify-center items-center ">
            <AiOutlineBarChart className="bg-red-400 text-white rounded-3xl text-4xl p-1" />
            <h1>
              Total Sales: <strong>$1k</strong>
            </h1>
          </div>
          <div className="h-full w-full  flex flex-col gap-y-4 bg-green-200 rounded-lg py-5 justify-center items-center">
            <AiOutlineOrderedList className="bg-green-400 text-white rounded-3xl text-4xl p-1" />

            <p>
              Total Orders:<strong>$1k </strong>
            </p>
          </div>
          <div className="h-full w-full  flex flex-col gap-y-4 bg-blue-200 rounded-lg py-5 justify-center items-center">
            <AiFillTags className="bg-blue-400 text-white rounded-3xl text-4xl p-1" />
            <p>
              Stock:<strong>$1k </strong>
            </p>
          </div>
          <div className="h-full w-full  flex flex-col gap-y-4 bg-violet-200 rounded-lg py-5 justify-center items-center">
            <AiOutlineUserAdd className="bg-violet-400 text-white rounded-3xl text-4xl p-1" />
            <p>
              New Customer:<strong>$1k </strong>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Total Revenue</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="online" fill="#8884d8" />
            <Bar dataKey="offline" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full max-w-4xl mx-auto bg-white p-5 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-5">Top Products</h2>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="text-left py-2">#</th>
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Popularity</th>
              <th className="text-left py-2">Sales</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
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
    </div>
  );
};

export default page;
