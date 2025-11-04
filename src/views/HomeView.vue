<template>
  <section class="home-container">
    <h1 class="home-title">Tour Package Management System</h1>
    <p class="home-subtitle">
      Manage your tour packages, activities, and plans efficiently
    </p>
    <div class="card-grid">
      <div
        v-for="card in cards"
        :key="card.title"
        class="card"
      >
        <h2>{{ card.title }}</h2>
        <p>{{ card.description }}</p>
        <router-link :to="card.route" class="btn">
          {{ card.button }}
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const cards = [
  { title: 'Activities', description: 'Create and manage tour activities', route: '/activities', button: 'Manage Activities' },
  { title: 'Packages', description: 'Create tour packages and organize them with plans', route: '/packages', button: 'Manage Packages' },
  { title: 'Reports', description: 'View reports and analytics', route: '/reports', button: 'Manage Reports' },
]
</script>

<style scoped>
.home-container {
  max-width: 1100px;
  margin: 4rem auto;
  text-align: center;
  padding: 0 2rem;
}

.home-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #6b46c1;
}

.home-subtitle {
  color: #6c6c6c;
  margin-bottom: 3rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background: #6b46c1;
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
}
</style>
