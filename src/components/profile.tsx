"use client";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, MenuProps, message, Space } from "antd";
import React from "react";
import Logo from "@public/images/logo.png";

const Profile: React.FC = () => {
  const items: MenuProps["items"] = [
    {
      label: "View Profile",
      key: "1",
      icon: <UserOutlined />,
    },
    {
      label: "Settings",
      key: "2",
      icon: <SettingOutlined />,
    },
    {
      label: "Logout",
      key: "3",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "3") {
      message.success("Successfully logged out.");
    } else {
      message.info(`Clicked on ${e.key}`);
    }
    console.log("click", e);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <div className="flex items-center">
      <Space wrap>
        <Dropdown menu={menuProps} placement="bottom">
          <img
            src={Logo.src}
            alt="Logo"
            className="rounded-full cursor-pointer transition-transform duration-300 hover:scale-110 hover:shadow-lg"
            style={{
              height: "45px",
              width: "45px",
              border: "2px solid #e5e5e9",
            }}
          />
        </Dropdown>
      </Space>
    </div>
  );
};

export default Profile;
