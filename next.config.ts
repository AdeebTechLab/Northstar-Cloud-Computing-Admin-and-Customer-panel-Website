import type { NextConfig } from "next";

/**
 * NEXT_STATIC_EXPORT=1 builds a static copy into /out (used for the hosted preview).
 * Normal `npm run dev` / `npm run build` keep the regular Next.js server.
 */
const isStaticExport = process.env.NEXT_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isStaticExport
    ? { output: "export", trailingSlash: true, images: { unoptimized: true } }
    : {}),
};

export default nextConfig;
