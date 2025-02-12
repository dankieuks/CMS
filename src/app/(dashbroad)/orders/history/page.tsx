"use client";
import React, { useEffect, useState } from "react";
import { DatePicker, Input } from "antd";
import { useGetAllOrder, useGetOrder } from "@/shared/hooks/order";
import dayjs from "dayjs";
import { Order } from "@/shared/types/order";

const OrderHistory: React.FC = () => {
  const { orders, getAllOrders } = useGetAllOrder();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchName, setSearchName] = useState<string>("");
  const fetchOrders = async () => {
    setIsLoading(true);
    await getAllOrders();
    setIsLoading(false);
  };

  useEffect(() => {
    if ((orders as Order[]).length > 0) {
      const sortedOrders = [...(orders as Order[])].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setFilteredOrders(sortedOrders);
    }
  }, [orders]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleDateChange = (date: any, dateString: string | string[]) => {
    if (Array.isArray(dateString)) {
      setSelectedDate(dateString[0]);
    } else {
      setSelectedDate(dateString);
    }

    filterOrders(date, searchName);
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setSearchName(name);
    filterOrders(selectedDate, name);
  };

  const filterOrders = (date: any, name: string) => {
    let filtered = orders;

    if (date) {
      filtered = filtered.filter((order: Order) =>
        dayjs(order.createdAt).isSame(dayjs(date), "day")
      );
    }

    if (name.trim() !== "") {
      let filtered: Order[] = [...orders];
      filtered = filtered.filter((order) =>
        order?.user?.name?.toLowerCase().includes(name.toLowerCase())
      );
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setFilteredOrders(filtered);
    }

    setFilteredOrders(filtered);
  };

  return (
    <div className="mt-6 p-8 bg-white shadow-lg rounded-xl border border-gray-200">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        🛒 Lịch sử đơn hàng
      </h3>

      <div className="flex items-center justify-end gap-4 mb-6">
        <label
          htmlFor="date-picker"
          className="text-base font-medium text-gray-600"
        >
          Lọc
        </label>
        <DatePicker
          id="date-picker"
          onChange={handleDateChange}
          format="YYYY-MM-DD"
          placeholder="Chọn ngày"
          className="w-full max-w-sm border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Input
          id="employee-name"
          type="text"
          placeholder="Nhập tên nhân viên"
          value={searchName}
          onChange={handleNameChange}
          className="w-full max-w-sm border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          <p className="text-sm font-medium text-gray-500 mt-4">Đang tải...</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        <ul className="space-y-4">
          {filteredOrders.map((order) => (
            <li
              key={order.id}
              className="p-4 bg-gray-50 rounded-lg shadow hover:shadow-md transition duration-200 border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-800">
                      Order ID:
                    </span>{" "}
                    {order.id}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-800">
                      Nhân viên: {order?.user.name}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-800">
                      Trạng thái:
                    </span>{" "}
                    <span
                      className={`${
                        order.status === "success"
                          ? "text-green-600"
                          : "text-red-600"
                      } font-semibold`}
                    >
                      {order.status === "success" ? "Thành công" : "Thất bại"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-800">
                      Phương thức thanh toán:
                      {order.paymentMethod === "cash" ? "  Tiền mặt  " : " QR"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-800">
                      Ngày tạo:
                    </span>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Tổng tiền</span>
                  <span className="block text-xl font-bold text-blue-600">
                    {formatCurrency(order.amount)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center py-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 14l2-2m0 0l2-2m-2 2v6m0-6l2-2m0 0l2-2m-2 2H9m0 6a9 9 0 1018 0 9 9 0 10-18 0z"
            />
          </svg>
          <p className="text-sm font-medium text-gray-500 mt-4">
            Không có đơn hàng nào!
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
