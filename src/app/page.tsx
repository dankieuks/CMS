"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/shared/utils/tokenExpired";
import { authState } from "@/shared/store/Atoms/auth";
import LoadingPage from "@/components/loading";

function useTokenCheck() {
  const auth = useRecoilValue(authState);
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      const token = auth?.accessToken || localStorage.getItem("authToken");
      if (token) {
        if (isTokenExpired(token)) {
          localStorage.removeItem("authToken");
          router.replace("/login");
        } else {
          router.replace("/home");
        }
      } else {
        router.replace("/login");
      }
    };

    checkToken();
  }, [auth, router]);
}

export default function RootPage({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  useTokenCheck();

  useEffect(() => {
    setTimeout(() => setLoading(false), 300);
  }, []);

  return loading ? <LoadingPage /> : <>{children}</>;
}
