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
                    name: 'OnTime Navbat Paneli',
                    short_name: 'OnTime',
                    description: 'Biznes uchun navbat va jadval boshqaruvi',

                    theme_color: '#2563eb',
                    background_color: '#f8fafc',

                    display: 'standalone',

                    start_url: '/',
                    scope: '/',

                    icons: [
                        {
                            src: '/ontime-icon-192.png',
                            sizes: '192x192',
                            type: 'image/png',
                            purpose: 'any'
                        },
                        {
                            src: '/ontime-icon-512.png',
                            sizes: '512x512',
                            type: 'image/png',
                            purpose: 'any maskable'
                        }
                    ]
                },
                devOptions: {
                    enabled: false
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
