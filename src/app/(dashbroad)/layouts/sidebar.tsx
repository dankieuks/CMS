"use client";
import React, { useState } from "react";
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";
import SidebarMenu from "./menu";
import logo from "@public/images/logo.png";
import Image from "next/image";
const { Header, Sider, Content } = Layout;

const Sidebar = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="!min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={300}
        className="bg-slate-200 relative"
      >
        <div className="flex ">
          <Image src={logo} alt="" />
          <Button
            type="text"
            icon={
              collapsed ? (
                <DoubleLeftOutlined style={{ fontSize: "22px" }} />
              ) : (
                <DoubleRightOutlined style={{ fontSize: "22px" }} />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "24px",
              backgroundColor: "transparent",
            }}
            className="absolute top-7 right-[-30px] !text-blue-600"
          />
        </div>
        <SidebarMenu />
      </Sider>
      <Layout className="!bg-neutral-200">
        <Content className="!bg-transparent  p-5">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
