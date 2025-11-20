<template>
  <div v-if="totalPages > 1" class="pagination">
    <div class="pagination-controls">
      <button
        class="pagination-button"
        @click="handlePrevious"
        :disabled="currentPage === 1"
        aria-label="Previous page"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Previous</span>
      </button>

      <div class="page-numbers">
        <template v-for="(page, index) in pageNumbers" :key="index">
          <button
            v-if="typeof page === 'number'"
            :class="['page-number', { active: currentPage === page }]"
            @click="onPageChange(page)"
          >
            {{ page }}
          </button>
          <span v-else class="page-ellipsis">{{ page }}</span>
        </template>
      </div>

      <button
        class="pagination-button"
        @click="handleNext"
        :disabled="currentPage === totalPages"
        aria-label="Next page"
      >
        <span>Next</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <div class="pagination-info">
      Page {{ currentPage }} of {{ totalPages }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  onPageChange: {
    type: Function,
    required: true
  }
});

const handlePrevious = () => {
  if (props.currentPage > 1) {
    props.onPageChange(props.currentPage - 1);
  }
};

const handleNext = () => {
  if (props.currentPage < props.totalPages) {
    props.onPageChange(props.currentPage + 1);
  }
};

const pageNumbers = computed(() => {
  const pages = [];
  const maxVisible = 5;

  if (props.totalPages <= maxVisible) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (props.currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', props.totalPages);
    } else if (props.currentPage >= props.totalPages - 2) {
      pages.push(1, '...', props.totalPages - 3, props.totalPages - 2, props.totalPages - 1, props.totalPages);
    } else {
      pages.push(1, '...', props.currentPage - 1, props.currentPage, props.currentPage + 1, '...', props.totalPages);
    }
  }

  return pages;
});
</script>
