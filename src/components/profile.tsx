"use client";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, Image, MenuProps, message, Space } from "antd";
import React, { useEffect } from "react";
import { useLogout } from "@/shared/hooks/auth";
import { useRecoilValue } from "recoil";
import { authState } from "@/shared/store/Atoms/auth";
import { useGetMe } from "@/shared/hooks/user";
import { useRouter } from "next/navigation";

const Profile: React.FC = () => {
  const { logoutUser } = useLogout();
  const auth = useRecoilValue(authState);
  const { getMeData } = useGetMe();
  const router = useRouter();
  useEffect(() => {
    const loadUserData = async () => {
      await getMeData();
    };

    loadUserData();
  }, []);
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
      logoutUser();
      message.success("Successfully logged out.");
    } else if (e.key === "1") {
      router.push(`/staff/${auth.user?.id}`);
    }
    console.log("click", e);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Dropdown menu={menuProps} placement="bottom">
      <Image
        src={typeof auth.user?.image === "string" ? auth.user.image : ""}
        alt="Logo"
        className="rounded-full cursor-pointer  hover:scale-110 hover:shadow-lg"
        preview={false}
        style={{
          height: "50px",
          width: "50px",
          border: "2px solid #e5e5e9",
        }}
      />
    </Dropdown>
  );
};

export default Profile;
