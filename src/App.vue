<script setup lang="ts">
import { RouterView } from 'vue-router'
import VNavbar from './layout/VNavbar.vue'
</script>

<template>
  <VNavbar />
  <RouterView />
</template>


<style>
#app {
  display: flex;
  flex-direction: column; /* 🔥 stack vertically, not side-by-side */
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
}

.hero {
  width: 80%;
  max-width: 900px;
}

.cards {
  width: 80%;
  max-width: 1000px;
}

</style>
