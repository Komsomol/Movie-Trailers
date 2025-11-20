<template>
  <div class="error-message">
    <h2>Oops! Something went wrong</h2>
    <p>{{ message }}</p>
    <button @click="onRetry" class="retry-button">
      Try Again
    </button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  onRetry: {
    type: Function,
    required: true
  }
});
</script>
