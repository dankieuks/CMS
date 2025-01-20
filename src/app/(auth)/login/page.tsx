"use client";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import React, { useState } from "react";
import { useLogin } from "@/shared/hooks/auth";
import Image from "next/image";
import Logo from "@public/images/logo.png";
import { useRouter } from "next/navigation";
import { AiFillEye } from "react-icons/ai";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = useLogin();
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await loginUser({ email, password });

    if (success) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  };

  return (
    <div
      className="p-8 md:p-0 flex items-center justify-center h-screen bg-gray-100 "
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundImage:
          "url('https://png.pngtree.com/thumb_back/fh260/back_our/20190620/ourmid/pngtree-coffee-shop-poster-background-material-image_155518.jpg')",
      }}
    >
      <div
        className=" grid grid-cols-1 lg:grid-cols-4 bg-indigo-100 p-2 md:p-8 rounded-3xl shadow-md"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="col-span-2 bg-transparent">
          <Image src={Logo} alt="Logo" />
          <h1 className="text-2xl font-bold text-gray-700 text-center hidden md:block mb-8">
            Hệ thống quản lý cửa hàng cà phê
          </h1>
        </div>
        <div className="col-span-2 p-6">
          <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">
            Đăng nhập
          </h2>
          <form onSubmit={handleLogin} className="text-xl">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full  text-xl p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 !text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6 relative">
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold mb-2"
              >
                Mật khẩu
              </label>
              <input
                type={showPassword ? "text" : "password"} 
                id="password"
                className="w-full text-xl p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 bottom-2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)} 
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="text-gray-500" size={20} />
                ) : (
                  <AiFillEye className="text-gray-500" size={20} />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition duration-300"
            >
              Đăng nhập
            </button>
          </form>
          <div className="text-center mt-4">
            <a
              href="/forgot-password"
              className="text-indigo-500 underline text-lg font-semibold"
            >
              Quên mật khẩu?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
