"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Select, Space } from "antd";

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<string>("en");

  useEffect(() => {
    // Lấy ngôn ngữ từ localStorage, mặc định là 'en' nếu không có
    const savedLocale = localStorage.getItem("language") || "en";
    setCurrentLocale(savedLocale);
    document.cookie = `language=${savedLocale}; path=/`;
  }, []);

  const handleLocaleChange = (locale: string) => {
    // Cập nhật localStorage và cookie với ngôn ngữ mới
    localStorage.setItem("language", locale);
    document.cookie = `language=${locale}; path=/`;

    // Cập nhật lại đường dẫn với ngôn ngữ mới
    const newPathname = pathname.replace(`/${currentLocale}`, `/${locale}`);

    // Thực hiện thay thế đường dẫn với locale mới
    setCurrentLocale(locale);
    router.replace(newPathname); // Dùng replace để thay thế URL
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
