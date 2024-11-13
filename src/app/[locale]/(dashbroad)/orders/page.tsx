"use client";
import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { productState, selectedBrandState } from "@/shared/store/Atoms/product";
import { useRecoilState, useRecoilValue } from "recoil";
import { Product } from "@/shared/types/product";
import { useGetProduct } from "@/shared/hooks/product";
import { Image } from "antd";

const OrderPage: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useRecoilState(selectedBrandState);

  const { getProduct } = useGetProduct();
  const [products, setProducts] = useRecoilState(productState);

  const getProducts = async () => {
    const data = await getProduct();
    setProducts(data);
  };

  useEffect(() => {
    getProducts();
  }, []);

  console.log(products);

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
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
    const totalAmount = cart.reduce((total, item) => total + item.price, 0);

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

    const totalAmount = cart.reduce((total, item) => total + item.price, 0);
    alert(
      `Bàn ${selectedTable} cần thanh toán với tổng số tiền ${totalAmount.toLocaleString()} VND`
    );

    setShowQRCode(true);
  };

  const bankName = "Ngân hàng BIDV";
  const bankAccount = "4505046869";

  const getQRCodeValue = () => {
    const totalAmount = cart.reduce((total, item) => total + item.price, 0);
    return `Ngân hàng: ${bankName}\nSố tài khoản: ${bankAccount}\nTổng thanh toán: ${totalAmount.toLocaleString()} VND\nBàn: ${selectedTable}`;
  };

  const brands = ["Coca-Cola", "Pepsi", "Fanta"];

  return (
    <section className="bg-gray-100 p-6 rounded-xl flex flex-col ">
      <header className="flex justify-between items-center bg-white shadow-lg px-6 py-4 mb-4 rounded-xl">
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

      <div className="flex-grow grid grid-cols-1 md:grid-cols-5 gap-4 h-screen overflow-hidden">
        <div className="md:col-span-3   p-4 bg-white shadow-lg rounded-md overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Danh sách sản phẩm</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:max-h-[620px] lg:h-[720px] overflow-y-auto">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleAddToCart(product)}
                className="flex flex-col items-center p-2 border rounded-lg bg-gray-50 shadow hover:shadow-lg transition duration-300 ease-in-out h-44 w-full"
              >
                <Image
                  src={
                    typeof product.image === "string"
                      ? product.image
                      : undefined
                  }
                  alt={product.name}
                  className="w-[90px] h-[90px] object-cover rounded-md mb-1"
                />
                <span className="text-center h-[45px] font-semibold text-gray-700 w-full truncate-2-lines overflow-hidden text-ellipsis line-clamp-2">
                  {product.name}
                </span>
                <span className="text-center font-bold text-blue-600 mb-1">
                  {product.price.toLocaleString()} VND
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 p-4 bg-white shadow-lg rounded-md h-full flex flex-col">
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

          <ul className="max-h-[320px] overflow-y-auto mb-4 bg-white shadow rounded-lg p-4 flex-grow">
            {cart.length === 0 ? (
              <li className="text-gray-500 text-center py-4">Giỏ hàng rỗng</li>
            ) : (
              cart.map((item, index) => (
                <li
                  key={item.id}
                  className="grid grid-cols-8 items-center gap-4 p-2 border-b border-gray-200 last:border-none"
                >
                  <div className="col-span-3 font-semibold text-gray-800">
                    {index + 1}. {item.name}
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    <button className="bg-gray-300 text-black px-3 py-1 rounded-lg hover:bg-gray-400 transition">
                      -
                    </button>
                    <span className="mx-2 text-lg ">1</span>
                    <button className="bg-gray-300 text-black px-3 py-1 rounded-lg hover:bg-gray-400 transition">
                      +
                    </button>
                  </div>
                  <div className="col-span-1 text-center text-gray-700">
                    {item.price.toLocaleString()}
                  </div>
                  <div className="col-span-1 text-center text-gray-700 font-medium">
                    {item.price.toLocaleString()}
                  </div>
                  <div className="col-span-1 text-center">
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition duration-300 ease-in-out">
                      X
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>

          {showQRCode && (
            <div className="mt-4 flex flex-col items-center justify-center">
              <QRCodeCanvas value={getQRCodeValue()} size={200} level={"H"} />
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
                onClick={() => setShowQRCode(false)}
              >
                Đóng mã QR
              </button>
            </div>
          )}

          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md mt-4 transition duration-300 ease-in-out"
            onClick={handleCheckout}
          >
            Thanh toán
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrderPage;
