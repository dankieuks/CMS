"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/shared/utils/tokenExpried";
import { authState } from "@/shared/store/Atoms/auth";


export default function RootPage({ children }: { children: ReactNode }) {
  const auth = useRecoilValue(authState);
  const router = useRouter();

  useEffect(() => {
    if (auth?.isLoggedIn) {
      if (isTokenExpired(auth?.accessToken)) {
        localStorage.removeItem("authState");
        router.replace("/login");
        
      } else {
        router.replace("/home");
      }
    } else {
      router.replace("/login");
    }
  }, [auth, router]);

  return <div>{children}</div>;
}
