export default defineNuxtRouteMiddleware((to) => {
    if (to.path === '/admin') {
        const password = localStorage.getItem('admin-pass')
        if (password !== useRuntimeConfig().adminPassword) {
            return navigateTo('/login')
        }
    }
})
