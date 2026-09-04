import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [
            vue(),
            tailwindcss(),
            VitePWA({
                registerType: 'autoUpdate',

                manifest: {
                    id: '/',
                    name: 'OnTime Navbat',
                    short_name: 'Navbat',
                    description: 'Mijozlar uchun navbat va bron qilish ilovasi',
                    lang: 'uz',

                    theme_color: '#0d9488',
                    background_color: '#f0fdfa',

                    display: 'standalone',

                    start_url: '/',
                    scope: '/',

                    icons: [
                        {
                            src: '/ontime-navbat-icon-192.png',
                            sizes: '192x192',
                            type: 'image/png',
                            purpose: 'any'
                        },
                        {
                            src: '/ontime-navbat-icon-512.png',
                            sizes: '512x512',
                            type: 'image/png',
                            purpose: 'any maskable'
                        }
                    ]
                },
                devOptions: {
                    enabled: true
                }
            })
        ],

        resolve: {
            alias: {
                "@": resolve(__dirname, "src"),
            }
        },
        server: {
            port: 5175,
            proxy: {
                '/api': {
                    target: env.VITE_BASE_API,
                    changeOrigin: true,
                },
                '/uploads': {
                    target: env.VITE_BASE_API,
                    changeOrigin: true,
                },
            }
        },
        preview: {
            port: 5175,
        },
    }
})
