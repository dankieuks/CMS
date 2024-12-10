import { Menu, MenuProps } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  MailOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const items = [
  {
    key: "sub1",
    label: "Dashboard",
    icon: <AppstoreOutlined style={{ fontSize: "22px" }} />,
    children: [
      {
        key: "1",
        label: (
          <Link href="/home">
            <span className="text-gray-700 hover:text-white hover:bg-blue-500 px-4 py-2 rounded-lg transition-all block">
              Home
            </span>
          </Link>
        ),
      },
      {
        key: "2",
        label: (
          <Link href="/staff">
            <span className="text-gray-700 hover:text-white hover:bg-blue-500 px-4 py-2 rounded-lg transition-all block">
              Staff
            </span>
          </Link>
        ),
      },
    ],
  },
  {
    key: "sub2",
    label: "Management",
    icon: <SettingOutlined style={{ fontSize: "22px" }} />,
    children: [
      {
        key: "3",
        label: (
          <Link href="/products">
            <span className="text-gray-700 hover:text-white hover:bg-blue-500 px-4 py-2  transition-all block">
              Product
            </span>
          </Link>
        ),
      },
      {
        key: "4",
        label: (
          <Link href="/orders">
            <span className="text-gray-700 hover:text-white hover:bg-blue-500 px-4 py-2  transition-all block">
              Orders
            </span>
          </Link>
        ),
      },
    ],
  },
  {
    key: "sub3",
    label: "Reports & Salary",
    icon: <DollarOutlined style={{ fontSize: "22px" }} />,
    children: [
      {
        key: "5",
        label: (
          <Link href="/reports">
            <span className="text-gray-700 hover:text-white hover:bg-blue-500 px-4 py-2 transition-all block">
              Reports
            </span>
          </Link>
        ),
      },
      {
        key: "6",
        label: (
          <Link href="/salarys">
            <span className="text-gray-700 hover:text-white hover:bg-blue-500 px-4 py-2  transition-all block">
              Salaries
            </span>
          </Link>
        ),
      },
    ],
  },
];

const SidebarMenu: React.FC = () => {
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  return (
    <Menu
      onClick={onClick}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      items={items}
      className="custom-menu bg-slate-200 border-r border-gray-300 min-h-screen pl-3 text-[20px] "
    />
  );
};

export default SidebarMenu;
