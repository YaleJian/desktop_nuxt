<template>
  <div v-if="pending" class="text-center p-20">
    <p class="text-gray-500">加载中...</p>
  </div>
  
  <div v-else>
    <div class="text-center p-8">
      <h1 class="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
        {{navData.title}}
      </h1>
      <p class="text-gray-500 text-lg font-light">
        {{navData.description}}
      </p>
    </div>

    <main class="p-8">
      <div class="max-w-7xl mx-auto">
        <NavSearch v-model="searchQuery" />

        <template v-if="filteredCategories.length">
          <CategoryCard
              v-for="(category,index) in filteredCategories"
              :key="category.name"
              :category="category"
              class="transition-transform duration-500 hover:translate-y-[-10px]"
              :style="`transform: translateY(${index * 2}px)`"
          />
        </template>

        <div v-else class="text-center py-20 bg-white/50 rounded-2xl
                        backdrop-blur border border-gray-100
                        shadow-sm">
          <div class="text-gray-400 mb-4">🔍</div>
          <p class="text-gray-500 font-medium">没有找到匹配的资源</p>
          <p class="text-sm text-gray-400 mt-2">试试其他关键词？</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const pending = ref(true)
const navData = ref({
  title: '',
  description: '',
  categories: []
})

// 加载数据
const { data: apiData, error: apiError } = await useFetch('/api/links', {
  key: 'nav-data',
  server: true, // 允许在服务器端渲染时预取
  lazy: false, // 不延迟加载
  immediate: true // 立即获取
})

// 监听数据变化
watch(apiData, (newData) => {
  if (newData) {
    navData.value = newData
    pending.value = false
  }
}, { immediate: true }) // 立即执行一次

// 如果有错误，记录错误
watch(apiError, (err) => {
  if (err) {
    console.error('加载数据失败:', err)
    // 可以在这里设置一个错误状态并显示给用户
  }
})

const searchQuery = ref('')

// 处理搜索过滤
const filteredCategories = computed(() => {
  if (!navData.value.categories) return []
  
  return navData.value.categories.map(category => ({
    ...category,
    links: category.links.filter(link =>
        link.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        link.url.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })).filter(category => category.links.length > 0)
})
</script>
