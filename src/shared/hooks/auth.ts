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
      const decodedToken = jwtDecode<{ exp: number }>(accessToken);

      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        throw new Error("Token has expired");
      }

      setAuth({
        isLoggedIn: true,
        user: jwtDecode(accessToken),
        accessToken,
        remember: true,
      });
      enqueueSnackbar("Login successful", {
        variant: "success",
        autoHideDuration: 1500,
      });
      localStorage.setItem("authToken", accessToken);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logoutUser = () => {
    setAuth({
      isLoggedIn: false,
      user: null,
      accessToken: undefined,
      remember: false,
    });
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return { loginUser, logoutUser, auth };
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
    router.push("/login");
  };

  return { logoutUser };
};
