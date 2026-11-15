import type { NextConfig } from "next";

const basePath = process.env.BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  transpilePackages: ["@education-togo/shared"],
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
