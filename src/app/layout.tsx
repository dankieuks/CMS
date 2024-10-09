import { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "@styles/globals.css";
import RecoilContextProvider from "@/shared/providers/recoil.provider";

export const metadata: Metadata = {
  title: "CMS",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={` antialiased`}>
      <body>
        <RecoilContextProvider>{children}</RecoilContextProvider>
      </body>
    </html>
  );
}
