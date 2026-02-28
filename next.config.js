/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
            },
        ],
        // Configure image optimization
        minimumCacheTTL: 60,
        formats: ['image/webp', 'image/avif'],
        // Note: quality is now configured via quality attribute in Image component
        unoptimized: false,
    },
}

export default nextConfig
