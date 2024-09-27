import React from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const menuItems = [
  {
    key: "1",
    icon: <UserOutlined />,
    label: "Staff Management",
    path: "/staff",
  },
  {
    key: "2",
    icon: <VideoCameraOutlined />,
    label: "Orders",
    path: "/orders",
  },
  {
    key: "3",
    icon: <FileTextOutlined />,
    label: "Reports",
    path: "/reports",
  },
  {
    key: "4",
    icon: <DollarOutlined />,
    label: "Salaries",
    path: "/salarys",
  },
  {
    key: "5",
    icon: <DollarOutlined />,
    label: "Layouts",
    path: "/layouts",
  },
  {
    key: "5",
    icon: <DollarOutlined />,
    label: "Layouts",
    path: "/layouts",
  },
];

interface SidebarMenuProps {
  defaultSelectedKeys?: string[];
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ defaultSelectedKeys }) => {
  return (
    <Menu
      className="bg-slate-200"
      mode="inline"
      defaultSelectedKeys={defaultSelectedKeys}
    >
      {menuItems.map((item) => (
        <Menu.Item key={item.key} icon={item.icon}>
          <Link href={item.path}>{item.label}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default SidebarMenu;
