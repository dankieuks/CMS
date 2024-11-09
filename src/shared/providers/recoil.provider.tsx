"use client";
import RootPage from "@/app/page";
import React, { ReactNode } from "react";
import { RecoilRoot } from "recoil";

const RecoilContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <RecoilRoot>
      <RootPage>{children}</RootPage>
    </RecoilRoot>
  );
};

export default RecoilContextProvider;
