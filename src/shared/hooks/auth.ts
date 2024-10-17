import { useRecoilState } from "recoil";
import { authState } from "../store/Atoms/auth";
import { useState } from "react";
import axios from "axios";
import { ILoginRequest } from "../types/auth";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const [auth, setAuth] = useRecoilState(authState);

  const loginUser = async (loginRequest: ILoginRequest) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        loginRequest
      );
      console.log(response.data.data);
      const { accessToken, id, name, email } = response.data.data;

      setAuth({
        isLoggedIn: true,
        user: { id, name, email },
        accessToken,
      });
      console.log(auth.user?.email);
      console.log(auth.accessToken);
      localStorage.setItem("authToken", accessToken);
      return true;
    } catch (error) {
      console.error("Login faile");
    }
  };
  return { loginUser, auth };
};
export const useLogout = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const router = useRouter();

  const logoutUser = () => {
    setAuth({
      isLoggedIn: false,
      user: null,
      accessToken: null,
    });
    localStorage.removeItem("authToken");

    router.push("/login");
  };

  return { logoutUser };
};
