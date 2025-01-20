import { AuthAtomType } from "@/shared/types/auth";
import { atom } from "recoil";

export const authState = atom<AuthAtomType>({
  key: "authState",
  default: {
    isLoggedIn: false,
    user: null,
    accessToken: undefined,
  },
});
export const emailAtom = atom<string>({
  key: "emailState",
  default: "",
});
