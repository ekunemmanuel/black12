<template>
  <div class="min-h-screen bg-white  pb-12" v-if="product">
    <Navbar />

    <main class="max-w-[1440px] mx-auto pt-0 md:pt-28 md:px-10 lg:px-20">
      <div class="grid grid-cols-1 md:grid-cols-2 md:gap-12 lg:gap-20">

        <!-- Image Section -->
        <div class="relative w-full aspect-[0.9] md:aspect-[0.8] overflow-hidden md:rounded-[32px]">
          <!-- Back Button -->
          <button @click="$router.back()"
            class="absolute top-6 left-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md z-10 transition-transform active:scale-95 md:hidden">
            <LucideChevronLeft :size="24" class="text-black" />
          </button>

          <img :src="product.image" :alt="product.name"
            class="w-full h-full object-cover rounded-b-[40px] md:rounded-[32px]" />

          <!-- Favorite Button -->
          <button @click="toggleFavorite"
            class="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md z-10 transition-transform active:scale-95">
            <LucideHeart :size="24" :class="isFavorite ? 'text-red-500 fill-red-500' : 'text-black'" />
          </button>
        </div>

        <!-- Info Section -->
        <div class="px-4 py-8 md:py-12">
          <!-- Title and Quantity Row -->
          <div class="flex justify-between items-center mb-2">
            <h1 class="text-[28px] font-bold tracking-tight text-gray-900">{{ product.name }}</h1>

            <!-- <div class="flex items-center gap-4 bg-gray-100/50 p-1.5 rounded-full border border-gray-100">
              <button @click="quantity > 1 ? quantity-- : null"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm transition-active active:scale-90">
                <span class="text-xl font-medium leading-none mb-0.5">−</span>
              </button>
              <span class="text-base font-bold min-w-[12px] text-center">{{ quantity }}</span>
              <button @click="quantity++"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm transition-active active:scale-90">
                <span class="text-xl font-medium leading-none mb-0.5">+</span>
              </button>
            </div> -->
          </div>

          <!-- Rating -->
          <div class="flex items-center gap-1.5 mb-6">
            <LucideStar :size="18" class="text-yellow-400 fill-yellow-400 mb-0.5" />
            <span class="font-bold text-sm">{{ product.rating.toFixed(1) }}</span>
            <span class="text-blue-500 text-sm cursor-pointer">({{ product.reviews.toLocaleString() }} reviews)</span>
          </div>

          <!-- Description -->
          <div class="mb-8">
            <p class="text-gray-500 text-[15px] leading-relaxed">
              {{ isExpanded ? product.description : truncatedDescription }}
              <button @click="isExpanded = !isExpanded" class="ml-1 font-bold text-black">
                {{ isExpanded ? 'Read Less' : 'Read More. . .' }}
              </button>
            </p>
          </div>

          <!-- Size Selector -->
          <div class="mb-8">
            <h3 class="text-base font-bold mb-4">Choose Size</h3>
            <div class="flex flex-wrap gap-3">
              <button v-for="size in ['S', 'M', 'L', 'XL']" :key="size" @click="selectedSize = size"
                class="w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-200 font-semibold"
                :class="selectedSize === size ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-gray-200 text-gray-900'">
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Color Selector -->
          <!-- <div class="mb-12">
            <h3 class="text-base font-bold mb-4">Color</h3>
            <div class="flex gap-4">
              <button v-for="color in product.colors" :key="color" @click="selectedColor = color"
                class="w-10 h-10 rounded-full border-2 transition-all duration-200 relative flex items-center justify-center"
                :class="selectedColor === color ? 'border-black' : 'border-transparent'">
                <div class="size-8 rounded-full" :style="{ backgroundColor: color }"></div>
              </button>
            </div>
          </div> -->

          <!-- Add to Cart (Desktop View - Inline) -->
          <div class="hidden md:block">
            <button @click="handleAddToCart"
              class="w-full py-5 px-8 bg-primary hover:bg-black text-white rounded-premium flex items-center justify-center gap-3 transition-transform active:scale-[0.98] shadow-xl">
              <LucideShoppingBag :size="24" />
              <span class="text-lg font-bold">
                Add to Cart | ₦{{ Number(totalPrice).toLocaleString() }}
                <span class="text-sm font-normal text-gray-400 line-through ml-2" v-if="product.originalPrice">
                  ₦{{ Number(originalTotalPrice).toLocaleString() }}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Sticky Bottom Navigation (Mobile Only) -->
    <div
      class="sticky bottom-8 left-0 right-0 px-6 z-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] md:hidden"
      :class="[
        isScrollActive ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-24 opacity-0 pointer-events-none'
      ]">
      <button @click="handleAddToCart"
        class="w-full h-[72px] bg-[#222121] text-white rounded-[32px] flex items-center justify-center gap-3 shadow-2xl active:scale-[0.97] transition-transform">
        <LucideShoppingBag :size="24" />
        <span class="text-lg font-bold">
          Add to Cart | ₦{{ Number(totalPrice).toLocaleString() }}
          <span class="text-sm font-normal text-gray-400 line-through ml-1" v-if="product.originalPrice">
            ₦{{ Number(originalTotalPrice).toLocaleString() }}
          </span>
        </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ChevronLeft as LucideChevronLeft,
  Heart as LucideHeart,
  Star as LucideStar,
  ShoppingBag as LucideShoppingBag
} from '@lucide/vue'
import Navbar from '@/components/Navbar.vue'
import { store, products } from '@/store'

const route = useRoute()
const product = computed(() => products.find(p => p.id === Number(route.params.id)))
const selectedSize = ref('L')
const selectedColor = ref('')
const quantity = ref(1)
const isExpanded = ref(false)
const isScrollActive = ref(false)

const handleScroll = () => {
  // Trigger visibility when user starts scrolling anywhere on mobile
  if (window.innerWidth < 768) {
    // Immediate trigger on scroll initiation
    if (window.scrollY > 10) {
      isScrollActive.value = true
    } else {
      isScrollActive.value = false
    }
  }
}

onMounted(() => {
  if (product.value) {
    selectedColor.value = product.value.colors[0]
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const isFavorite = computed(() => product.value ? store.favorites.includes(product.value.id) : false)
const toggleFavorite = () => { if (product.value) store.toggleFavorite(product.value.id) }
const truncatedDescription = computed(() => {
  if (!product.value) return ''
  // Try to match the truncation in the image
  return "Its simple and elegant shape makes it perfect for those of you who like you who want minimalist clothes"
})
const totalPrice = computed(() => {
  if (!product.value) return '0.00'
  return (product.value.price * quantity.value).toFixed(2)
})
const originalTotalPrice = computed(() => {
  if (!product.value || !product.value.originalPrice) return '0.00'
  return (product.value.originalPrice * quantity.value).toFixed(2)
})
const handleAddToCart = () => {
  if (product.value) {
    store.addToCart(product.value, quantity.value, selectedSize.value, selectedColor.value)
  }
}
</script>

<style scoped>
.transition-active {
  transition: transform 0.1s ease;
}
</style>
