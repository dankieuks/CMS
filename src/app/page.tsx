"use client";

import Link from "next/link";

const RootPage = () => {
  return (
    <div className="flex min-h-screen">
      <Link href="/home">dashbroad</Link>
      <Link href="/login">Dang nhap</Link>
    </div>
  );
};

export default RootPage;
