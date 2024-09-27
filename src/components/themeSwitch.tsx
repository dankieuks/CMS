"use client";
import React, { useState } from "react";
import { Switch } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

const ThemeSwitch = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = (checked: boolean) => {
    setIsDarkMode(checked);
    document.body.classList.toggle("dark", checked);
  };

  return (
    <div className="flex items-center">
      <Switch
        checkedChildren={<MoonOutlined />}
        unCheckedChildren={<SunOutlined />}
        checked={isDarkMode}
        onChange={toggleTheme}
        className="theme-switch"
      />
    </div>
  );
};

export default ThemeSwitch;
