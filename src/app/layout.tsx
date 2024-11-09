// root.layout.tsx
"use client";

import "@styles/globals.css";
import RecoilContextProvider from "@/shared/providers/recoil.provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body>
        <RecoilContextProvider>{children}</RecoilContextProvider>
      </body>
    </html>
  );
}
