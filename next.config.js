/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export so the site is a plain folder of HTML/CSS/JS that can
  // be hosted on any static host (Vercel, Cloudflare Pages, Netlify, S3, etc.).
  output: "export",
  images: {
    // For static export, optimize images manually or use unoptimized.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // The trailing slash is required for static export on most hosts.
  trailingSlash: true,
};

module.exports = nextConfig;
