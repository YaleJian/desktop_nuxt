<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-blue-600">
              网址导航
            </NuxtLink>
          </div>
        </div>
        
        <div class="flex items-center">
          <NuxtLink v-if="auth.isAuthenticated" 
                   to="/admin" 
                   class="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
            管理后台
          </NuxtLink>
          <NuxtLink v-if="!auth.isAuthenticated && !isLoginPage" 
                   to="/login" 
                   class="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
            登录
          </NuxtLink>
          <button v-if="auth.isAuthenticated"
                  @click="handleLogout"
                  class="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600">
            退出
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const auth = useAuth()

const isLoginPage = computed(() => {
  return route.path === '/login'
})

async function handleLogout() {
  const { success } = await auth.logout()
  if (success) {
    router.push('/')
  }
}

// Check auth on component mount
onMounted(() => {
  auth.checkAuth()
})
</script> 