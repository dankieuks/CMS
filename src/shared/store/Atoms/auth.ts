import { AuthAtomType } from "@/shared/types/auth";
import { atom } from "recoil";

export const authState = atom<AuthAtomType>({
  key: "authState", // Unique ID for the atom
  default: {
    isLoggedIn: false,
    accessToken: undefined,
    remember: false,
    user: null,
  }, // Default value
  effects: [
    ({ setSelf, onSet }) => {
      // Check if we're in the browser
      if (typeof window !== "undefined") {
        // Load initial state from localStorage or sessionStorage
        const savedAuth =
          localStorage.getItem("authState") ||
          sessionStorage.getItem("authState");

        if (savedAuth) {
          setSelf(JSON.parse(savedAuth));
        }

        // Save to the appropriate storage when authAtom changes
        onSet((newAuth) => {
          const authString = JSON.stringify(newAuth);

          // Check if the user is logged in
          if (newAuth.remember) {
            localStorage.setItem("authState", authString);
          } else {
            // When the user logs out, remove from localStorage
            localStorage.removeItem("authState");
            sessionStorage.setItem("authState", authString);
          }
        });
      }
    },
  ],
});
