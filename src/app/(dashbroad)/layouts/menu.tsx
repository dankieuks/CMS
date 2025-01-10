import React from "react";
import { Menu, MenuProps } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  DollarOutlined,
  UserOutlined,
  TagOutlined,
  WalletOutlined,
  OrderedListOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const items: MenuProps["items"] = [
  {
    key: "sub1",
    label: "Dashboard",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "1",
        label: <Link href="/home">Home</Link>,
        icon: <AppstoreOutlined />,
      },
      {
        key: "2",
        label: <Link href="/staff">Staff</Link>,
        icon: <TeamOutlined />,
      },
    ],
  },
  {
    key: "sub2",
    label: "Management",
    icon: <SettingOutlined />,
    children: [
      {
        key: "3",
        label: <Link href="/products">Products</Link>,
        icon: <AppstoreAddOutlined />,
      },
      {
        key: "4",
        label: <Link href="/orders">Orders</Link>,
        icon: <OrderedListOutlined />,
      },

      {
        key: "5",
        label: <Link href="/promotions">Promotions</Link>,
        icon: <TagOutlined />,
      },
    ],
  },
  {
    key: "sub3",
    label: "Reports & Salary",
    icon: <DollarOutlined />,
    children: [
      {
        key: "6",
        label: <Link href="/reports">Reports</Link>,
        icon: <DollarOutlined />,
      },
      {
        key: "7",
        label: <Link href="/salarys">Salaries</Link>,
        icon: <DollarOutlined />,
      },
      {
        key: "8",
        label: <Link href="/financial-reports">Financial Reports</Link>,
        icon: <WalletOutlined />,
      },
    ],
  },
];

interface SidebarMenuProps {
  onMenuClick?: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onMenuClick }) => {
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("Menu item clicked: ", e);
    if (onMenuClick) onMenuClick();
  };

  return (
    <Menu
      onClick={onClick}
      mode="inline"
      defaultOpenKeys={["sub1", "sub2", "sub3"]}
      defaultSelectedKeys={["1"]}
      items={items}
      style={{
        minHeight: "100%",
        borderRight: 0,
        backgroundColor: "#e2e8f0",
        overflow: "auto",
      }}
      className="custom-menu  text-[18px] bg-gradient-to-r from-purple-100 to-blue-200"
    />
  );
};

export default SidebarMenu;
