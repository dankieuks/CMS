"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useRecoilValue } from "recoil";
import { authState } from "@/shared/store/Atoms/auth";

const RootPage = ({ children }: { children: React.ReactNode }) => {
  const auth = useRecoilValue(authState); // Get auth state from Recoil
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      if (pathname !== "/login") {
        router.replace("/login");
      }
      setIsLoading(false);
      return;
    }

    if (pathname === "/login" || pathname === "/") {
      router.replace("/home");
      setIsLoading(true);
      return;
    }

    if (auth.user) {
      if (
        auth.user.role === "STAFF" &&
        !["/home", "/products", "/orders", "/reports"].includes(pathname)
      ) {
        router.replace("/not-authorized");
        setIsLoading(false);
      } else if (auth.user.role === "ADMIN") {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [auth, pathname, router]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="loader mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải, vui lòng đợi...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RootPage;
