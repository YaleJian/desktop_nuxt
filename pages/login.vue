<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
      <h2 class="text-center text-3xl font-bold mb-6">管理员登录</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">用户名</label>
          <input type="text" v-model="username" class="w-full p-2 border rounded" required>
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 mb-2">密码</label>
          <input type="password" v-model="password" class="w-full p-2 border rounded" required>
        </div>
        
        <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
        
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const auth = useAuth()

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    const result = await auth.login(username.value, password.value)
    
    if (result.success) {
      router.push('/admin')
    } else {
      error.value = result.error || '登录失败'
    }
  } catch (e) {
    error.value = '请求失败'
  } finally {
    loading.value = false
  }
}
</script>
