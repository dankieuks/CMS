import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend"; // Để load file JSON
import LanguageDetector from "i18next-browser-languagedetector"; // Để phát hiện ngôn ngữ

i18n
  .use(Backend) // Sử dụng backend để load ngôn ngữ
  .use(LanguageDetector) // Phát hiện ngôn ngữ của trình duyệt
  .use(initReactI18next) // Kết nối với React
  .init({
    fallbackLng: "en", // Ngôn ngữ mặc định
    debug: true, // Bật debug trong quá trình phát triển
    interpolation: {
      escapeValue: false, // React đã tự escape, không cần escape giá trị
    },
  });

export default i18n;
