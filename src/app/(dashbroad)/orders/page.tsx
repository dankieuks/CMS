"use client";
import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { productState, selectedBrandState } from "@/shared/store/Atoms/product";
import { useRecoilState, useRecoilValue } from "recoil";
import { CartItem, Product } from "@/shared/types/product";
import { Image } from "antd";

const OrderPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useRecoilState(selectedBrandState);
  const [products, setProducts] = useRecoilState(productState);
  console.log(products);
  console.log(cart);

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

  // Bill generation
  const handlePrintBill = () => {
    const billContent = cart
      .map((item) => `${item.name} - ${item.price.toLocaleString()} VND`)
      .join("\n");
    const totalAmount = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const bill = `
      Bàn: ${selectedTable || "Chưa chọn"}
      Hóa đơn của bạn:
      ----------------------
      ${billContent}
      ----------------------
      Tổng cộng: ${totalAmount.toLocaleString()} VND
    `;
    alert(bill);
  };

  const handleCheckout = () => {
    if (!selectedTable) {
      alert("Vui lòng chọn bàn trước khi thanh toán.");
      return;
    }

    const totalAmount = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    alert(
      `Bàn ${selectedTable} cần thanh toán với tổng số tiền ${totalAmount.toLocaleString()} VND`
    );

    setShowQRCode(true);
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

  const brands = ["Đồ uống ", "Đồ ăn"];

  return (
    <section className="bg-gray-100 p-5 rounded-xl flex flex-col ">
      <header className="flex justify-between items-center bg-white shadow-lg px-6 py-4 mb-3 rounded-xl">
        {/* Tabs for product brands */}
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
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
          onClick={handlePrintBill}
        >
          In Bill
        </button>
      </header>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-7 gap-3 h-screen overflow-hidden">
        <div className="md:col-span-4 p-4 bg-white shadow-lg rounded-md overflow-y-auto">
          <h2 className="text-lg font-bold mb-3">Danh sách sản phẩm</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2 overflow-y-auto">
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
              </select>
            </span>
          </h2>

          <ul className="max-h-[420px] overflow-y-auto mb-4 bg-white shadow-lg rounded-lg p-4 flex-grow space-y-2">
            {cart.length === 0 ? (
              <li className="text-gray-500 text-center py-4">Giỏ hàng rỗng</li>
            ) : (
              cart.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center p-2 border-b border-gray-200 rounded-lg hover:bg-gray-50 transition duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={typeof item.image === "string" ? item.image : ""}
                      alt={item.name}
                      preview={false}
                      width={40}
                      height={40}
                      className="object-cover rounded-md hidden md:hidden lg:block"
                    />
                    <span className="text-md font-semibold text-gray-700 w-[200px] truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-end space-x-4 text-right text-gray-600">
                    <span className="font-bold text-gray-800">
                      {item.price.toLocaleString()} VND x {item.quantity}
                    </span>
                    <div className="flex gap-3 ml-4">
                      <button
                        onClick={() => handleIncreaseQuantity(item.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleDecreaseQuantity(item.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-200"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>

          <div className="flex items-center justify-between py-2 mb-4">
            <span className="text-xl font-semibold">Tổng cộng: </span>
            <span className="text-xl font-bold">
              {cart
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toLocaleString()}{" "}
              VND
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCheckout}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>

      {showQRCode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
            <QRCodeCanvas value={getQRCodeValue()} size={250} />
            <button
              onClick={() => setShowQRCode(false)}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderPage;
