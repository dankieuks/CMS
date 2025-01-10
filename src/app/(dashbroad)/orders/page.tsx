"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { CartItem, Product } from "@/shared/types/product";
import { Image, Modal } from "antd";
import axios from "axios";
import { authState } from "@/shared/store/Atoms/auth";
import { productState, selectedBrandState } from "@/shared/store/Atoms/product";
import { enqueueSnackbar } from "notistack";
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
    }-compact.png?amount=${totalAmount.toString()}&addInfo=${orderId}&accountName=${
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
        enqueueSnackbar("Thanh toán thành công", {
          variant: "success",
          autoHideDuration: 1500,
        });
        return true;
      }

      return false;
    } catch (error) {
      enqueueSnackbar("Xảy ra lỗi khi thanh toán", {
        variant: "warning",
        autoHideDuration: 1500,
      });
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

      enqueueSnackbar("Tạo đơn hàng thành công", {
        variant: "success",
        autoHideDuration: 1500,
      });

      printInvoice(response.data);
    } catch (error) {
      enqueueSnackbar("Xảy ra lỗi khi tạo đơn, vui lòng tạo lại", {
        variant: "error",
        autoHideDuration: 1500,
      });
    }
  };

  const printInvoice = (orderData: any) => {
    const vietnamTime =
      new Date(orderData.createdAt).toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
      }) || "Không xác định";

    const invoiceHTML = `
      <html>
        <head>
          <title>HÓA ĐƠN BÁN HÀNG</title>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              margin: 0;
              padding: 0;
              background-color: #fff;
            }
            .invoice-container {
              width: 220px;
              padding: 10px;
              margin: 0 auto;
              font-size: 12px;
              border: 1px solid #000;
              border-radius: 5px;
              box-shadow: none;
            }
            .invoice-header {
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .invoice-details {
              margin-top: 10px;
              display: flex;
              flex-direction: column;
            }
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 5px;
            }
            .invoice-table th, .invoice-table td {
              padding: 3px 5px;
              border: none;
              text-align: left;
            }
            .invoice-table th {
              font-weight: bold;
            }
            .invoice-table td {
              font-size: 12px;
            }
            .total-amount {
              text-align: center;
              margin-top: 20px;
              font-size: 14px;
              font-weight: bold;
            }
              .info-note{
              float:left;
              margin: 10px 0
              }
            .note {
              font-size: 10px;
              text-align: center;
              margin-top: 10px;
            }
            .item-details {
              display: flex;
              align-items: center;
              flex-direction: row;
            }
            .item-details p {
              margin: 0;
              font-size: 10px;
              padding: 0 5px; 
            }
            .loading-message {
              text-align: center;
              font-size: 16px;
              color: #333;
              margin-top: 20px;
            }
            .invoice-logo {
              max-width: 140px; 
              max-height: 100px;
              object-fit: contain;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
                background-color: #fff;
              }
              .invoice-container {
                box-shadow: none;
                width: 350px;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <!-- Loading message -->
          <div class="loading-message">Đang in hóa đơn...</div>
  
          <div class="invoice-container">
            <div class="invoice-header ">
        <span class="company-name">Coffee Management Store</span>
       <img src="https://firebasestorage.googleapis.com/v0/b/cms-1810c.appspot.com/o/images%2Flogo.png?alt=media&token=9b3b42da-e2a7-4ea5-94b2-76877e83f7cd" alt="CMS Coffee Logo" class="invoice-logo" />
        <span class="company-name">Hóa đơn bán hàng</span>
      </div>
      <hr/>
            <div class="invoice-details">
              <table class="invoice-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Tổng</th>
                  </tr>
                </thead>
               <tbody>
                ${orderData.items
                  .map(
                    (item: any, index: number) => `
                  <tr>
                    <td>${item.productName}
                      <span class="item-details">
                        <p>SL: ${item.quantity}</p> <p>x</p>
                        <p>${item.productPrice.toLocaleString()}</p>
                        <td>${item.total.toLocaleString()} VND</td>
                      </span>
                    </td>
               
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
              </table>
              <hr/>
              <div class="total-amount">
                Tổng cộng: ${orderData.totalAmount.toLocaleString()} VND
              </div>
              <div class="info-note">
                NVBH: ${auth?.user?.name}
                <br />
                Thời gian đặt hàng: ${vietnamTime};
              </div>
              <div class="note">
                Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!
              </div>
            </div>
          </div>
  
          <script>

            window.onload = function() {
             
              setTimeout(function() {
                document.querySelector('.loading-message').style.display = 'none';
                window.print();
              }, 500); 
            }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "", "width=300,height=600");

    if (printWindow) {
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      enqueueSnackbar("In hóa đơn thành công", {
        variant: "success",
        autoHideDuration: 1500,
      });
    } else {
      enqueueSnackbar("Xảy ra lỗi trong quá trình in hóa đơn", {
        variant: "error",
        autoHideDuration: 1500,
      });
    }
  };

  const handlePayment = async (method: "cash" | "qr") => {
    if (cart.length === 0) {
      enqueueSnackbar("Giỏ hàng hiện đang trống.", {
        variant: "info",
        autoHideDuration: 1500,
      });
      return;
    }
    if (!selectedTable) {
      enqueueSnackbar("Vui lòng chọn bàn trước khi thanh toán !", {
        variant: "info",
        autoHideDuration: 1500,
      });
      return;
    }

    const orderData = {
      userId: auth?.user?.id,
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
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
          {["Đồ uống", "Đồ Ăn"].map((brand) => (
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
        <div className="flex flex-col items-start text-left gap-y-2">
          <Image src={createVietQR(totalAmount)} preview={true} />
          <div className="text-lg px-16 font-semibold text-gray-700 mb-2">
            MÃ ĐƠN HÀNG: {orderId}
          </div>
          <div className="text-lg px-16 font-semibold text-gray-700 mb-4">
            HÓA ĐƠN: {totalAmount.toLocaleString()} VND
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default OrderPage;
