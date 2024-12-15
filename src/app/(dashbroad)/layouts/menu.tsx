import React from "react";
import { Menu, MenuProps } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  DollarOutlined,
  UserOutlined,
  TagOutlined,
  WalletOutlined,
  OrderedListOutlined, // Icon cho 'Orders'
  AppstoreAddOutlined, // Icon cho 'Products'
  TeamOutlined, // Icon cho 'Staff'
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
        icon: <AppstoreOutlined />, // Icon cho Home
      },
      {
        key: "2",
        label: <Link href="/staff">Staff</Link>,
        icon: <TeamOutlined />, // Icon cho Staff
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
        icon: <AppstoreAddOutlined />, // Icon cho Products
      },
      {
        key: "4",
        label: <Link href="/orders">Orders</Link>,
        icon: <OrderedListOutlined />, // Icon cho Orders
      },

      {
        key: "5",
        label: <Link href="/promotions">Promotions</Link>,
        icon: <TagOutlined />, // Icon cho Promotions
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
        icon: <DollarOutlined />, // Icon cho Reports
      },
      {
        key: "7",
        label: <Link href="/salarys">Salaries</Link>,
        icon: <DollarOutlined />, // Icon cho Salaries
      },
      {
        key: "8",
        label: <Link href="/financial-reports">Financial Reports</Link>,
        icon: <WalletOutlined />, // Icon cho Financial Reports
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
      items={items}
      style={{
        minHeight: "100%",
        borderRight: 0,
        backgroundColor: "#e2e8f0",
        overflow: "auto",
        paddingTop: 24,
      }}
      className="custom-menu px-3 text-[18px]"
    />
  );
};

export default SidebarMenu;
