"use client";
import {
  AiOutlineBarChart,
  AiOutlineOrderedList,
  AiFillTags,
  AiOutlineUserAdd,
} from "react-icons/ai";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { productState } from "@/shared/store/Atoms/product";
import { useGetProduct } from "@/shared/hooks/product";

const page = () => {
  const { getProduct } = useGetProduct();
  const [products, setProducts] = useRecoilState(productState);

  const getProducts = async () => {
    const data = await getProduct();
    setProducts(data);
  };

  useEffect(() => {
    getProducts();
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

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Today's Sales</h2>
        <div className="flex justify-between gap-4 text-lg">
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
              className={`h-full w-full flex flex-col gap-y-4 ${item.background} rounded-lg py-5 justify-center items-center`}
            >
              <div
                className={`${item.color} text-white rounded-3xl text-4xl p-1`}
              >
                {item.icon}
              </div>
              <h1>
                {item.label}: <strong>{item.value}</strong>
              </h1>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
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
    </div>
  );
};

export default page;
