<template>
  <div class="app">
    <Header :onRefresh="handleRefresh" :loading="store.loading" />

    <!-- Floating Filter - Top Right -->
    <div class="floating-filter-container">
      <StudioFilter
        v-if="!store.loading && !store.error && store.trailers.length > 0"
        :studios="store.studioCounts"
        :selectedStudio="store.selectedStudio"
        :onFilterChange="handleFilterChange"
      />
    </div>

    <main class="main-content">
      <Loading v-if="store.loading" />

      <ErrorMessage
        v-if="store.error && !store.loading"
        :message="store.error"
        :onRetry="handleRefresh"
      />

      <div v-if="!store.loading && !store.error && store.trailers.length === 0" class="no-trailers">
        <h2>No Trailers Found</h2>
        <p>Check back soon for the latest movie trailers!</p>
      </div>

      <div
        v-if="!store.loading && !store.error && store.filteredTrailers.length === 0 && store.trailers.length > 0"
        class="no-trailers"
      >
        <h2>No Trailers from {{ store.selectedStudio }}</h2>
        <p>Try selecting a different studio or view all trailers.</p>
      </div>

      <template v-if="!store.loading && !store.error && store.filteredTrailers.length > 0">
        <div class="trailer-showcase">
          <TrailerList :trailers="store.filteredTrailers" @play="handlePlayVideo" />
        </div>
      </template>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p class="footer-stats">
          {{ store.filteredTrailers.length }} {{ store.selectedStudio === 'all' ? 'total' : store.selectedStudio }} trailers
          <template v-if="store.selectedStudio === 'all'">
            from {{ store.studioCounts.length - 1 }} studios
          </template>
        </p>
        <p class="footer-tagline">Powered by YouTube • Updated every 5 minutes</p>
      </div>
    </footer>

    <!-- Video Modal -->
    <VideoModal :isOpen="isModalOpen" :trailer="selectedTrailer" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useTrailerStore } from './stores/trailerStore';
import TrailerList from './components/TrailerList.vue';
import Header from './components/Header.vue';
import ErrorMessage from './components/ErrorMessage.vue';
import Loading from './components/Loading.vue';
import StudioFilter from './components/StudioFilter.vue';

// OPTIMIZATION: Lazy load VideoModal - only loaded when user clicks a trailer
const VideoModal = defineAsyncComponent(() =>
  import('./components/VideoModal.vue')
);

const store = useTrailerStore();

const isModalOpen = ref(false);
const selectedTrailer = ref(null);

onMounted(() => {
  store.fetchTrailers();
});

const handleRefresh = () => {
  store.fetchTrailers();
};

const handleFilterChange = (studio) => {
  store.setSelectedStudio(studio);
};

const handlePlayVideo = (trailer) => {
  selectedTrailer.value = trailer;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  setTimeout(() => {
    selectedTrailer.value = null;
  }, 300); // Wait for modal animation to complete
};
</script>

<style src="./App.css"></style>

<style scoped>
.floating-filter-container {
  position: fixed;
  top: 6rem;
  right: 2rem;
  z-index: 100;
}

@media (max-width: 768px) {
  .floating-filter-container {
    top: 5rem;
    right: 1rem;
  }
}
</style>
