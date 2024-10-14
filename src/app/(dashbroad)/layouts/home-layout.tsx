import React from "react";
import Sidebar from "@/app/(dashbroad)/layouts/sidebar";
import HeaderTool from "./headerTool";

const HomeLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <Sidebar>
      <header className="!bg-neutral-200 bg-opacity-45 !px-0 flex justify-between items-center mb-8">
        <HeaderTool />
      </header>
      {children}
    </Sidebar>
  );
};

export default HomeLayout;
