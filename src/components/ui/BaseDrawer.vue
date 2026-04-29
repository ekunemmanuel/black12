<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" 
           class="fixed inset-0 bg-primary/40 backdrop-blur-sm z-5000 transition-all"
           @click="isOpen = false">
      </div>
    </Transition>

    <!-- Drawer Content -->
    <Transition :name="transitionName">
      <div v-if="isOpen" 
           class="fixed z-5000 bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300"
           :class="containerClasses">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h3 class="text-lg font-bold text-gray-800">{{ title }}</h3>
            <p class="text-sm text-gray-500">{{ subtitle }}</p>
          </div>
          <button @click="isOpen = false" 
                  class="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all">
            <X :size="20" />
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-6">
          <slot></slot>
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <slot name="footer"></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { X } from '@lucide/vue'

const isOpen = defineModel<boolean>()

type DrawerMode = 'slideover' | 'bottomsheet' | 'modal'

interface Props {
  title?: string
  subtitle?: string
  mobileMode?: DrawerMode
  desktopMode?: DrawerMode
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Menu',
  mobileMode: 'bottomsheet',
  desktopMode: 'slideover'
})

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})

const currentMode = computed(() => {
  return windowWidth.value < 768 ? props.mobileMode : props.desktopMode
})

const transitionName = computed(() => {
  if (currentMode.value === 'slideover') return 'slide-right'
  if (currentMode.value === 'bottomsheet') return 'slide-bottom'
  return 'fade-scale'
})

const containerClasses = computed(() => {
  switch (currentMode.value) {
    case 'slideover':
      return 'right-0 top-0 h-full w-full max-w-md'
    case 'bottomsheet':
      return 'bottom-0 left-0 w-full rounded-t-3xl max-h-[85vh]'
    case 'modal':
      return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg rounded-3xl'
    default:
      return ''
  }
})
</script>

<style scoped>
/* Slide from Right (Slideover) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease-out;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

/* Slide from Bottom (Bottom Sheet) */
.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: transform 0.3s ease-out;
}
.slide-bottom-enter-from,
.slide-bottom-leave-to {
  transform: translateY(100%);
}

/* Fade (Modal) */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
}
</style>
