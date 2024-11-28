import createNextIntlPlugin from "next-intl/plugin";
import dotenv from "dotenv";

dotenv.config();
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  reactStrictMode: false,
};

export default withNextIntl(nextConfig);
