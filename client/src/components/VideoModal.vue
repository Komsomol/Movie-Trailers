<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <button class="modal-close" @click="closeModal" aria-label="Close video">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="modal-content">
            <div class="video-wrapper">
              <iframe
                :id="iframeId"
                :src="videoUrl"
                title="Trailer Video"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </div>

            <div class="modal-info">
              <h2 class="modal-title">{{ trailer.name }}</h2>
              <div class="modal-meta">
                <span class="modal-studio">{{ trailer.channel }}</span>
                <span class="modal-date">{{ trailer.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  trailer: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const iframeId = ref(`youtube-player-${Date.now()}`);
const player = ref(null);

const videoUrl = computed(() => {
  if (!props.trailer) return '';
  return `https://www.youtube.com/embed/${props.trailer.link}?autoplay=1&enablejsapi=1&modestbranding=1&rel=0&showinfo=0`;
});

const closeModal = () => {
  emit('close');
};

const handleOverlayClick = () => {
  closeModal();
};

// Handle ESC key
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal();
  }
};

// YouTube IFrame API setup
const loadYouTubeAPI = () => {
  if (window.YT) return Promise.resolve();

  return new Promise((resolve) => {
    if (window.onYouTubeIframeAPIReady) {
      const oldCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        oldCallback();
        resolve();
      };
    } else {
      window.onYouTubeIframeAPIReady = () => resolve();
    }

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  });
};

// Watch for modal open/close
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    // Load YouTube API and setup player
    await loadYouTubeAPI();

    // Wait for iframe to be in DOM
    setTimeout(() => {
      if (window.YT && window.YT.Player) {
        try {
          player.value = new window.YT.Player(iframeId.value, {
            events: {
              onStateChange: (event) => {
                // YouTube player state: 0 = ended
                if (event.data === 0) {
                  setTimeout(() => {
                    closeModal();
                  }, 1000); // Wait 1 second before closing
                }
              }
            }
          });
        } catch (error) {
          console.warn('YouTube player setup failed:', error);
        }
      }
    }, 500);
  } else {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeyDown);

    // Destroy player
    if (player.value && player.value.destroy) {
      try {
        player.value.destroy();
      } catch (error) {
        console.warn('YouTube player destroy failed:', error);
      }
      player.value = null;
    }
  }
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleKeyDown);
  if (player.value && player.value.destroy) {
    try {
      player.value.destroy();
    } catch (error) {
      console.warn('YouTube player destroy failed:', error);
    }
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-close {
  position: absolute;
  top: -3rem;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10000;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modal-close svg {
  width: 1.5rem;
  height: 1.5rem;
}

.modal-content {
  background: #0a0a0a;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  background: #000;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.modal-info {
  padding: 1.5rem 2rem;
  background: linear-gradient(180deg, #0a0a0a 0%, #141414 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
}

.modal-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #b3b3b3;
}

.modal-studio {
  color: #d4af37;
  font-weight: 500;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

/* Mobile */
@media (max-width: 768px) {
  .modal-close {
    top: -2.5rem;
    width: 2rem;
    height: 2rem;
  }

  .modal-close svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-info {
    padding: 1rem 1.5rem;
  }

  .modal-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
