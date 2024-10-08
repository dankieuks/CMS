"use client";
import { AiOutlineDropbox } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BiLogInCircle } from "react-icons/bi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { BiCartDownload } from "react-icons/bi";
import { TbLayoutDashboard } from "react-icons/tb";
import React from "react";
import { Menu } from "antd";
import Link from "next/link";
import { DollarOutlined } from "@ant-design/icons";

interface SidebarMenuProps {
  defaultSelectedKeys?: string[];
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ defaultSelectedKeys }) => {
  const menuItems = [
    {
      key: "1",
      icon: <TbLayoutDashboard style={{ fontSize: "22px" }} />,
      label: "Home",
      path: "/home",
    },
    {
      key: "2",
      icon: <HiOutlineUserGroup style={{ fontSize: "22px" }} />,
      label: "Staff",
      path: "/staff",
    },
    {
      key: "3",
      icon: <AiOutlineDropbox style={{ fontSize: "22px" }} />,
      label: "Product",
      path: "/products",
    },
    {
      key: "4",
      icon: <BiCartDownload style={{ fontSize: "22px" }} />,
      label: "Orders",
      path: "/orders",
    },
    {
      key: "5",
      icon: <HiOutlineDocumentReport style={{ fontSize: "22px" }} />,
      label: "Sales Reports",
      path: "/reports",
    },
    {
      key: "6",
      icon: <DollarOutlined style={{ fontSize: "22px" }} />,
      label: "Salaries",
      path: "/salarys",
    },
    {
      key: "7",
      icon: <BiLogInCircle style={{ fontSize: "22px" }} />,
      label: "Login",
      path: "/login",
    },
  ];
  const items = menuItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: (
      <Link href={item.path} passHref>
        <span className="font-medium">{item.label}</span>
      </Link>
    ),
  }));

  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={defaultSelectedKeys}
      className="bg-slate-200 border-r border-gray-300 min-h-screen text-[18px] px-3"
      items={items}
    />
  );
};

export default SidebarMenu;
