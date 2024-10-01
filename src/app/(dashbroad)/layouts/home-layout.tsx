import React from "react";
import Sidebar from "@/app/(dashbroad)/layouts/sidebar";
import HeaderTool from "./headerTool";

const HomeLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <Sidebar>
      <header className="!bg-neutral-200 !px-0 flex justify-between items-center mb-16">
        <h3 className="text-2xl font-light text-typography-100 ml-5">
          Hi, <span className="font-bold">David</span>
        </h3>
        <HeaderTool />
      </header>
      {children}
    </Sidebar>
  );
};

export default HomeLayout;
