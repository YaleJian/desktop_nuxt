<script setup lang="ts">
const props = defineProps({
  category: Object,
  link: Object,
  categories: Array
})

const emit = defineEmits(['update:category', 'update:link', 'save'])

const showCategoryEditor = computed({
  get: () => !!props.category,
  set: (val) => !val && emit('update:category', null)
})

const showLinkEditor = computed({
  get: () => !!props.link,
  set: (val) => !val && emit('update:link', null)
})

// 保存逻辑
const handleSave = async () => {
  if (props.category) {
    // 分类保存逻辑
    if (!props.category.name) return
    const exists = props.categories.some(c => c.name === props.category?.name)
    if (!exists) {
      props.categories?.push(props.category)
    }
  }

  if (props.link) {
    // 链接保存逻辑
    const category = props.category
    if (category) {
      const index = category.links.findIndex(l => l.url === props.link?.url)
      if (index === -1) {
        category.links.push(props.link)
      } else {
        category.links.splice(index, 1, props.link)
      }
    }
  }

  // 触发保存到服务器
  await $fetch('/api/links', {
    method: 'POST',
    body: props.categories
  })

  emit('save')
  showCategoryEditor.value = false
  showLinkEditor.value = false
}
</script>

<template>
  <!-- 分类编辑模态框 -->
  <Modal v-model="showCategoryEditor">
    <div class="p-6 bg-white rounded-xl max-w-md w-full">
      <h3 class="text-xl font-bold mb-4">
        {{ category?.name ? '编辑分类' : '新建分类' }}
      </h3>
      <input
          v-model="category?.name"
          placeholder="分类名称"
          class="w-full p-3 border rounded-lg mb-4"
      >
      <div class="flex justify-end space-x-4">
        <button
            @click="showCategoryEditor = false"
            class="px-4 py-2 text-gray-500 hover:text-gray-700"
        >
          取消
        </button>
        <button
            @click="handleSave"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          保存
        </button>
      </div>
    </div>
  </Modal>

  <!-- 链接编辑模态框 -->
  <Modal v-model="showLinkEditor">
    <div class="p-6 bg-white rounded-xl max-w-md w-full">
      <h3 class="text-xl font-bold mb-4">
        {{ link?.url ? '编辑链接' : '新建链接' }}
      </h3>
      <div class="space-y-4">
        <select
            v-model="link?._categoryId"
            class="w-full p-3 border rounded-lg"
        >
          <option
              v-for="c in categories"
              :key="c.name"
              :value="c.name"
          >
            {{ c.name }}
          </option>
        </select>
        <input
            v-model="link?.title"
            placeholder="标题"
            class="w-full p-3 border rounded-lg"
        >
        <input
            v-model="link?.url"
            placeholder="URL"
            type="url"
            class="w-full p-3 border rounded-lg"
        >
        <input
            v-model="link?.icon"
            placeholder="图标URL"
            type="url"
            class="w-full p-3 border rounded-lg"
        >
      </div>
      <div class="flex justify-end space-x-4 mt-6">
        <button
            @click="showLinkEditor = false"
            class="px-4 py-2 text-gray-500 hover:text-gray-700"
        >
          取消
        </button>
        <button
            @click="handleSave"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          保存
        </button>
      </div>
    </div>
  </Modal>
</template>
