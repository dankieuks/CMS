"use client";

import { authState } from "@/shared/store/Atoms/auth";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useRecoilValue } from "recoil";

const RootPage = () => {
  const auth = useRecoilValue(authState);
  const router = useRouter();
  useEffect(() => {
    if (auth?.isLoggedIn && auth.accessToken) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [auth, router]);

  return null;
};

export default RootPage;
