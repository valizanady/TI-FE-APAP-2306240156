<script setup lang="ts">
import VButton from '/Users/valizanadya/Documents/SMT 5/APAP/tugas individu/tour-package-2306240156-fe/src/components/common/VButton.vue'
import { usePackageStore } from '@/stores/package'
import { toast } from 'vue-sonner'

interface Props {
  packageId: string
  redirectTo?: string
}

const props = defineProps<Props>()
const store = usePackageStore()

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this package?')) return

  try {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}package/${props.packageId}`, {
      method: 'DELETE',
    })
    toast.success('Package deleted successfully ✅')
    await store.fetchAll()
  } catch (error) {
    console.error(error)
    toast.error('Failed to delete package ❌')
  }
}
</script>

<template>
  <VButton variant="danger" size="sm" @click="handleDelete">Delete</VButton>
</template>
