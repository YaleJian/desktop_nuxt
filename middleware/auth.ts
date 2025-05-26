export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware if not going to admin page
  if (!to.path.startsWith('/admin')) {
    return
  }
  
  const { data: authCheck } = await useFetch('/api/auth/check')
  
  // Redirect to login if not authenticated
  if (!authCheck.value?.authenticated) {
    return navigateTo('/login')
  }
}) 