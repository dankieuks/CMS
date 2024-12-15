"use client";
import React, { useState, useEffect } from "react";
import { Breadcrumb, Layout, Button, Drawer } from "antd";
import {
  MenuOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
} from "@ant-design/icons";
import SidebarMenu from "./menu";
import logo from "@public/images/logo.png";
import Image from "next/image";
import Profile from "@/components/profile";

const { Header, Sider, Content, Footer } = Layout;

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            height: "64px", // Đặt chiều cao cố định
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            color: "white",
            backgroundColor: "blueviolet",
          }}
        >
          <Button
            icon={<MenuOutlined style={{ fontSize: "30px" }} />}
            onClick={() => setDrawerVisible(true)}
            type="text"
          />

          <div>
            <Image src={logo} alt="Logo" width={100} height={50} />
          </div>

          <Profile />
        </Header>

        <Drawer
          title={
            <Image
              src={logo}
              alt="Logo"
              width={100}
              height={90}
              style={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                justifyContent: "center",
              }}
            />
          }
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={270}
          style={{ backgroundColor: "#e2e8f0" }}
        >
          <SidebarMenu onMenuClick={() => setDrawerVisible(false)} />
        </Drawer>

        <Content style={{ padding: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>{}</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 380, background: "#fff" }}>
            {children}
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Product {new Date().getFullYear()} By Kieu Dinh Dan
        </Footer>
      </Layout>
    );
  }

  return (
    <Layout className="!min-h-screen relative ">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={300}
        className="bg-slate-200 relative"
        style={{ position: "fixed", height: "100vh" }}
      >
        <div className="flex items-center justify-center p-4">
          <Image src={logo} alt="Logo" />
        </div>
        <Button
          type="text"
          icon={
            collapsed ? (
              <DoubleRightOutlined style={{ fontSize: "22px" }} />
            ) : (
              <DoubleLeftOutlined style={{ fontSize: "22px" }} />
            )
          }
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-5 right-[-30px] !text-blue-600"
        />
        <SidebarMenu />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 300 }}>
        <Content
          className="!bg-transparent p-5"
          style={{
            height: "100vh",
            overflowY: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
