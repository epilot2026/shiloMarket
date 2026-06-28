import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg'],
            manifest: {
                name: 'ShiloMarket',
                short_name: 'ShiloMarket',
                description: 'Publiez, louez et discutez en toute confiance.',
                lang: 'fr',
                theme_color: '#1FA84D',
                background_color: '#FFFFFF',
                display: 'standalone',
                start_url: '/',
                icons: [
                    { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
                    { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
                ],
            },
        }),
    ],
});
