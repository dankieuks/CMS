// "use client";
// import React, { useState } from "react";
// import { useRecoilState } from "recoil";
// import {
//   cartState,
//   searchTermState,
//   selectedBrandState,
//   selectedTableState,
// } from "@/shared/store/Atoms/product";
// import ProductList from "./ProductList";
// import Cart from "./Cart";
// import SearchBar from "./SearchBar";

// import { Product } from "@/shared/types/product";

// const products: Product[] = [
//   {
//     id: 1,
//     name: "Anna Melody Mark Hi Hid",
//     price: 30000,
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx7z8OLea_Su5Rju8QFwS9eXSutHkqQ66GKg&s",
//     brand: "Coca-Cola", // Thương hiệu
//   },
//   {
//     id: 2,
//     name: "Bella",
//     price: 30000,
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxLkT7moPARzeQ21Q3JFhoARF-m3COjrtU0g&s",
//     brand: "Pepsi", // Thương hiệu
//   },
//   {
//     id: 3,
//     name: "Chloe",
//     price: 30000,
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdQHOC-AYakD0LnDL75zoLyfV3umld0KDyOA&s",
//     brand: "Fanta", // Thương hiệu
//   },
//   {
//     id: 4,
//     name: "Diana",
//     price: 30000,
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNaosiocCMIx_w8MdlmGOgEjOyAMd8BdOU4A&s",
//     brand: "Coca-Cola", // Thương hiệu
//   },
//   {
//     id: 5,
//     name: "Eva",
//     price: 30000,
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqAmhu7EhD0O24wY2ix9c3JNEzTynjsV2YMw&s",
//     brand: "Pepsi", // Thương hiệu
//   },
// ];

// const OrderPage: React.FC = () => {
//   const [cart, setCart] = useRecoilState(cartState);
//   const [searchTerm, setSearchTerm] = useRecoilState(searchTermState);
//   const [selectedTable, setSelectedTable] = useRecoilState(selectedTableState);
//   const [selectedBrand, setSelectedBrand] = useRecoilState(selectedBrandState);
//   const [showQRCode, setShowQRCode] = useState<boolean>(false);
//   const brands = ["Coca-Cola", "Pepsi", "Fanta"];

//   const handleAddToCart = (product: Product) => {
//     setCart((prevCart) => [...prevCart, product]);
//   };

//   const handleRemoveFromCart = (productId: number) => {
//     setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
//   };

//   const filteredProducts = products.filter((product) => {
//     const matchesSearchTerm = product.name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
//     return matchesSearchTerm && matchesBrand;
//   });

//   const handleCheckout = () => {
//     alert(`Thanh toán bàn ${selectedTable}`);
//     setShowQRCode(true);
//   };

//   const handlePrintBill = () => {
//     alert("In Bill");
//   };

//   const getQRCodeValue = () => {
//     return `Bàn: ${selectedTable} - Tổng: ${cart
//       .reduce((total, item) => total + item.price, 0)
//       .toLocaleString()} VND`;
//   };

//   return (
//     <div className="grid grid-cols-3 gap-4">
//       <div className="col-span-3">
//         <SearchBar
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           selectedBrand={selectedBrand}
//           setSelectedBrand={setSelectedBrand}
//           brands={brands}
//         />
//       </div>
//       <ProductList
//         products={filteredProducts}
//         handleAddToCart={handleAddToCart}
//       />
//       <Cart
//         cart={cart}
//         handleRemoveFromCart={handleRemoveFromCart}
//         handleCheckout={handleCheckout}
//         handlePrintBill={handlePrintBill}
//         selectedTable={selectedTable}
//         setSelectedTable={setSelectedTable}
//         showQRCode={showQRCode}
//         getQRCodeValue={getQRCodeValue}
//       />
//     </div>
//   );
// };

// export default OrderPage;
