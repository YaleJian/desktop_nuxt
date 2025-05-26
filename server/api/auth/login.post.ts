import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  // Get runtime config for password
  const config = useRuntimeConfig()
  const { username, password } = await readBody(event)
  
  // Simple authentication - in a real app, you'd use a proper auth system
  if (username === 'admin' && password === config.adminPassword) {
    // Create session token
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15)
    
    // In a real app, you would store this in a database
    // For simplicity, we'll use a cookie
    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === 'production'
    })
    
    return { success: true, user: { username: 'admin' } }
  }
  
  return { success: false, error: '用户名或密码不正确' }
})