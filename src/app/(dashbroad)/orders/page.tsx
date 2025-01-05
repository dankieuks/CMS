"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { CartItem, Product } from "@/shared/types/product";
import { Image, Modal } from "antd";
import axios from "axios";
import { authState } from "@/shared/store/Atoms/auth";
import { productState, selectedBrandState } from "@/shared/store/Atoms/product";

const OrderPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [isQRModalVisible, setIsQRModalVisible] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useRecoilState(selectedBrandState);
  const [products, setProducts] = useRecoilState(productState);
  const auth = useRecoilValue(authState);
  const intervalIdRef = useRef<number | null>(null);

  const [orderId, setOrderId] = useState<string>("");
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
    .filter((product) =>
      selectedBrand ? product.brand === selectedBrand : true
    );

  const closeQRModal = () => {
    setIsQRModalVisible(false);
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };
  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const MY_BANK = {
    BANK_ID: "BIDV",
    ACCOUNT_NO: "4505046869",
    ACCOUNT_NAME: "KIEU DINH DAN",
  };
  useEffect(() => {
    const random = Math.floor(Math.random() * 1000000);
    setOrderId(`CMS${random}`);
  }, []);

  const createVietQR = (totalAmount: number) => {
    return `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${
      MY_BANK.ACCOUNT_NO
    }-print.png?amount=${totalAmount.toString()}&addInfo=${orderId}&accountName=${
      MY_BANK.ACCOUNT_NAME
    }`;
  };

  const checkPaid = async (totalAmount: number): Promise<boolean> => {
    try {
      const response = await axios.get(
        "https://script.google.com/macros/s/AKfycbwhxRhx0FUL4AabonwU-Wyck1nnOoQ1PGw35pNrrMajRbwT-40HdCDFZMWcsvDB8B7Y/exec"
      );
      const lastTransaction = response.data.data[response.data.data.length - 1];

      const pricePaid = lastTransaction["Giá trị"];
      let contentPaid = lastTransaction["Mô tả"];

      contentPaid = contentPaid?.trim();

      const match = contentPaid?.match(/CMS\d+/);
      const matchedOrderId = match?.[0]?.trim();

      if (pricePaid === totalAmount && matchedOrderId === orderId) {
        alert("Thanh toán thành công");
        return true;
      }

      return false;
    } catch (error) {
      alert("Lỗi khi thanh toán");
      return false;
    }
  };

  const createOrder = async (orderData: any) => {
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

  const handlePayment = async (method: "cash" | "qr") => {
    if (cart.length === 0) {
      alert("Giỏ hàng hiện đang trống. Vui lòng thêm sản phẩm vào giỏ hàng.");
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
      totalAmount,
      paymentMethod: method,
    };

    if (method === "cash") {
      createOrder(orderData);
    }

    if (method === "qr") {
      setIsQRModalVisible(true);

      intervalIdRef.current = window.setInterval(async () => {
        const isPaid = await checkPaid(totalAmount);

        if (isPaid) {
          createOrder(orderData);
          closeQRModal();
        }
      }, 2000);
    }
  };

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
          {["BrandA", "BrandB"].map((brand) => (
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
        {/* Product List */}
        <div className="md:col-span-4 p-4 bg-white shadow-lg rounded-md overflow-y-auto">
          <h2 className="text-lg font-bold mb-3">Danh sách sản phẩm</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2 overflow-y-auto max-h-screen">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleAddToCart(product)}
                className="flex flex-col items-center border rounded-lg bg-gray-50 shadow hover:shadow-lg transition duration-300 ease-in-out h-44 w-[100%]"
              >
                <Image
                  src={
                    typeof product.image === "string"
                      ? product.image
                      : undefined
                  }
                  preview={false}
                  alt={product.name}
                  className="object-cover rounded-md mb-1"
                  style={{ width: "100%", height: "90px" }}
                />
                <span className="text-center h-[45px] font-semibold text-gray-700 w-full truncate-2-lines overflow-hidden text-ellipsis line-clamp-2">
                  {product.name}
                </span>
                <span className="text-center font-bold text-blue-600">
                  {product.price.toLocaleString()} VND
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
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
                <option value="Mang di">Mang đi</option>
              </select>
            </span>
          </h2>

          <ul className="max-h-screen overflow-y-auto mb-4 bg-white shadow-lg rounded-lg p-4 flex-grow space-y-2">
            {cart.length === 0 ? (
              <li className="text-center text-gray-500">Giỏ hàng trống</li>
            ) : (
              cart.map((item, index) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center "
                >
                  <div>
                    <div>
                      {index + 1}{" "}
                      <span className="font-bold text-gray-700">
                        {item.name}
                      </span>
                    </div>
                    <div className=" flex text-sm font-semibold text-blue-600 ">
                      <p> SL :</p>
                      <button
                        onClick={() => handleDecreaseQuantity(item.id)}
                        className="mx-7 bg-green-400 px-2 rounded-md text-gray-500 hover:underline"
                      >
                        -
                      </button>
                      {item.quantity}
                      <button
                        onClick={() => handleIncreaseQuantity(item.id)}
                        className="mx-7 bg-green-400 px-2 rounded-md text-gray-500 hover:underline"
                      >
                        +
                      </button>{" "}
                      x {item.price}
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
          </div>
        </div>
      </div>

      <Modal
        title="Thanh toán bằng QR-CODE"
        open={isQRModalVisible}
        onCancel={closeQRModal}
        footer={null}
        width={500}
      >
        <Image src={createVietQR(totalAmount)} preview={true} />
      </Modal>
    </section>
  );
};

export default OrderPage;
