<template>
  <div class="studio-filter">
    <button class="filter-trigger" @click="toggleMenu" :class="{ active: isOpen }">
      <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
      <span class="filter-label">{{ selectedLabel }}</span>
      <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen" class="filter-dropdown">
        <div class="filter-scroll">
          <button
            :class="['studio-item', { active: selectedStudio === 'all' }]"
            @click="handleFilterClick('all')"
          >
            <span class="studio-icon">🎬</span>
            <span class="studio-name">All Studios</span>
            <span class="studio-count">{{ studios.find(s => s.name === 'all')?.count || 0 }}</span>
          </button>

          <div class="studio-divider"></div>

          <button
            v-for="studio in sortedStudios"
            :key="studio.name"
            :class="['studio-item', { active: selectedStudio === studio.name }]"
            @click="handleFilterClick(studio.name)"
            :title="studio.name"
          >
            <span class="studio-icon">{{ getStudioIcon(studio.name) }}</span>
            <span class="studio-name">{{ studio.name }}</span>
            <span class="studio-count">{{ studio.count }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  studios: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(s => s.name && typeof s.count === 'number');
    }
  },
  selectedStudio: {
    type: String,
    required: true
  },
  onFilterChange: {
    type: Function,
    required: true
  }
});

const isOpen = ref(false);

const selectedLabel = computed(() => {
  if (props.selectedStudio === 'all') {
    return 'All Studios';
  }
  const studio = props.studios.find(s => s.name === props.selectedStudio);
  return studio ? studio.name : 'Filter';
});

const sortedStudios = computed(() => {
  return props.studios
    .filter(s => s.name !== 'all' && s.count > 0)
    .sort((a, b) => b.count - a.count);
});

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const handleFilterClick = (studio) => {
  props.onFilterChange(studio);
  isOpen.value = false;
};

// Map studio names to emojis/icons
const getStudioIcon = (studioName) => {
  const iconMap = {
    'Netflix': '🎥',
    'Warner Bros.': '🎭',
    'Disney': '🏰',
    'Marvel': '⚡',
    'Universal': '🌍',
    'Paramount': '⛰️',
    'Sony': '📺',
    'A24': '🎨',
    'HBO': '📡',
    'Apple TV': '🍎',
    'Amazon': '📦',
    'Lionsgate': '🦁',
    'MGM': '🎪',
    'Focus Features': '🎯',
    'Illumination': '💡',
    '20th Century': '🦊',
    'Pixar': '🌟',
    'Star Wars': '⭐',
    'Legendary': '🐲',
    'Blumhouse': '👻',
    'Annapurna': '🎬',
    'Neon': '✨',
    'IFC': '🎞️',
  };

  // Try exact match first
  if (iconMap[studioName]) return iconMap[studioName];

  // Try partial match
  const key = Object.keys(iconMap).find(k =>
    studioName.toLowerCase().includes(k.toLowerCase())
  );

  return iconMap[key] || '🎬';
};

// Close dropdown when clicking outside
const handleClickOutside = (e) => {
  if (!e.target.closest('.studio-filter')) {
    isOpen.value = false;
  }
};

// Add click outside listener on mount, remove on unmount to prevent memory leaks
onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.studio-filter {
  position: relative;
  z-index: 50;
}

.filter-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.filter-trigger:hover {
  background: rgba(26, 26, 26, 1);
  border-color: #d4af37;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.filter-trigger.active {
  border-color: #d4af37;
  background: rgba(26, 26, 26, 1);
}

.filter-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #d4af37;
}

.filter-label {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chevron {
  width: 1rem;
  height: 1rem;
  color: #b3b3b3;
  transition: transform 0.3s ease;
}

.filter-trigger.active .chevron {
  transform: rotate(180deg);
}

.filter-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 280px;
  max-width: 320px;
  background: rgba(20, 20, 20, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}

.filter-scroll {
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Custom scrollbar */
.filter-scroll::-webkit-scrollbar {
  width: 6px;
}

.filter-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.filter-scroll::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.3);
  border-radius: 3px;
}

.filter-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.5);
}

.studio-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  width: 100%;
  background: transparent;
  border: none;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.studio-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.studio-item.active {
  background: rgba(212, 175, 55, 0.15);
  color: #d4af37;
}

.studio-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.studio-name {
  flex: 1;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.studio-count {
  color: #808080;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  min-width: 2rem;
  text-align: center;
}

.studio-item.active .studio-count {
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
}

.studio-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0;
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .filter-trigger {
    min-width: 140px;
    padding: 0.625rem 0.875rem;
    font-size: 0.85rem;
  }

  .filter-dropdown {
    min-width: 240px;
    max-width: calc(100vw - 2rem);
  }

  .studio-item {
    padding: 0.75rem 0.875rem;
    font-size: 0.85rem;
  }
}
</style>
