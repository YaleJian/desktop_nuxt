<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">导航管理</h1>
      <div class="flex gap-4">
        <button @click="saveAll" 
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                :disabled="saving">
          {{ saving ? '保存中...' : '保存更改' }}
        </button>
        <button @click="logout" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          退出登录
        </button>
      </div>
    </div>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>
    
    <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {{ success }}
    </div>
    
    <!-- 分类管理 -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">分类管理</h2>
        <button @click="addCategory" 
                class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          添加分类
        </button>
      </div>

      <div class="text-gray-500 text-sm mb-4">
        <p>提示: 通过拖拽分类标题可以调整分类顺序；通过拖拽链接卡片可以调整链接顺序。</p>
      </div>
      
      <!-- 可拖拽的分类列表 -->
      <draggable 
        v-model="navData.categories" 
        item-key="name"
        handle=".category-drag-handle"
        :animation="200"
        ghost-class="ghost-category"
        class="space-y-6"
      >
        <template #item="{element: category, index}">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center flex-1">
                <div class="category-drag-handle cursor-move mr-2 text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </div>
                <input v-model="category.name" 
                       class="text-xl font-semibold px-2 py-1 border rounded flex-1"
                       placeholder="分类名称">
              </div>
              <button @click="removeCategory(index)" 
                      class="text-red-500 hover:text-red-700 ml-4">
                删除
              </button>
            </div>
            
            <div class="space-y-4">
              <!-- 可拖拽的链接列表 -->
              <draggable 
                v-model="category.links" 
                item-key="url"
                handle=".link-drag-handle"
                :animation="150"
                ghost-class="ghost-link"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <template #item="{element: link, index: linkIndex}">
                  <div class="border rounded-lg p-4 hover:border-blue-300">
                    <div class="flex justify-between mb-2">
                      <div class="flex items-center">
                        <div class="link-drag-handle cursor-move mr-2 text-gray-400 hover:text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                          </svg>
                        </div>
                        <h4 class="font-medium">链接 #{{ linkIndex + 1 }}</h4>
                      </div>
                      <button @click="removeLink(category, linkIndex)"
                              class="text-red-500 hover:text-red-700 text-sm">
                        删除
                      </button>
                    </div>
                    
                    <div class="space-y-2">
                      <div>
                        <label class="block text-sm text-gray-600">标题</label>
                        <input v-model="link.title" 
                               class="w-full px-2 py-1 border rounded text-sm"
                               placeholder="链接标题">
                      </div>
                      <div>
                        <label class="block text-sm text-gray-600">URL</label>
                        <input v-model="link.url" 
                               class="w-full px-2 py-1 border rounded text-sm"
                               placeholder="https://example.com">
                      </div>
                      <div>
                        <label class="block text-sm text-gray-600">图标 URL</label>
                        <input v-model="link.icon" 
                               class="w-full px-2 py-1 border rounded text-sm"
                               placeholder="图标 URL">
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>
              
              <!-- 添加链接按钮 -->
              <div @click="addLink(category)"
                   class="border border-dashed rounded-lg p-4 flex items-center justify-center 
                          hover:bg-gray-50 cursor-pointer mt-4">
                <span class="text-blue-500">+ 添加链接</span>
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import draggable from 'vuedraggable'

const navData = ref({
  title: '',
  description: '',
  categories: []
})

const error = ref('')
const success = ref('')
const saving = ref(false)
const router = useRouter()

// 加载数据
async function loadData() {
  try {
    const { data } = await useFetch('/api/links')
    if (data.value) {
      navData.value = data.value
    }
  } catch (e) {
    error.value = '加载数据失败'
    console.error(e)
  }
}

// 保存数据
async function saveAll() {
  saving.value = true
  success.value = ''
  error.value = ''
  
  try {
    const { data } = await useFetch('/api/links', {
      method: 'POST',
      body: { categories: navData.value.categories }
    })
    
    if (data.value?.success) {
      success.value = '保存成功'
      setTimeout(() => {
        success.value = ''
      }, 3000)
    } else {
      error.value = data.value?.error || '保存失败'
    }
  } catch (e) {
    error.value = '保存请求失败'
    console.error(e)
  } finally {
    saving.value = false
  }
}

// 添加分类
function addCategory() {
  navData.value.categories.push({
    name: '新分类',
    links: []
  })
}

// 删除分类
function removeCategory(index) {
  if (confirm('确定要删除这个分类吗？')) {
    navData.value.categories.splice(index, 1)
  }
}

// 添加链接
function addLink(category) {
  category.links.push({
    title: '新链接',
    url: 'https://',
    icon: 'https://icon.horse/icon/example.com'
  })
}

// 删除链接
function removeLink(category, linkIndex) {
  category.links.splice(linkIndex, 1)
}

// 退出登录
async function logout() {
  const auth = useAuth()
  const { success } = await auth.logout()
  if (success) {
    router.push('/login')
  } else {
    console.error('退出登录失败')
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadData()
})
</script>

<style>
.ghost-category {
  opacity: 0.5;
  background: #c8ebfb;
  border: 1px dashed #97d2fb;
}

.ghost-link {
  opacity: 0.5;
  background: #e9f5ff;
  border: 1px dashed #97d2fb;
}
</style>
