"use client";
import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { productState, selectedBrandState } from "@/shared/store/Atoms/product";
import { useRecoilState, useRecoilValue } from "recoil";
import { CartItem, Product } from "@/shared/types/product";
import { Image, Modal } from "antd";
import axios from "axios";
import { authState } from "@/shared/store/Atoms/auth";

const OrderPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [isQRModalVisible, setIsQRModalVisible] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useRecoilState(selectedBrandState);
  const [products, setProducts] = useRecoilState(productState);
  const auth = useRecoilValue(authState);

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingProductIndex === -1) {
        return [...prevCart, { ...product, quantity: 1 }];
      } else {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += 1;
        return updatedCart;
      }
    });
  };

  const handleIncreaseQuantity = (productId: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      return updatedCart;
    });
  };

  const handleDecreaseQuantity = (productId: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.id === productId && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      return updatedCart;
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (product) => selectedBrand === "" || product.brand === selectedBrand
    );

  const createOrder = async () => {
    if (cart.length === 0) {
      alert(
        "Giỏ hàng hiện đang trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán."
      );
      return;
    }
    if (!selectedTable) {
      alert("Vui lòng chọn bàn trước khi thanh toán.");
      return;
    }

    const orderData = {
      userId: auth?.user?.id,

      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/order/add`,
        orderData
      );
      console.log("Order created:", response.data);
      setCart([]);
      setSelectedTable("");
      alert("Đơn hàng đã được tạo thành công!");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Đã có lỗi xảy ra khi tạo đơn hàng.");
    }
  };

  const bankName = "Ngân hàng BIDV";
  const bankAccount = "4505046869";

  const getQRCodeValue = () => {
    const totalAmount = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return `Ngân hàng: ${bankName}\nSố tài khoản: ${bankAccount}\nTổng thanh toán: ${totalAmount.toLocaleString()} VND\nBàn: ${selectedTable}`;
  };
  const handlePayment = async (method: "cash" | "qr" | "postpaid") => {
    if (cart.length === 0) {
      alert(
        "Giỏ hàng hiện đang trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán."
      );
      return;
    }
    if (!selectedTable) {
      alert("Vui lòng chọn bàn trước khi thanh toán.");
      return;
    }

    const orderData = {
      userId: auth?.user?.id,
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      paymentMethod: method,
    };

    if (method === "qr") {
      setIsQRModalVisible(true);

      const isPaid = await verifyPayment(orderData.totalAmount);
      if (!isPaid) {
        alert("Thanh toán QR không thành công. Vui lòng thử lại.");
        setIsQRModalVisible(false);
        return;
      }
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/order/add`,
        orderData
      );
      console.log("Order created:", response.data);
      setCart([]);
      setSelectedTable("");
      alert("Đơn hàng đã được tạo thành công!");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Đã có lỗi xảy ra khi tạo đơn hàng.");
    }
  };

  const verifyPayment = async (amount: number): Promise<boolean> => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const isPaymentSuccessful = confirm(
            `Xác nhận thanh toán thành công số tiền: ${amount.toLocaleString()} VND?`
          );
          resolve(isPaymentSuccessful);
        }, 30000);
      });
    } catch (error) {
      console.error("Lỗi khi xác minh thanh toán:", error);
      return false;
    }
  };

  const closeQRModal = () => {
    setIsQRModalVisible(false);
  };

  const brands = ["BrandA", "BrandB"];

  return (
    <section className="bg-gray-100 p-5 rounded-xl flex flex-col">
      <header className="flex justify-between items-center bg-white shadow-lg px-6 py-4 mb-3 rounded-xl">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedBrand("")}
            className={`px-4 py-2 rounded-md transition ${
              selectedBrand === ""
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-200"
            }`}
          >
            Tất cả
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-4 py-2 rounded-md transition ${
                selectedBrand === brand
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-200"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="border p-2 w-1/4 rounded-md focus:ring-2 focus:ring-green-300 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => alert("Lịch sử tạo đơn hàng")}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Lịch sử tạo đơn hàng
        </button>
      </header>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-7 gap-3 h-full overflow-hidden !min-h-[75vh]">
        <div className="md:col-span-4 p-4 bg-white shadow-lg rounded-md overflow-y-auto">
          <h2 className="text-lg font-bold mb-3">Danh sách sản phẩm</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2 overflow-y-auto max-h-screen">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleAddToCart(product)}
                className="flex flex-col items-center  border rounded-lg bg-gray-50 shadow hover:shadow-lg transition duration-300 ease-in-out h-44 w-[100%]"
              >
                <Image
                  src={
                    typeof product.image === "string"
                      ? product.image
                      : undefined
                  }
                  preview={false}
                  alt={product.name}
                  className=" object-cover rounded-md mb-1"
                  style={{
                    width: "100%",
                    height: "90px",
                  }}
                />
                <span className="text-center h-[45px] font-semibold text-gray-700 w-full truncate-2-lines overflow-hidden text-ellipsis line-clamp-2">
                  {product.name}
                </span>
                <span className="text-center font-bold text-blue-600 ">
                  {product.price.toLocaleString()} VND
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 p-4 bg-white shadow-lg rounded-md h-full flex flex-col">
          <h2 className="text-lg font-bold mb-4">
            Giỏ hàng -{" "}
            <span className="mt-4">
              <label className="font-semibold">Bàn:</label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="border !text-md p-2 ml-2 rounded-md focus:ring-2 focus:ring-yellow-300 outline-none"
              >
                <option value="">Chọn bàn</option>
                <option value="VIP 1">VIP 1</option>
                <option value="VIP 2">VIP 2</option>
                <option value="Sân vườn">Sân vườn</option>
                <option value="Sân vườn">Mang di</option>
              </select>
            </span>
          </h2>

          <ul className="max-h-screen overflow-y-auto mb-4 bg-white shadow-lg rounded-lg p-4 flex-grow space-y-2">
            {cart.length === 0 ? (
              <li className="text-center text-gray-500">Giỏ hàng trống</li>
            ) : (
              cart.map((item, index) => (
                <li key={item.id} className="flex justify-between items-center">
                  <div>
                    <div>
                      {index + 1}
                      <span className="font-bold text-gray-700">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-blue-600">
                      sl : {item.quantity} x {item.price}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-blue-600">
                      {(item.price * item.quantity).toLocaleString()} VND
                    </span>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="ml-2 text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>

          <div className="flex justify-between items-center mb-4 text-lg">
            <span className="font-semibold">Tổng cộng:</span>
            <span className="font-bold text-blue-600">
              {cart
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toLocaleString()}{" "}
              VND
            </span>
          </div>

          <div className="flex gap-5">
            <button
              onClick={() => handlePayment("cash")}
              className="bg-blue-500 text-white py-5 rounded-md w-full hover:bg-blue-600 transition duration-200"
            >
              Tiền mặt
            </button>
            <button
              onClick={() => handlePayment("qr")}
              className="bg-green-500 text-white py-5 rounded-md w-full hover:bg-green-600 transition duration-200"
            >
              Thanh toán QR
            </button>
            <button
              onClick={() => handlePayment("postpaid")}
              className="bg-yellow-500 text-white py-5 rounded-md w-full hover:bg-yellow-600 transition duration-200"
            >
              Thanh toán sau
            </button>
          </div>
        </div>
      </div>

      <Modal
        title="Mã QR Thanh Toán"
        visible={isQRModalVisible}
        onCancel={closeQRModal}
        footer={null}
        centered
      >
        <QRCodeCanvas value={getQRCodeValue()} size={256} />
      </Modal>
    </section>
  );
};

export default OrderPage;
