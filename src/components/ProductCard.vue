<template>
  <div class="cursor-pointer overflow-hidden flex flex-col group premium-card" @click="goToDetails">
    <div class="relative w-full aspect-7/10 overflow-hidden bg-accent">
      <img :src="product.image" :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500" />
      <button
        class="absolute top-4 right-4 bg-white/90 backdrop-blur-md border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 z-10 hover:scale-105 hover:bg-white shadow-soft"
        :class="isFavorite ? 'text-[#FF3B30]' : 'text-primary'" @click.stop="toggleFavorite">
        <LucideHeart :size="20" :fill="isFavorite ? 'currentColor' : 'none'" />
      </button>
    </div>

    <div class="p-5 flex-1 flex flex-col">
      <h3 class="text-[1.1rem] font-semibold mb-1 font-sans leading-tight truncate">{{ product.name }}</h3>
      <p class="text-[0.85rem] mb-4 text-secondary">{{ product.category }}</p>

      <div class="mt-auto flex justify-between items-center">
        <span class="text-[1.1rem] font-bold font-mono tracking-tight">₦{{ product.price.toLocaleString() }}</span>
        <div class="flex items-center gap-1.5 text-[0.9rem] font-extrabold">
          <LucideStar :size="16" fill="currentColor" class="text-rating mb-0.5" />
          <span>{{ product.rating.toFixed(1) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Heart as LucideHeart, Star as LucideStar } from '@lucide/vue'
import { store, type Product } from '@/store'

const props = defineProps<{
  product: Product
}>()

const router = useRouter()

const isFavorite = computed(() => store.favorites.includes(props.product.id))

const toggleFavorite = () => {
  store.toggleFavorite(props.product.id)
}

const goToDetails = () => {
  router.push(`/product/${props.product.id}`)
}
</script>
