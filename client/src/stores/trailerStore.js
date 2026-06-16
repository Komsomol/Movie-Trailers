/**
 * @module stores/trailerStore
 * @description Pinia store for managing trailer state in the Vue application.
 * Handles fetching trailer data from the API and filtering by studio.
 *
 * @example
 * // In a Vue component
 * import { useTrailerStore } from '@/stores/trailerStore';
 *
 * const store = useTrailerStore();
 *
 * // Fetch trailers on mount
 * await store.fetchTrailers();
 *
 * // Access filtered data
 * const trailers = store.filteredTrailers;
 *
 * // Filter by studio
 * store.setSelectedStudio('Warner Bros. Pictures');
 */

import { defineStore } from 'pinia';

/**
 * @typedef {Object} Trailer
 * @property {string} channel - Studio/channel name
 * @property {string} name - Trailer title
 * @property {string} date - Formatted date string
 * @property {string} dateString - ISO 8601 date string
 * @property {string} link - YouTube video ID
 * @property {string} thumbnail - Thumbnail URL
 */

/**
 * @typedef {Object} StudioCount
 * @property {string} name - Studio name or 'all' for all studios
 * @property {number} count - Number of trailers from this studio
 */

/**
 * @typedef {Object} TrailerState
 * @property {Trailer[]} trailers - All fetched trailers
 * @property {boolean} loading - Whether data is being fetched
 * @property {string|null} error - Error message if fetch failed
 * @property {string} selectedStudio - Currently selected studio filter ('all' or studio name)
 */

/**
 * Trailer store for managing application state.
 * Provides reactive state, computed getters, and actions for trailer management.
 *
 * @function useTrailerStore
 * @returns {Object} Pinia store instance with state, getters, and actions
 *
 * @example
 * // Access store in setup function
 * const store = useTrailerStore();
 *
 * // Reactive state
 * const loading = computed(() => store.loading);
 * const error = computed(() => store.error);
 *
 * // Computed getters
 * const trailers = computed(() => store.filteredTrailers);
 * const studios = computed(() => store.studioCounts);
 *
 * // Actions
 * await store.fetchTrailers();
 * store.setSelectedStudio('Netflix');
 */
export const useTrailerStore = defineStore('trailer', {
  /**
   * Store state factory function.
   * Returns the initial state for the store.
   *
   * @returns {TrailerState} Initial store state
   */
  state: () => ({
    /** @type {Trailer[]} All fetched trailers */
    trailers: [],
    /** @type {boolean} Loading state */
    loading: true,
    /** @type {string|null} Error message */
    error: null,
    /** @type {string} Selected studio filter */
    selectedStudio: 'all'
  }),

  getters: {
    /**
     * Returns trailers filtered by the selected studio.
     * If 'all' is selected, returns all trailers.
     *
     * @param {TrailerState} state - Store state
     * @returns {Trailer[]} Filtered array of trailers
     *
     * @example
     * const filtered = store.filteredTrailers;
     * console.log(`${filtered.length} trailers after filtering`);
     */
    filteredTrailers: (state) => {
      if (state.selectedStudio === 'all') {
        return state.trailers;
      }
      return state.trailers.filter((t) => t.channel === state.selectedStudio);
    },

    /**
     * Returns an array of studios with their trailer counts.
     * Includes an 'all' option at the beginning with total count.
     *
     * @param {TrailerState} state - Store state
     * @returns {StudioCount[]} Array of studio objects with names and counts
     *
     * @example
     * const studios = store.studioCounts;
     * // [{ name: 'all', count: 50 }, { name: 'Warner Bros.', count: 10 }, ...]
     */
    studioCounts: (state) => {
      const counts = state.trailers.reduce((acc, trailer) => {
        acc[trailer.channel] = (acc[trailer.channel] || 0) + 1;
        return acc;
      }, {});

      const studios = Object.entries(counts).map(([name, count]) => ({
        name,
        count
      }));

      // Sort alphabetically by name
      studios.sort((a, b) => a.name.localeCompare(b.name));

      // Add 'all' option at the beginning
      studios.unshift({ name: 'all', count: state.trailers.length });
      return studios;
    }
  },

  actions: {
    /**
     * Fetches trailer data from the backend API.
     * Updates loading state and handles errors gracefully.
     *
     * @async
     * @returns {Promise<void>}
     * @throws {Error} Sets error state on failure (does not throw)
     *
     * @example
     * // In component setup or mounted hook
     * onMounted(async () => {
     *   await store.fetchTrailers();
     *   if (store.error) {
     *     console.error('Failed to load:', store.error);
     *   }
     * });
     */
    async fetchTrailers() {
      try {
        this.loading = true;
        this.error = null;

        const response = await fetch('/api');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check for API validation error response
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

    /**
     * Sets the selected studio filter.
     *
     * @param {string} studio - Studio name or 'all' for all studios
     * @returns {void}
     *
     * @example
     * // Filter to specific studio
     * store.setSelectedStudio('Netflix');
     *
     * // Show all trailers
     * store.setSelectedStudio('all');
     */
    setSelectedStudio(studio) {
      this.selectedStudio = studio;
    }
  }
});
