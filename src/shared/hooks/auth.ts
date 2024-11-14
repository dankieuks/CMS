import { jwtDecode } from "jwt-decode";
import { useRecoilState } from "recoil";
import { authState } from "../store/Atoms/auth";
import axios from "axios";
import { ILoginRequest } from "../types/auth";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

export const useLogin = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const router = useRouter();

  const loginUser = async (loginRequest: ILoginRequest) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        loginRequest
      );

      const { accessToken } = response.data;
      const loginTime = Date.now();
      localStorage.setItem("loginTime", loginTime.toString());
      console.log(loginTime);
      setAuth({
        isLoggedIn: true,
        user: jwtDecode(accessToken),
        accessToken,
        remember: false,
      });
      enqueueSnackbar("Login successful", {
        variant: "success",
        autoHideDuration: 1500,
      });
      localStorage.setItem("authToken", accessToken);
      return true;
    } catch (error) {
      enqueueSnackbar("Login faled", {
        variant: "error",
        autoHideDuration: 1500,
      });
      return false;
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
      accessToken: undefined,
      remember: false,
    });
    localStorage.removeItem("authToken");
    enqueueSnackbar("LoginOut successful", {
      variant: "success",
      autoHideDuration: 1500,
    });
    router.replace("/login");
  };

  return { logoutUser };
};
