<template>
  <div v-if="pending" class="text-center p-20">
    <p class="text-gray-500">加载中...</p>
  </div>
  
  <div v-else>
    <div class="text-center p-8">
      <h1 class="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
        {{data?.title}}
      </h1>
      <p class="text-gray-500 text-lg font-light">
        {{data?.description}}
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
// 使用原生fetch API获取数据
const pending = ref(true)
const linkData = ref(null)

onMounted(async () => {
  try {
    const response = await fetch('/links.json')
    linkData.value = await response.json()
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    pending.value = false
  }
})

const data = computed(() => linkData.value)
const searchQuery = ref('')

// 处理搜索过滤
const filteredCategories = computed(() => {
  if (!data.value?.categories) return []
  
  return data.value.categories.map(category => ({
    ...category,
    links: category.links.filter(link =>
        link.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        link.url.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })).filter(category => category.links.length > 0)
})
</script>
