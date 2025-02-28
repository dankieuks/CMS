import React from "react";
import { Menu, MenuProps } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  DollarOutlined,
  OrderedListOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Link from "next/link";

interface SidebarMenuProps {
  onMenuClick?: () => void;
  role: string;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onMenuClick, role }) => {
  const iconStyle = { fontSize: "24px" }; // Điều chỉnh kích thước icon

  const items: MenuProps["items"] = [
    {
      key: "sub1",
      label: "Trang chủ",
      icon: <AppstoreOutlined style={iconStyle} />,
      children: [
        {
          key: "2",
          label: <Link href="/orders">Tạo đơn hàng</Link>,
          icon: <OrderedListOutlined style={iconStyle} />,
        },
      ],
    },
    ...(role === "ADMIN"
      ? [
          {
            key: "sub2",
            label: "Quản lý cửa hàng",
            icon: <SettingOutlined style={iconStyle} />,
            children: [
              {
                key: "1",
                label: <Link href="/home">Quản lý kinh doanh</Link>,
                icon: <AppstoreOutlined style={iconStyle} />,
              },
              {
                key: "3",
                label: <Link href="/staff">Quản lý nhân viên</Link>,
                icon: <TeamOutlined style={iconStyle} />,
              },
              {
                key: "4",
                label: <Link href="/products">Quản lý sản phẩm</Link>,
                icon: <AppstoreAddOutlined style={iconStyle} />,
              },
              {
                key: "7",
                label: <Link href="/salarys">Quản lý lương</Link>,
                icon: <DollarOutlined style={iconStyle} />,
              },
              {
                key: "8",
                label: <Link href="/inventory">Quản lý kho</Link>,
                icon: <DollarOutlined style={iconStyle} />,
              },
            ],
          },
        ]
      : []),
    {
      key: "sub3",
      label: "Lịch trình ",
      icon: <DollarOutlined style={iconStyle} />,
      children: [
        {
          key: "6",
          label: <Link href="/workschedules">Lịch làm việc</Link>,
          icon: <DollarOutlined style={iconStyle} />,
        },
      ],
    },
  ];

  return (
    <Menu
      onClick={(e) => {
        console.log("Menu item clicked: ", e);
        if (onMenuClick) onMenuClick();
      }}
      mode="inline"
      defaultOpenKeys={["sub1", "sub2", "sub3"]}
      defaultSelectedKeys={["2"]}
      items={items}
      style={{
        minHeight: "100%",
        borderRight: 0,
        backgroundColor: "#e2e8f0",
        overflow: "auto",
      }}
      className="custom-menu text-[20px] bg-gradient-to-r from-purple-100 to-blue-200"
    />
  );
};

export default SidebarMenu;
