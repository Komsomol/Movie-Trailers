<template>
  <article class="trailer-card" @click="handleClick">
    <div class="thumbnail-container">
      <img
        :src="imageError ? fallbackThumbnail : thumbnailUrl"
        :alt="trailer.name"
        class="thumbnail-image"
        @error="handleImageError"
        :loading="index < 4 ? 'eager' : 'lazy'"
        :fetchpriority="index < 2 ? 'high' : 'low'"
        decoding="async"
        width="1280"
        height="720"
      />
      <div class="play-overlay">
        <div class="play-button">
          <svg viewBox="0 0 68 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
            <path d="M 45,24 27,14 27,34" fill="#fff"></path>
          </svg>
        </div>
      </div>
      <div class="video-info-overlay">
        <h3 class="trailer-title">{{ trailer.name }}</h3>
        <div class="trailer-meta">
          <span class="channel">{{ trailer.channel }}</span>
          <span class="date">{{ trailer.date }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  trailer: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        value.channel &&
        value.name &&
        value.date &&
        value.link &&
        value.thumbnail
      );
    }
  },
  index: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['play']);

const imageError = ref(false);

const thumbnailUrl = computed(() =>
  props.trailer.thumbnail || `https://img.youtube.com/vi/${props.trailer.link}/maxresdefault.jpg`
);

const fallbackThumbnail = computed(() =>
  `https://img.youtube.com/vi/${props.trailer.link}/hqdefault.jpg`
);

const handleClick = () => {
  emit('play', props.trailer);
};

const handleImageError = () => {
  if (!imageError.value) {
    imageError.value = true;
  }
};
</script>

<style scoped>
.trailer-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.trailer-card:hover {
  transform: translateY(-4px);
}

.thumbnail-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background: #000;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.3s ease;
}

.trailer-card:hover .thumbnail-container {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(212, 175, 55, 0.3);
}

.thumbnail-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.trailer-card:hover .thumbnail-image {
  transform: scale(1.05);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.trailer-card:hover .play-overlay {
  opacity: 1;
}

.play-button {
  width: 80px;
  height: 56px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
  transform: scale(1);
  transition: transform 0.3s ease;
}

.trailer-card:hover .play-button {
  transform: scale(1.1);
}

.video-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 60%, transparent 100%);
  padding: 3rem 1rem 1rem 1rem;
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.trailer-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trailer-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8rem;
}

.channel {
  color: #d4af37;
  font-weight: 500;
}

.date {
  color: #b3b3b3;
}

@media (max-width: 640px) {
  .trailer-title {
    font-size: 0.9rem;
  }

  .trailer-meta {
    font-size: 0.75rem;
  }

  .play-button {
    width: 60px;
    height: 42px;
  }
}
</style>
