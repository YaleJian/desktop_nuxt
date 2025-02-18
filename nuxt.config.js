// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss'],
    tailwindcss: {
        config: {
            theme: {
                extend: {
                    animation: {
                        'fade-in': 'fadeIn 0.3s ease-out',
                    },
                    keyframes: {
                        fadeIn: {
                            '0%': {opacity: '0', transform: 'translateY(10px)'},
                            '100%': {opacity: '1', transform: 'translateY(0)'},
                        }
                    }
                }
            }
        }
    },
    runtimeConfig: {
        // 管理路径保护
        adminPath: '/admin',
        // 简单密码保护（可选）
        adminPassword: process.env.ADMIN_PASSWORD
    },
    routeRules: {
        '/admin': { ssr: false } // 客户端渲染管理页面
    },
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true}
})
