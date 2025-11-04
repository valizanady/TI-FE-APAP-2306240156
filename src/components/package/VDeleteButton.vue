<template>
  <VButton variant="danger" size="sm" @click="openModal = true"> Delete </VButton>

  <VModal v-if="openModal" @close="openModal = false">
    <template #title>
      <div class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        Confirm Deletion
      </div>
    </template>
    <template #content>
      <p class="text-gray-700 leading-relaxed">
        Are you sure you want to delete this package?
        <br /><br />
        <strong class="text-red-600">This action cannot be undone</strong> and will also delete all
        associated plans.
      </p>
    </template>
    <template #footer>
      <VButton variant="secondary" size="md" @click="openModal = false"> Cancel </VButton>
      <VButton variant="danger" size="md" @click="confirmDelete">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Delete Package
      </VButton>
    </template>
  </VModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePackageStore } from '@/stores/package'
import VButton from '@/components/common/VButton.vue'
import VModal from '@/components/common/VModal.vue'

const store = usePackageStore()
const router = useRouter()
const openModal = ref(false)

interface Props {
  packageId: string
  redirectTo?: string
}

const props = defineProps<Props>()

const confirmDelete = async () => {
  try {
    await store.deletePackage(props.packageId)
    openModal.value = false

    // Show success message
    alert('✅ Package deleted successfully!')

    // Redirect jika ada redirectTo
    if (props.redirectTo) {
      router.push(props.redirectTo)
    }
  } catch (error) {
    console.error('❌ Delete failed:', error)
    openModal.value = false

    // Show error message
    const errorMsg = error instanceof Error ? error.message : 'Failed to delete package'
    alert(`❌ Error: ${errorMsg}`)
  }
}
</script>
