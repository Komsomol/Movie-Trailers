<template>
  <header class="header">
    <div class="header-content">
      <h1>Latest Movie Trailers</h1>
      <p class="subtitle">Official trailers from the last 30 days</p>
    </div>
    <button
      class="refresh-button"
      @click="onRefresh"
      :disabled="loading"
      aria-label="Refresh trailers"
    >
      {{ loading ? 'Loading...' : 'Refresh' }}
    </button>
  </header>
</template>

<script setup>
defineProps({
  onRefresh: {
    type: Function,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  }
});
</script>
