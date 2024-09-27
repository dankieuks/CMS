"use client";
import React from "react";

const SalesDataPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sales data</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500">
              Last update time: 2024/09/27 11:39
            </span>
            <div className="flex items-center space-x-2">
              <button className="bg-gray-200 p-2 rounded-md">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 10a4 4 0 018 0 4 4 0 01-8 0zM10 4a6 6 0 100 12 6 6 0 000-12zm0-2a8 8 0 110 16 8 8 0 010-16z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button className="bg-gray-200 p-2 rounded-md">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm4-9a1 1 0 11-2 0V7a1 1 0 012 0v2zM9 7v6a1 1 0 102 0V7a1 1 0 00-2 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="text-gray-500 text-xl mt-4">2024 年 9 月</div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Sales Revenue</h2>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold">$0</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <span>2C</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span>2B</span>
              </div>
            </div>
          </div>
          <p className="text-gray-500 mt-2">Monthly sales revenue till today</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Number of sales transactions
          </h2>
          <span className="text-3xl font-bold">0</span>
          <p className="text-gray-500 mt-2">
            Number of monthly sales transactions till today
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Renewal</h2>
          <span className="text-3xl font-bold">0</span>
          <p className="text-gray-500 mt-2">
            Number of renewals for the current month as of today
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Audition</h2>
          <span className="text-3xl font-bold">1</span>
          <p className="text-gray-500 mt-2">
            The total number of reservations for the current month
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Single quantity</h2>
          <span className="text-3xl font-bold">0</span>
          <p className="text-gray-500 mt-2">
            The current one-time order deadline for the current month
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quantity</h2>
          <span className="text-3xl font-bold">0</span>
          <p className="text-gray-500 mt-2">
            The total out for the current month to this day
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesDataPage;
