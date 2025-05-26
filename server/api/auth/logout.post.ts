export default defineEventHandler((event) => {
  // Clear auth cookie
  deleteCookie(event, 'auth_token', {
    path: '/',
    httpOnly: true
  })
  
  return { success: true }
}) 