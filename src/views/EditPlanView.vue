// Di bagian script setup, import helper
import { toLocalDateTimeString } from '@/utils/dateTimeHelper'

// Update handleSubmit function
async function handleSubmit() {
  if (!validateForm()) return
  if (!canEdit.value) {
    submitError.value = cannotEditReason.value
    return
  }

  submitting.value = true
  submitError.value = null

  try {
    const planId = route.params.id as string

    console.log('📅 Form data BEFORE conversion:', formData.value)

    // Convert datetime-local to backend format (no timezone!)
    const payload = {
      ...formData.value,
      startDate: toLocalDateTimeString(formData.value.startDate),
      endDate: toLocalDateTimeString(formData.value.endDate)
    }

    console.log('📤 Payload AFTER conversion:', payload)

    await planStore.updatePlan(planId, payload)

    // Success - redirect to plan detail
    router.push(`/plans/${planId}`)
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Failed to update plan'
    submitError.value = planStore.error || errorMessage
  } finally {
    submitting.value = false
  }
}
