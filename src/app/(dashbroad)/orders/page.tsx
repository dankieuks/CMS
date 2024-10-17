"use client";
import React, { useState } from "react";
import { BiMessageSquareAdd } from "react-icons/bi";
import { QRCodeCanvas } from "qrcode.react"; // Import component tạo mã QR
import { selectedBrandState } from "@/shared/store/Atoms/product";
import { useRecoilState } from "recoil";
import { Product } from "@/shared/types/product";

const products: Product[] = [
  {
    id: "1",
    name: "Anna Melody Mark Hi Hid",
    price: 30000,
    image:
      "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/11/7/uong-nuoc-cam-16993504421751885406385.jpg",
    brand: "Coca-Cola",
  },
  {
    id: "2",
    name: "Bella",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxLkT7moPARzeQ21Q3JFhoARF-m3COjrtU0g&s",
    brand: "Pepsi",
  },
  {
    id: "3",
    name: "Chloe",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdQHOC-AYakD0LnDL75zoLyfV3umld0KDyOA&s",
    brand: "Fanta",
  },
  {
    id: "4",
    name: "Diana",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNaosiocCMIx_w8MdlmGOgEjOyAMd8BdOU4A&s",
    brand: "Coca-Cola",
  },
  {
    id: "5",
    name: "Eva",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqAmhu7EhD0O24wY2ix9c3JNEzTynjsV2YMw&s",
    brand: "Pepsi",
  },
  {
    id: "5",
    name: "Eva",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqAmhu7EhD0O24wY2ix9c3JNEzTynjsV2YMw&s",
    brand: "Pepsi",
  },
  {
    id: "5",
    name: "Eva",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqAmhu7EhD0O24wY2ix9c3JNEzTynjsV2YMw&s",
    brand: "Pepsi",
  },
  {
    id: "5",
    name: "Eva",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqAmhu7EhD0O24wY2ix9c3JNEzTynjsV2YMw&s",
    brand: "Pepsi",
  },
  {
    id: "5",
    name: "Eva",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqAmhu7EhD0O24wY2ix9c3JNEzTynjsV2YMw&s",
    brand: "Pepsi",
  },
  {
    id: "5",
    name: "Eva",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqAmhu7EhD0O24wY2ix9c3JNEzTynjsV2YMw&s",
    brand: "Pepsi",
  },
  {
    id: "5",
    name: "Eva",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqAmhu7EhD0O24wY2ix9c3JNEzTynjsV2YMw&s",
    brand: "Pepsi",
  },
  {
    id: "5",
    name: "Eva",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqAmhu7EhD0O24wY2ix9c3JNEzTynjsV2YMw&s",
    brand: "Pepsi",
  },
  {
    id: "5",
    name: "Eva",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqAmhu7EhD0O24wY2ix9c3JNEzTynjsV2YMw&s",
    brand: "Pepsi",
  },
  {
    id: "5",
    name: "Eva",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqAmhu7EhD0O24wY2ix9c3JNEzTynjsV2YMw&s",
    brand: "Pepsi",
  },
  {
    id: "5",
    name: "Eva",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqAmhu7EhD0O24wY2ix9c3JNEzTynjsV2YMw&s",
    brand: "Pepsi",
  },
  {
    id: "5",
    name: "Eva",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqAmhu7EhD0O24wY2ix9c3JNEzTynjsV2YMw&s",
    brand: "Pepsi",
  },
  {
    id: "5",
    name: "Eva",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqAmhu7EhD0O24wY2ix9c3JNEzTynjsV2YMw&s",
    brand: "Pepsi",
  },
  {
    id: "5",
    name: "Eva",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqAmhu7EhD0O24wY2ix9c3JNEzTynjsV2YMw&s",
    brand: "Pepsi",
  },
  {
    id: "5",
    name: "Eva",
    price: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqAmhu7EhD0O24wY2ix9c3JNEzTynjsV2YMw&s",
    brand: "Pepsi",
  },
];

const OrderPage: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [showQRCode, setShowQRCode] = useState<boolean>(false);

  // Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveFromCart = (productId: string = "") => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Tìm kiếm sản phẩm
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // In bill
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
    alert(bill); // Thay bằng tính năng in bill thực tế
  };

  // Thanh toán và hiển thị mã QR
  const handleCheckout = () => {
    if (!selectedTable) {
      alert("Vui lòng chọn bàn trước khi thanh toán.");
      return;
    }

    const totalAmount = cart.reduce((total, item) => total + item.price, 0);
    alert(
      `Bàn ${selectedTable} phai thanh toán với tổng số tiền ${totalAmount.toLocaleString()} VND`
    );

    // Hiển thị mã QR sau khi thanh toán
    setShowQRCode(true);
  };

  // Tạo chuỗi mã QR từ thông tin thanh toán
  const bankName = "Ngân hàng BIDV";
  const bankAccount = "4505046869"; // Đây là số tài khoản

  const getQRCodeValue = () => {
    const totalAmount = cart.reduce((total, item) => total + item.price, 0);
    return `Ngân hàng: ${bankName}\nSố tài khoản: ${bankAccount}\nTổng thanh toán: ${totalAmount.toLocaleString()} VND\nBàn: ${selectedTable}`;
  };
  const brands = ["Coca-Cola", "Pepsi", "Fanta"];
  const [selectedBrand, setSelectedBrand] = useRecoilState(selectedBrandState);
  return (
    <section className="bg-gray-100 p-6 rounded-xl flex flex-col ">
      <header className="flex justify-between items-center bg-white shadow-lg px-6 py-4 mb-4 rounded-xl">
        {/* Tabs cho các thương hiệu */}
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
        {/* Tìm kiếm sản phẩm */}
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="border p-2 w-1/4 rounded-md focus:ring-2 focus:ring-green-300 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* In Bill Button */}
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
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-[90px] h-[90px] object-cover rounded-md mb-1"
                />
                <span className="text-center h-[45px] font-semibold text-gray-700 w-full truncate-2-lines">
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
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition duration-300 ease-in-out"
                    >
                      Xóa
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>

          {cart.length > 0 && (
            <div className="mt-2 text-right text-gray-800 font-bold">
              Tổng cộng:{" "}
              {cart
                .reduce((total, item) => total + item.price, 0)
                .toLocaleString()}{" "}
              VND
            </div>
          )}

          {/* Container chừa sẵn cho mã QR */}
          <div
            className={`mt-4 flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out ${
              showQRCode ? "block" : "hidden"
            }`}
            style={{ height: showQRCode ? "auto" : "150px" }} // Chiều cao cố định khi không hiển thị mã QR
          >
            <h3 className="font-semibold mb-2">Quét mã QR để thanh toán:</h3>
            <QRCodeCanvas
              value={getQRCodeValue()}
              size={150}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
            />
          </div>

          <div className="left-0 w-full flex justify-between bg-white shadow-lg p-4 rounded-md">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
              onClick={handleCheckout}
            >
              Thanh toán
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
              onClick={handlePrintBill}
            >
              In Bill
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderPage;
