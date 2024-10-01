"use client";
import { GlobalOutlined } from "@ant-design/icons";
import { Select, Space } from "antd";
import React, { useState } from "react";

const LanguageSwitch: React.FC = () => {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <div className="flex items-center space-x-4">
      <GlobalOutlined style={{ fontSize: "22px", color: "#08c" }} />
      <Space wrap>
        <Select
          defaultValue="VN"
          className="w-16 focus:ring-0 focus:outline-none font-semibold text-xl custom-select"
          variant="borderless"
          style={{
            backgroundColor: "transparent",
          }}
          onChange={handleChange}
          options={[
            { value: "VN", label: "VN" },
            { value: "EN", label: "EN" },
          ]}
        />
      </Space>
    </div>
  );
};

export default LanguageSwitch;
