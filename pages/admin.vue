<script setup lang="ts">
import type { NavCategory, NavLink, EditMode,ApiResponse } from '~/server/type/nav'

const { data: navData, refresh } = useFetch<{ categories: NavCategory[] }>('/api/links')

// 编辑状态管理
const editState = reactive<{
  mode: EditMode
  category?: NavCategory
  link?: {
    data?: NavLink
    categoryName?: string
  }
}>({
  mode: 'create',
  category: undefined,
  link: undefined
})

// 打开分类编辑
const openCategoryEdit = (mode: EditMode, category?: NavCategory) => {
  editState.mode = mode
  editState.category = category ? { ...category } : { name: '', links: [] }
}

// 打开链接编辑
const openLinkEdit = (
    mode: EditMode,
    category: NavCategory,
    link?: NavLink
) => {
  editState.mode = mode
  editState.link = {
    data: link ? { ...link } : { title: '', url: '', icon: '' },
    categoryName: category.name
  }
}

// 保存分类
const saveCategory = async (updatedCategory: NavCategory) => {
  if (!navData.value) return

  const index = navData.value.categories.findIndex(
      c => c.name === updatedCategory.name
  )

  if (editState.mode === 'create') {
    if (index !== -1) {
      alert('分类名称已存在')
      return
    }
    navData.value.categories.push(updatedCategory)
  } else {
    if (index === -1) return
    navData.value.categories.splice(index, 1, updatedCategory)
  }

  await persistData()
}

// 保存链接
const saveLink = async (updatedLink: NavLink) => {
  if (!navData.value || !editState.link?.categoryName) return

  const category = navData.value.categories.find(
      c => c.name === editState.link?.categoryName
  )
  if (!category) return

  const index = category.links.findIndex(l => l.url === updatedLink.url)

  if (editState.mode === 'create') {
    if (index !== -1) {
      alert('链接已存在')
      return
    }
    category.links.push(updatedLink)
  } else {
    if (index === -1) return
    category.links.splice(index, 1, updatedLink)
  }

  await persistData()
}

// 统一保存方法
const persistData = async () => {
  if (!navData.value) return

  const { success, error } = await $fetch<ApiResponse>('/api/links', {
    method: 'POST',
    body: { categories: navData.value.categories }
  })

  if (success) {
    refresh()
  } else {
    alert(error || '保存失败')
  }
}

// 删除操作
const deleteCategory = (name: string) => {
  if(navData.value) navData.value.categories = navData.value.categories.filter(c => c.name !== name)
}

const deleteLink = (index:number, name: string) => {
  if(navData.value) navData.value.categories = navData.value.categories.filter(c => {
    if(c.name === name){
      delete c.links[index]
    }
  })
}

const handleImport = ()=>{}
const exportData = ()=>{}

</script>


<template>
  <div class="max-w-7xl mx-auto p-8">
    <div class="flex justify-between items-center mb-12">
      <h1 class="text-3xl font-bold">导航管理</h1>
      <button
          @click="openCategoryEdit('create')"
          class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        新增分类
      </button>
      <input type="file" @change="handleImport">
      <button @click="exportData">导出数据</button>
    </div>

    <!-- 分类列表 -->
    <div class="space-y-6">
      <div
          v-for="category in navData?.categories"
          :key="category.name"
          class="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">{{ category.name }}</h2>
          <div class="space-x-4">
            <button
                @click="openCategoryEdit('edit', category)"
                class="text-blue-500 hover:text-blue-600"
            >
              编辑
            </button>
            <button
                @click="deleteCategory(category.name)"
                class="text-red-500 hover:text-red-600"
            >
              删除
            </button>
          </div>
        </div>

        <!-- 链接列表 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
              v-for="(link, index) in category.links"
              :key="link.url"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div class="truncate">
              <div class="font-medium">{{ link.title }}</div>
              <div class="text-sm text-gray-500 truncate">{{ link.url }}</div>
            </div>
            <div class="flex space-x-2 ml-4">
              <button
                  @click="openLinkEdit('edit', category, link)"
                  class="text-gray-500 hover:text-blue-500"
              >
                编辑
              </button>
              <button
                  @click="deleteLink(index, category.name)"
                  class="text-gray-500 hover:text-red-500"
              >
                删除
              </button>
            </div>
          </div>
          <button
              @click="openLinkEdit('create', category)"
              class="p-4 text-center border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-200 transition"
          >
            + 新增链接
          </button>
        </div>
      </div>
    </div>

    <!-- 编辑模态框 -->
    <LinkEditor
        v-model:category="editState.category"
        v-model:link="editState.link"
        :categories="navData?.categories"
        @save="saveCategory"
    />
  </div>
</template>
