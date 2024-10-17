import { Employees } from "@/shared/types/user";
import { atom } from "recoil";
export const authState = atom<{
  isLoggedIn: boolean;
  user: Employees | null;
  accessToken: string | null;
}>({
  key: "authState",
  default: {
    isLoggedIn: false,
    user: null,
    accessToken: null,
  },
});
