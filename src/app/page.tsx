"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useRouter, usePathname } from "next/navigation";
import { isTokenExpired } from "@/shared/utils/tokenExpired";
import { authState } from "@/shared/store/Atoms/auth";
import LoadingPage from "@/components/loading";

function useTokenCheck(): boolean {
  const auth = useRecoilValue(authState);
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const guestPaths = ["/login", "/forgot-password", "/reset-password"];
    const token = auth?.accessToken || localStorage.getItem("authToken");

    const checkToken = async () => {
      if (pathname === "/") {
        router.replace("/orders");
        return;
      }

      if (token && !isTokenExpired(token) && guestPaths.includes(pathname)) {
        router.push("/orders");
        return;
      }

      if ((!token || isTokenExpired(token)) && !guestPaths.includes(pathname)) {
        localStorage.removeItem("authToken");
        router.replace("/login");
      }
    };

    checkToken().finally(() => setIsChecking(false));
  }, [auth, router, pathname]);

  return isChecking;
}

export default function RootPage({ children }: { children: ReactNode }) {
  const isChecking = useTokenCheck();

  return isChecking ? <LoadingPage /> : <>{children}</>;
}
