"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Select, Space } from "antd"; // Import Select and Space from Ant Design

const LanguageSwitcher: React.FC = () => {
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
    <div className="flex items-center space-x-4">
      <Space wrap>
        <Select
          value={currentLocale}
          onChange={handleLocaleChange}
          style={{
            width: 80,
            backgroundColor: "transparent",
          }}
          className="w-16 focus:ring-0 focus:outline-none font-semibold text-xl custom-select"
          placeholder="Select language"
        >
          <Select.Option value="en">EN</Select.Option>
          <Select.Option value="vi">VI</Select.Option>
        </Select>
      </Space>
    </div>
  );
};

export default LanguageSwitcher;
