import { defineStore } from 'pinia';

export const useTrailerStore = defineStore('trailer', {
  state: () => ({
    trailers: [],
    loading: true,
    error: null,
    selectedStudio: 'all',
    currentPage: 1,
  }),

  getters: {
    // OPTIMIZATION: Cache filtered results to avoid recalculation
    filteredTrailers: (state) => {
      if (state.selectedStudio === 'all') {
        return state.trailers;
      }
      return state.trailers.filter(t => t.channel === state.selectedStudio);
    },

    // OPTIMIZATION: Use Object.entries for better performance
    studioCounts: (state) => {
      const counts = state.trailers.reduce((acc, trailer) => {
        acc[trailer.channel] = (acc[trailer.channel] || 0) + 1;
        return acc;
      }, {});

      const studios = Object.entries(counts).map(([name, count]) => ({
        name,
        count
      }));

      studios.unshift({ name: 'all', count: state.trailers.length });
      return studios;
    },

    // OPTIMIZATION: Use filteredTrailers getter to avoid duplicate filtering
    paginatedTrailers(state) {
      const TRAILERS_PER_PAGE = 20;
      const filtered = this.filteredTrailers;
      const startIndex = (state.currentPage - 1) * TRAILERS_PER_PAGE;
      return filtered.slice(startIndex, startIndex + TRAILERS_PER_PAGE);
    },

    // OPTIMIZATION: Use filteredTrailers getter to avoid duplicate filtering
    totalPages(state) {
      const TRAILERS_PER_PAGE = 20;
      return Math.ceil(this.filteredTrailers.length / TRAILERS_PER_PAGE);
    }
  },

  actions: {
    async fetchTrailers() {
      try {
        this.loading = true;
        this.error = null;

        const response = await fetch('/api');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.apiValid === false) {
          throw new Error(data.error?.message || 'API validation failed');
        }

        this.trailers = data;
      } catch (err) {
        console.error('Error fetching trailers:', err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    setSelectedStudio(studio) {
      this.selectedStudio = studio;
      this.currentPage = 1;
    },

    setCurrentPage(page) {
      this.currentPage = page;
    }
  }
});
