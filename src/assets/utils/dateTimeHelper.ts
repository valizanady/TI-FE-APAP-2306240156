// src/utils/dateTimeHelper.ts

/**
 * Convert Date object to local datetime string for backend (without timezone)
 * Example: new Date() → "2025-11-01T00:00:00"
 */
export function toLocalDateTimeString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

/**
 * Convert backend datetime string to datetime-local input format
 * Example: "2025-11-01T00:00:00" → "2025-11-01T00:00"
 */
export function toDateTimeLocalFormat(dateStr: string): string {
  if (!dateStr) return ''
  return dateStr.slice(0, 16) // Remove seconds: "2025-11-01T00:00:00" → "2025-11-01T00:00"
}

/**
 * Format datetime for display (Indonesian format)
 * Example: "2025-11-01T00:00:00" → "1 November 2025, 00:00"
 */
export function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
