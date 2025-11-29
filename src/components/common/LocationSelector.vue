<template>
  <div>
    <select
      :value="modelValue"
      @change="handleChange"
      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      :required="required"
      :disabled="disabled"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="location in locations" :key="location" :value="location">
        {{ location }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { LocationService } from '@/services/location.service'

interface Props {
  modelValue: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select Location',
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const locationService = new LocationService()
const locations = ref<string[]>([])
const loading = ref(false)

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}

// Load locations on mount
onMounted(async () => {
  loading.value = true
  try {
    const provinces = await locationService.getProvinces()
    // Extract province names
    locations.value = provinces.map((p) => p.name).sort()
  } catch (error) {
    console.error('Failed to load locations:', error)
    // Fallback to common Indonesian locations
    locations.value = [
      'Jakarta',
      'Bali',
      'Yogyakarta',
      'Bandung',
      'Surabaya',
      'Medan',
      'Makassar',
      'Semarang',
      'Palembang',
      'Lombok',
      'Manado',
      'Batam',
    ].sort()
  } finally {
    loading.value = false
  }
})
</script>
