<template>
  <div class="group mb-10">
    <h2 class="text-2xl font-bold p-6 mb-6 text-gray-800
              sticky top-24 bg-white/80 backdrop-blur
              py-4 z-10 border-b border-gray-100">
      {{ category.name }}
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <a
          v-for="link in category.links"
          :key="link.url"
          :href="link.url"
          target="_blank"
          class="relative p-6 bg-white rounded-2xl
             shadow-sm hover:shadow-md
             border border-gray-100/70
             transition-all duration-300
             hover:-translate-y-1
             group/card"
      >
        <!-- 渐变装饰条 -->
        <div class="absolute inset-x-0 bottom-0 h-2
                   bg-gradient-to-r from-blue-400 to-purple-400
                   rounded-b-2xl opacity-0
                   group-hover/card:opacity-100 transition-opacity">
        </div>
        <div class="absolute inset-0 rounded-2xl overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0
              transition-opacity duration-500 group-hover/card:opacity-10"></div>
        </div>

        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100
                      flex items-center justify-center shadow-inner">
              <img
                  :src="link.icon"
                  :alt="link.title"
                  class="w-8 h-8 rounded-lg object-contain"
              >
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-gray-900 truncate">{{ link.title }}</h3>
            <p class="text-sm text-gray-500 font-mono truncate">{{ link.url }}</p>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  category: {
    type: Object,
    required: true
  }
})
</script>
