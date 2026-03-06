import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
        root: __dirname,
    },
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
