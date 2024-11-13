"use client";

import { ReactNode } from "react";
import RecoilContextProvider from "./recoil-context.provider";
import NotificationProvider from "./notification-stack.provider";
import ProgressBarProvider from "./progress-bar.provider";
import RootPage from "@/app/[locale]/page";

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <RecoilContextProvider>
      <NotificationProvider>
        <ProgressBarProvider>
          <RootPage>{children}</RootPage>
        </ProgressBarProvider>
      </NotificationProvider>
    </RecoilContextProvider>
  );
};
export default AppProviders;
