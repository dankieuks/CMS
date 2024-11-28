"use client";
import React from "react";

import HeaderTool from "./headerTool";
import { useRecoilValue } from "recoil";
import { authState } from "@/shared/store/Atoms/auth";
import Sidebar from "./sidebar";

const HomeLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const auth = useRecoilValue(authState);
  console.log(auth);
  return (
    <Sidebar>
      <header className="!bg-neutral-200 bg-opacity-45 !px-0 flex justify-between items-center mb-6">
        <h3 className="text-2xl font-light text-typography-100 ml-5">
          Hi, <span className="font-bold">{auth.user?.name}</span>
        </h3>
        <HeaderTool />
      </header>
      {children}
    </Sidebar>
  );
};

export default HomeLayout;
