import DateTime from "@/components/dateTime";
import LanguageSwitch from "@/components/languageswitch";
import Messenger from "@/components/messenger";
import NotificationSwitch from "@/components/notificationswitch";
import Profile from "@/components/profile";
import ThemeSwitch from "@/components/themeSwitch";
import React from "react";

const HeaderTool = () => {
  return (
    <div className="opacity-100 border border-white rounded-3xl py-1 px-10 !bg-white dark dark:bg-red-300">
      <div className="hidden md:flex items-center justify-between gap-4 ">
        <DateTime />
        <ThemeSwitch />
        <NotificationSwitch />
        <Messenger />
        <LanguageSwitch />
        <Profile />
      </div>
    </div>
  );
};

export default HeaderTool;
