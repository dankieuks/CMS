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
    label: "Trang chủ",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "1",
        label: <Link href="/home">Trang chủ</Link>,
        icon: <AppstoreOutlined />,
      },

      {
        key: "2",
        label: <Link href="/orders">Tạo đơn hàng</Link>,
        icon: <OrderedListOutlined />,
      },
    ],
  },
  {
    key: "sub2",
    label: "Quản lý cửa hàng",
    icon: <SettingOutlined />,
    children: [
      {
        key: "3",
        label: <Link href="/staff">Quản lý nhân viên</Link>,
        icon: <TeamOutlined />,
      },
      {
        key: "4",
        label: <Link href="/products">Quản lý sản phẩm</Link>,
        icon: <AppstoreAddOutlined />,
      },
      {
        key: "7",
        label: <Link href="/salarys">Lương</Link>,
        icon: <DollarOutlined />,
      },
    ],
  },
  {
    key: "sub3",
    label: "Lịch trình ",
    icon: <DollarOutlined />,
    children: [
      {
        key: "6",
        label: <Link href="/workschedules">Lịch làm việc</Link>,
        icon: <DollarOutlined />,
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
