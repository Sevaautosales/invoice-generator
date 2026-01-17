import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Seva Auto Sales',
        short_name: 'SAS Invoice',
        description: 'Professional invoice management for Seva Auto Sales',
        start_url: '/',
        display: 'standalone',
        background_color: '#f8fafc',
        theme_color: '#0EA5E9',
        icons: [
            {
                src: '/logo.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/logo.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    }
}
