/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // The embedded Sanity Studio pulls in the "sanity" package, whose name
  // collides with the "@sanity/*" scope in webpack's dev vendor-chunk
  // naming and breaks chunk resolution. Keeping it external sidesteps that.
  experimental: {
    serverComponentsExternalPackages: ["sanity"],
  },
};

module.exports = nextConfig
