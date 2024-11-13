import createNextIntlPlugin from "next-intl/plugin";
import dotenv from "dotenv";

dotenv.config();
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
};

export default withNextIntl(nextConfig);
