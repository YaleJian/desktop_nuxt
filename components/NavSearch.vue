<template>
  <div class="mb-12">
    <div class="relative max-w-2xl mx-auto">
      <input
          type="text"
          placeholder="搜索资源..."
          class="w-full px-6 py-4 text-lg rounded-2xl border-0
               ring-1 ring-gray-200/70 focus:ring-2
               focus:ring-blue-500/90 shadow-sm
               backdrop-blur-sm bg-white/50
               transition-all duration-300
               hover:ring-blue-300
               placeholder:text-gray-400
               pr-14"
          :value="modelValue"
          @input="handleInput"
      >
      <div class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
const searchQuery = ref('')

defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>
