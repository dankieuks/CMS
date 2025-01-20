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
import { useGetAllOrder, useGetOrder } from "@/shared/hooks/order";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

interface BestSellProduct {
  productName: string;
  quantity: number;
}
const Page = () => {
  const { getProduct } = useGetProduct();
  const [products, setProducts] = useRecoilState(productState);
  const auth = useRecoilValue(authState);
  const { orders, getAllOrders } = useGetAllOrder();

  const getProducts = async () => {
    const data = await getProduct();
    setProducts(data);
  };

  useEffect(() => {
    getProducts();
    getAllOrders();
  }, []);

  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);
  const employeeSales: { [key: string]: number } = {};
  const productSales: { [key: string]: number } = {};
  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    if (orderDate >= oneMonthAgo && orderDate <= today) {
      order.items.forEach((product: BestSellProduct) => {
        if (productSales[product.productName]) {
          productSales[product.productName] += product.quantity;
        } else {
          productSales[product.productName] = product.quantity;
        }
        const employeeId = order.userId; // Hoặc order.sellerId tùy vào hệ thống của bạn
        if (employeeSales[employeeId]) {
          employeeSales[employeeId] += product.quantity;
        } else {
          employeeSales[employeeId] = product.quantity;
        }
      });
    }
  });
  const sortedEmployees = Object.entries(employeeSales)
    .map(([employeeId, quantity]) => ({ employeeId, quantity }))
    .sort((a, b) => b.quantity - a.quantity);

  const topEmployees = sortedEmployees.slice(0, 5);

  const sortedProducts = Object.entries(productSales)
    .map(([productName, quantity]) => ({ productName, quantity }))
    .sort((a, b) => b.quantity - a.quantity);

  const topSellingProducts = sortedProducts.slice(0, 5);

  const salesData = [
    { name: "Kiều Đình Đàn", value: 45 },
    { name: "Trịnh Thị Ly", value: 29 },
    { name: "Vũ Đức Huy", value: 18 },
    { name: "Dương Thu Phương", value: 25 },
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

  const calculateRevenueForMonth = (orders, month, year) => {
    const startDate = new Date(year, month - 1, 1); // Tháng bắt đầu (month - 1 vì JavaScript bắt đầu từ 0)
    const endDate = new Date(year, month, 0); // Tháng kết thúc (ngày cuối cùng của tháng)

    // Lọc các đơn hàng trong tháng
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });

    // Tính tổng doanh thu
    const totalRevenue = filteredOrders.reduce(
      (acc, order) => acc + order.totalAmount,
      0
    );

    // Định dạng doanh thu thành chuỗi và thêm đơn vị (VND hoặc bất kỳ đơn vị tiền tệ nào bạn muốn)
    const revenueString = totalRevenue.toLocaleString("vi-VN") + " VND"; // Định dạng theo kiểu Việt Nam

    // Trả về cả doanh thu và số lượng đơn hàng
    return {
      revenue: revenueString,
      orderCount: filteredOrders.length,
    };
  };

  // Tính doanh thu và số lượng đơn hàng của tháng 1, 2025
  const { revenue, orderCount } = calculateRevenueForMonth(orders, 1, 2025);
  console.log(`Doanh thu tháng 1/2025: ${revenue}`);
  console.log(`Số đơn hàng tháng 1/2025: ${orderCount}`);

  const revenueByMonth = Array.from({ length: 12 }, (_, i) => {
    const { revenue } = calculateRevenueForMonth(orders, i + 1, 2025); // Destructure the returned object
    return {
      month: (i + 1).toString(),
      revenue: revenue.replace(/[^\d]/g, ""), // Ensure revenue is a string without any non-numeric characters
    };
  });

  return (
    <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Sales Summary */}
      <div className="col-span-1 lg:col-span-2 bg-gradient-to-r from-blue-300 to-purple-400 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 ">
          Báo cáo hoạt động kinh doanh
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xl">
          {[
            {
              icon: <AiOutlineBarChart className="text-4xl" />,
              label: "Tổng sản phẩm",
              value: products.length,
            },
            {
              icon: <AiOutlineOrderedList className="text-4xl" />,
              label: "Tổng đơn hàng ",
              value: orderCount || "0",
            },
            {
              icon: <AiFillTags className="text-4xl" />,
              label: "Doanh thu",
              value: revenue || "Chưa có doanh thu",
            },
            {
              icon: <AiOutlineUserAdd className="text-4xl" />,
              label: "Nhân viên ",
              value: "7",
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
      <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg ">
        <h2 className="text-xl font-semibold mb-5 text-gray-800">
          Top 5 Sản phẩm bán chạy
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">Tên sản phẩm</th>
              <th className="py-2 px-3">Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {topSellingProducts.map((product, index) => (
              <tr
                key={index}
                className={`border-b hover:bg-blue-100 text-center ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-3 px-3">{index + 1}</td>
                <td className="py-3 px-3 font-medium text-gray-700">
                  {product.productName}
                </td>
                <td className="py-3 px-3 text-gray-600">{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pie Chart */}
      <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Top nhân viên bán hàng
        </h2>
        <div className="flex justify-center items-center text-lg">
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

      <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Doanh thu hàng tháng
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={revenueByMonth}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#8884d8" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Orders */}
      {/* <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
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
                  {order.user?.name}
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
      
      <div className="col-span-1 flex flex-wrap gap-4 justify-center">
        <Button onClick={handleCheckToken}>Check Token</Button>
        <Button onClick={() => getAllOrders()}>Refresh Orders</Button>
      </div> */}
    </div>
  );
};

export default Page;
