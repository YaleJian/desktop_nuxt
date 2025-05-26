export const useAuth = () => {
    const isAuthenticated = useState('auth:authenticated', () => false)
    const user = useState('auth:user', () => null)

    // Check authentication status
    const checkAuth = async () => {
        try {
            const { data } = await useFetch('/api/auth/check')
            isAuthenticated.value = data.value?.authenticated || false
            if (isAuthenticated.value) {
                user.value = data.value?.user || { username: 'admin' }
            } else {
                user.value = null
            }
        } catch (e) {
            isAuthenticated.value = false
            user.value = null
        }

        return { isAuthenticated: isAuthenticated.value, user: user.value }
    }

    // Login function
    const login = async (username: string, password: string) => {
        try {
            const { data } = await useFetch('/api/auth/login', {
                method: 'POST',
                body: { username, password }
            })

            if (data.value?.success) {
                isAuthenticated.value = true
                user.value = data.value?.user || { username: 'admin' }
                return { success: true, user: user.value }
            } else {
                return { success: false, error: data.value?.error || '登录失败' }
            }
        } catch (e) {
            return { success: false, error: '登录请求失败' }
        }
    }

    // Logout function
    const logout = async () => {
        try {
            await useFetch('/api/auth/logout', { method: 'POST' })
            isAuthenticated.value = false
            user.value = null
            return { success: true }
        } catch (e) {
            console.error('退出登录失败', e)
            return { success: false, error: '退出失败' }
        }
    }

    return {
        isAuthenticated,
        user,
        checkAuth,
        login,
        logout
    }
}