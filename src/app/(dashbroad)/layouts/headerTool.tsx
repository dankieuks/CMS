import LanguageSwitch from "@/components/languageswitch";
import Messenger from "@/components/messenger";
import NotificationSwitch from "@/components/notificationswitch";
import Profile from "@/components/profile";
import ThemeSwitch from "@/components/themeSwitch";
import React from "react";

const HeaderTool = () => {
  return (
    <div className="max-w-[383px] border border-white rounded-3xl py-2 px-10 bg-white">
      <div className="flex items-center justify-between gap-4 ">
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
