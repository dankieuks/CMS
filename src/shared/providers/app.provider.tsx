"use client";

import { ReactNode } from "react";

import RootPage from "@/app/page";
import RecoilContextProvider from "./recoil.provider";
import NotificationProvider from "./notification.provider";

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <RecoilContextProvider>
      <NotificationProvider>
        <RootPage>{children}</RootPage>
      </NotificationProvider>
    </RecoilContextProvider>
  );
};
export default AppProviders;
