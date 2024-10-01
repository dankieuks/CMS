"use client";
import Image from "next/image";
import Logo from "@public/images/logo.png";
import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <div
      className="flex items-center justify-center h-screen bg-gray-100 "
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundImage:
          "url('https://e0.pxfuel.com/wallpapers/829/919/desktop-wallpaper-for-laptop-moody-dark-blue-purple-sad.jpg')",
      }}
    >
      <div className=" grid grid-cols-1 lg:grid-cols-4 bg-white p-8 rounded-lg shadow-md">
        <div className="col-span-2 bg-white ">
          <Image src={Logo} alt="Logo" />
          <h1 className="text-2xl font-bold text-center mb-8">
            Welcome to Your Admin Panel
          </h1>
        </div>
        <div className="col-span-2 p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          <form>
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
