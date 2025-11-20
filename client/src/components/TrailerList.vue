<template>
  <div class="trailer-list">
    <TrailerCard
      v-for="(trailer, index) in trailers"
      :key="`${trailer.link}-${index}`"
      :trailer="trailer"
      :index="index"
      @play="handlePlay"
    />
  </div>
</template>

<script setup>
import TrailerCard from './TrailerCard.vue';

defineProps({
  trailers: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(t =>
        t.channel &&
        t.name &&
        t.date &&
        t.link &&
        t.thumbnail
      );
    }
  }
});

const emit = defineEmits(['play']);

const handlePlay = (trailer) => {
  emit('play', trailer);
};
</script>

<style scoped>
.trailer-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
  gap: 1.5rem;
  width: 100%;
}

@media (min-width: 640px) {
  .trailer-list {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr));
    gap: 2rem;
  }
}

@media (min-width: 1024px) {
  .trailer-list {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 400px), 1fr));
  }
}
</style>
