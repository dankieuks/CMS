import { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "../styles/globals.css";
import RecoilContextProvider from "@/shared/providers/recoil.provider";
const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "CMS",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${workSans.className} antialiased`}>
      <body      >
        <RecoilContextProvider>{children}</RecoilContextProvider>
      </body>
    </html>
  );
}
