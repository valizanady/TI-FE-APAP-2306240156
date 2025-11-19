<template>
  <div class="statistics-container">
    <div class="statistics-wrapper">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Potential Revenue</h1>
      </div>

      <!-- Filter Card -->
      <div class="filter-card">
        <div class="filter-grid">
          <!-- Year Filter -->
          <div class="filter-item">
            <label class="filter-label">Year:</label>
            <select v-model="selectedYear" class="filter-select">
              <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>

          <!-- Month Filter -->
          <div class="filter-item">
            <label class="filter-label">Month:</label>
            <select v-model="selectedMonth" class="filter-select">
              <option :value="null">All</option>
              <option v-for="(month, index) in months" :key="index" :value="index + 1">
                {{ month }}
              </option>
            </select>
          </div>

          <!-- Submit Button -->
          <div class="filter-item">
            <button @click="handleShowStatistics" :disabled="loading" class="btn-show-stats">
              <svg
                v-if="!loading"
                xmlns="http://www.w3.org/2000/svg"
                class="btn-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <div v-else class="spinner-small"></div>
              {{ loading ? 'Loading...' : 'Show Statistic' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading statistics...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="error-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="error-text">{{ error }}</p>
        <button class="btn-retry" @click="handleShowStatistics">Retry</button>
      </div>

      <!-- Statistics Content -->
      <div v-else-if="statistics" class="stats-content">
        <!-- Chart Card -->
        <div class="chart-card">
          <div class="card-header">
            <h2 class="card-title">Revenue by Activity Type</h2>
          </div>
          <div class="card-body">
            <canvas ref="chartCanvas" style="max-height: 400px"></canvas>
          </div>
        </div>

        <!-- Summary Card -->
        <div class="summary-card">
          <div class="summary-header">
            <h3 class="summary-title">Summary</h3>
          </div>
          <div class="summary-body">
            <div class="summary-item">
              <span class="summary-label">Total Revenue:</span>
              <span class="summary-value total">
                Rp {{ statistics.totalRevenue.toLocaleString('id-ID') }}
              </span>
            </div>
            <div class="summary-divider"></div>
            <div
              v-for="(revenue, activityType) in statistics.revenueByActivityType"
              :key="activityType"
              class="summary-item"
            >
              <span class="summary-label">{{ activityType }}:</span>
              <span class="summary-value">Rp {{ revenue.toLocaleString('id-ID') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State (first load) -->
      <div v-else class="empty-state">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="empty-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <p class="empty-text">Select year and month to view statistics</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useStatisticsStore } from '@/stores/statistics.ts'
import { storeToRefs } from 'pinia'
import { Chart, registerables } from 'chart.js'

// Register Chart.js components
Chart.register(...registerables)

const statisticsStore = useStatisticsStore()
const { currentStatistics, loading, error } = storeToRefs(statisticsStore)

const statistics = computed(() => currentStatistics.value)

// Filter state
const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
const selectedMonth = ref<number | null>(null)

// Chart ref
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// Data
const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]


// Methods
async function handleShowStatistics() {
  await statisticsStore.fetchStatistics(selectedYear.value, selectedMonth.value)
}

function renderChart() {
  if (!chartCanvas.value || !statistics.value) return

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  const revenueData = statistics.value.revenueByActivityType
  const labels = Object.keys(revenueData)
  const data = Object.values(revenueData)

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Revenue (Rp)',
          data,
          backgroundColor: 'rgba(107, 70, 193, 0.8)',
          borderColor: 'rgba(107, 70, 193, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return 'Rp ' + Number(value).toLocaleString('id-ID')
            },
          },
        },
      },
    },
  })
}

// Watchers
watch(statistics, async () => {
  if (statistics.value) {
    await nextTick()
    renderChart()
  }
})

// Lifecycle
onMounted(() => {
  // Optionally load initial data
  // handleShowStatistics()
})
</script>

<style scoped>
.statistics-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 2rem;
}

.statistics-wrapper {
  max-width: 1280px;
  margin: 0 auto;
}

/* Header */
.page-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

/* Filter Card */
.filter-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.filter-select {
  padding: 0.625rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1f2937;
  background-color: #ffffff;
  transition: border-color 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #6b46c1;
  ring: 2px;
  ring-color: rgba(107, 70, 193, 0.2);
}

.btn-show-stats {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-show-stats:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a3ca1 0%, #7c4ee6 100%);
  transform: translateY(-1px);
}

.btn-show-stats:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #6b7280;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e5e7eb;
  border-top-color: #6b46c1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.spinner-small {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem;
}

.error-icon {
  width: 4rem;
  height: 4rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-text {
  color: #374151;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.btn-retry {
  padding: 0.625rem 1.25rem;
  background-color: #6b46c1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-retry:hover {
  background-color: #5a3ca1;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem;
}

.empty-icon {
  width: 5rem;
  height: 5rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-text {
  color: #6b7280;
  font-size: 1rem;
}

/* Statistics Content */
.stats-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

/* Chart Card */
.chart-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 100%);
  padding: 1.25rem 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.card-body {
  padding: 1.5rem;
}

/* Summary Card */
.summary-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  height: fit-content;
}

.summary-header {
  background-color: #f9fafb;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.summary-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.summary-body {
  padding: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.summary-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.summary-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.summary-value.total {
  font-size: 1.125rem;
  color: #15803d;
}

.summary-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 1rem 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .statistics-container {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }
}
</style>
