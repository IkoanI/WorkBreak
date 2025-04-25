import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
            },

            {
                protocol: 'https',
                hostname: 'workbreak.pythonanywhere.com',
            },

            {
                protocol: 'http',
                hostname: 'places.googleapis.com',
            },
        ],
    }
};
export default nextConfig;
