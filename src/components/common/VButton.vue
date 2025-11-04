<template>
  <button :class="buttonClasses">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
})

const buttonClasses = computed(() => {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all cursor-pointer border-none'

  const variants = {
    primary:
      'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    success:
      'bg-gradient-to-br from-[#10b981] to-[#059669] text-white hover:shadow-lg hover:-translate-y-0.5',
    danger:
      'bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white hover:shadow-lg hover:-translate-y-0.5',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return `${base} ${variants[props.variant]} ${sizes[props.size]}`
})
</script>

<style scoped>
button {
  white-space: nowrap;
}
</style>
