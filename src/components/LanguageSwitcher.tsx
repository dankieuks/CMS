"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Select } from "antd"; // Import Select từ Ant Design

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<string>("en");

  useEffect(() => {
    // Get language from localStorage on mount
    const savedLocale = localStorage.getItem("language") || "en";
    setCurrentLocale(savedLocale);
    document.cookie = `language=${savedLocale}; path=/`; // Set cookie for the language
  }, []);

  const handleLocaleChange = (locale: string) => {
    // Update localStorage and cookie when the language changes
    localStorage.setItem("language", locale);
    document.cookie = `language=${locale}; path=/`; // Update the cookie
    setCurrentLocale(locale);
    router.push(`/${locale}${pathname === "/" ? "" : pathname.slice(3)}`);
  };

  return (
    <Select
      value={currentLocale}
      onChange={handleLocaleChange}
      style={{ width: 80 }}
      placeholder="Select language"
    >
      <Select.Option value="en">En</Select.Option>
      <Select.Option value="vi">Vi</Select.Option>
    </Select>
  );
}
