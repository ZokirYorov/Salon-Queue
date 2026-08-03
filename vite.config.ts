import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [
            vue(),
            tailwindcss()
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
        }
    }
})
