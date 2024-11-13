"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/shared/utils/tokenExpired";
import { authState } from "@/shared/store/Atoms/auth";

export default function RootPage({ children }: { children: ReactNode }) {
  const auth = useRecoilValue(authState);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirectToLoginOrHome = () => {
      if (auth?.accessToken) {
        if (isTokenExpired(auth.accessToken)) {
          localStorage.removeItem("authState");
          router.replace("/login");
        } else {
          router.replace("/home");
        }
      } else {
        router.replace("/login");
      }
    };

    redirectToLoginOrHome();
    setLoading(false);
  }, [auth, router]);

 
  return loading ? <div>Loading...</div> : <div>{children}</div>;
}
