"use client";
import { AiOutlineCoffee } from "react-icons/ai";
import {
  AiOutlineBarChart,
  AiOutlineOrderedList,
  AiFillTags,
  AiOutlineUserAdd,
} from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { productState } from "@/shared/store/Atoms/product";
import { useGetProduct } from "@/shared/hooks/product";
import { authState } from "@/shared/store/Atoms/auth";
import { useGetAllOrder } from "@/shared/hooks/order";
import {
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import { ordersState } from "@/shared/store/Atoms/order";
import { useGetUser } from "@/shared/hooks/user";
import { Employees } from "@/shared/types/user";
import axios from "axios";
import { Card, Collapse, Table } from "antd";
import ProtectedRoute from "@/shared/providers/auth.provider";

interface BestSellProduct {
  productName: string;
  quantity: number;
}
type Order = {
  createdAt: Date;
  items: BestSellProduct[];
  userId: string;
};

interface StockEntry {
  id?: string;
  ingredient: string;
  quantity: string;
  unit: string;
  supplier: string;
}

interface StockEntryBatch {
  id: string;
  createdAt: string;
  entries: StockEntry[];
}
const Page = () => {
  const { getProduct } = useGetProduct();
  const [employees, setEmployees] = useState<Employees[]>([]);
  const [products, setProducts] = useRecoilState(productState);
  const [orders, setOrders] = useRecoilState(ordersState);
  const [batches, setBatches] = useState<StockEntryBatch[]>([]);
  const auth = useRecoilValue(authState);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { getAllOrders } = useGetAllOrder();
  const { fetchUsers } = useGetUser();
  const getUsers = async () => {
    const users = await fetchUsers();
    setEmployees(users);
  };

  useEffect(() => {
    getUsers();
    const fetchData = async () => {
      const [productsData, ordersData] = await Promise.all([
        getProduct(),
        getAllOrders(),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
    };
    fetchData();
  }, []);
  useEffect(() => {
    fetchStockBatches();
  }, []);

  const fetchStockBatches = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/stock/batches`
      );
      setBatches(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu kho.");
    }
  };

  // Lọc các lần nhập kho theo tháng và năm
  const filteredBatches = batches.filter((batch) => {
    const batchDate = new Date(batch.createdAt);
    return (
      batchDate.getMonth() + 1 === selectedMonth &&
      batchDate.getFullYear() === selectedYear
    );
  });
  const getTopSellingProducts = (
    orders: Order[],
    month: number,
    year: number
  ) => {
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() + 1 === month && orderDate.getFullYear() === year
      );
    });

    let totalProductsSold = 0;

    const productSales: { [key: string]: number } = {};
    filteredOrders.forEach((order) => {
      order.items.forEach((product) => {
        productSales[product.productName] =
          (productSales[product.productName] || 0) + product.quantity;
        totalProductsSold += product.quantity;
      });
    });

    const sortedProducts = Object.entries(productSales)
      .map(([productName, quantity]) => ({ productName, quantity }))
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 5);

    return {
      topProducts:
        sortedProducts.length > 0
          ? sortedProducts
          : [{ productName: "Không có dữ liệu", quantity: 0 }],
      totalProductsSold,
    };
  };

  const { topProducts, totalProductsSold } = getTopSellingProducts(
    orders,
    selectedMonth,
    selectedYear
  );

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

  const calculateRevenueForMonth = (orders: any, month: any, year: any) => {
    if (
      !Array.isArray(orders) ||
      !Number.isInteger(month) ||
      !Number.isInteger(year)
    ) {
      throw new Error("Invalid input parameters");
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });

    const totalRevenue = filteredOrders.reduce(
      (acc, order) => acc + (Number(order.amount) || 0),
      0
    );

    const revenueString = totalRevenue.toLocaleString("vi-VN") + " VND";

    return {
      revenue: revenueString,
      totalOrders: filteredOrders.length,
    };
  };

  const revenueByMonth = Array.from({ length: 12 }, (_, i) => {
    const { revenue, totalOrders } = calculateRevenueForMonth(
      orders,
      i + 1,
      2025
    );
    return {
      month: (i + 1).toString(),
      revenue: parseInt(revenue.replace(/[^\d]/g, ""), 10),
      totalOrders,
    };
  });

  console.log("revenueByMonth", revenueByMonth);

  const currentMonth = new Date().getMonth() + 1;

  const { revenue: currentRevenue, totalOrders: currentTotalOrders } =
    calculateRevenueForMonth(orders, selectedMonth, selectedYear);

  console.log(`Current month revenue (${currentMonth}/${currentYear}):`, {
    revenue: currentRevenue,
    totalOrders: currentTotalOrders,
  });

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="col-span-1 lg:col-span-2 bg-gradient-to-r from-blue-300 to-purple-400 text-white p-6 rounded-lg shadow-lg">
          <div className=" flex justify-between text-2xl font-bold mb-6">
            <h2 className="text-3xl font-bold mb-6">
              {`Báo cáo hoạt động kinh doanh tháng ${selectedMonth}-${selectedYear}`}
            </h2>
            <div className="flex justify-end mb-4 gap-4 text-black">
              <div>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="border bg-transparent rounded-lg p-2"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="border bg-transparent rounded-lg p-2"
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <option key={currentYear - i} value={currentYear - i}>
                      Năm {currentYear - i}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 text-xl">
            {[
              {
                icon: <AiOutlineBarChart className="text-4xl" />,
                label: "Tổng sản phẩm",
                value: products.length,
              },
              {
                icon: <AiOutlineOrderedList className="text-4xl" />,
                label: "Đơn hàng",
                value: currentTotalOrders || "Chưa có đơn hàng",
              },
              {
                icon: <AiFillTags className="text-4xl" />,
                label: "Doanh thu",
                value: currentRevenue || "Chưa có doanh thu",
              },
              {
                icon: <AiOutlineCoffee className="text-4xl" />,
                label: "Số sản phẩm đã bán",
                value: totalProductsSold || "0",
              },
              {
                icon: <AiOutlineUserAdd className="text-4xl" />,
                label: "Nhân viên",
                value: employees.length,
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
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800">
            {` Top sản phẩm bán chạy tháng ${selectedMonth}-${selectedYear}`}
          </h2>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={topProducts}>
              <XAxis dataKey="productName" tick={{ fontSize: 18 }} />
              <YAxis
                tickFormatter={(value) => value.toLocaleString()}
                domain={[
                  0,
                  Math.ceil(
                    Math.max(...topProducts.map((p) => p.quantity)) / 30
                  ) * 30,
                ]}
              />
              <Tooltip
                formatter={(value) => `${value.toLocaleString()} Sản Phẩm`}
              />
              <Bar dataKey="quantity" name="Doanh số" barSize={80}>
                {topProducts.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {`Nhập nguyên liệu ${filteredBatches.length} lần/ tháng`}
          </h2>
          {filteredBatches.length > 0 ? (
            filteredBatches.map((batch) => (
              <Collapse
                accordion
                className="bg-gray-100 rounded-lg p-4 shadow-md"
              >
                <Collapse.Panel
                  key={batch.id}
                  header={`📅 Lần nhập: ${new Date(
                    batch.createdAt
                  ).toLocaleString()}`}
                  className="bg-white rounded-lg shadow-md text-[18px]"
                >
                  <Table
                    columns={[
                      {
                        title: "Nguyên liệu",
                        dataIndex: "ingredient",
                        key: "ingredient",
                      },
                      {
                        title: "Số lượng",
                        dataIndex: "quantity",
                        key: "quantity",
                      },
                      { title: "Đơn vị", dataIndex: "unit", key: "unit" },
                      {
                        title: "Nhà cung cấp",
                        dataIndex: "supplier",
                        key: "supplier",
                      },
                    ]}
                    dataSource={batch.entries}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    className="custom-table border rounded-lg text-lg"
                  />
                </Collapse.Panel>
              </Collapse>
            ))
          ) : (
            <p className="text-gray-500">
              Không có lần nhập kho nào trong tháng này.
            </p>
          )}
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
              <XAxis dataKey="month" name="Tháng" />

              <YAxis
                yAxisId="left"
                tickFormatter={(value) =>
                  value.toLocaleString("vi-VN") + " VND"
                }
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, (dataMax: any) => Math.ceil(dataMax / 10) * 30]}
                tickCount={6}
                tickFormatter={(value) =>
                  value.toLocaleString("vi-VN") + " đơn"
                }
              />

              <Tooltip
                formatter={(value, name) =>
                  name === "Đơn hàng"
                    ? value.toLocaleString("vi-VN") + " đơn"
                    : value.toLocaleString("vi-VN") + " VND"
                }
              />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                name="Doanh thu"
                fill="#8884d8"
                barSize={50}
              />
              <Bar
                yAxisId="right"
                dataKey="totalOrders"
                name="Đơn hàng"
                fill="#82ca9d"
                barSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
