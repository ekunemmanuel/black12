<template>
  <!-- Desktop Header -->
  <header
    class="fixed top-0 left-0 right-0 h-20 items-center z-2000 border-b border-black/5 glass-effect hidden md:flex">
    <div class="container-wide flex justify-between items-center w-full">
      <router-link to="/" class="text-2xl font-extrabold tracking-widest no-underline text-primary">BLACK
        12</router-link>

      <div v-if="showGlobalSearch" class="flex-1 max-w-[500px] mx-8 relative group" ref="searchContainer">
        <div
          class="bg-white rounded-full py-3 px-6 flex items-center gap-3 text-secondary transition-all duration-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary shadow-sm">
          <LucideSearch :size="20" />
          <input 
            type="text" 
            placeholder="Search clothes..." 
            v-model="store.searchQuery"
            @focus="isSearchFocused = true"
            class="bg-transparent border-none outline-none w-full font-sans text-primary" 
          />
        </div>

        <!-- Search Results Dropdown -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="translate-y-2 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-2 opacity-0"
        >
          <div 
            v-if="isSearchFocused && store.searchQuery.length > 0" 
            class="absolute top-full left-0 right-0 mt-3 bg-white/90 backdrop-blur-xl border border-black/5 rounded-[28px] shadow-2xl p-4 overflow-hidden z-2000"
          >
            <div v-if="searchResults.length > 0" class="space-y-2">
              <div class="px-2 mb-2">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top Matches</span>
              </div>
              
              <div class="space-y-1">
                <div 
                  v-for="product in limitedResults" 
                  :key="product.id"
                  @click="navigateToProduct(product.id)"
                  class="flex items-center gap-4 p-3 rounded-2xl hover:bg-black/5 transition-colors cursor-pointer group"
                >
                  <div class="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-black/5 shrink-0">
                    <img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-sm text-gray-900 truncate">{{ product.name }}</h4>
                    <p class="text-xs text-gray-400">{{ product.category }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-sm text-gray-900">${{ product.price }}</p>
                    <div class="text-[10px] text-primary flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      View <LucideArrowRight :size="10" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- View More Footer -->
              <div v-if="searchResults.length > 3" class="pt-2 border-t border-black/5 mt-2">
                <button 
                  @click="navigateToShop"
                  class="w-full py-3 px-4 rounded-xl bg-black text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
                >
                  View all {{ searchResults.length }} products
                  <LucideSearch :size="14" />
                </button>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="py-12 text-center space-y-3">
              <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <LucideSearch :size="24" />
              </div>
              <p class="text-sm font-bold text-gray-900">No results found</p>
              <p class="text-xs text-gray-400">Try searching for something else</p>
            </div>
          </div>
        </Transition>
      </div>

      <nav class="flex gap-8 items-center">
        <router-link to="/shop"
          class="text-primary font-bold tracking-widest uppercase text-sm no-underline hover:opacity-70 transition-opacity"
          :class="{ 'underline underline-offset-8 decoration-2': $route.path === '/shop' }">Shop</router-link>
        <div class="flex items-center gap-6 border-l border-black/5 pl-8 ml-2">
          <router-link to="/checkout"
            class="text-primary bg-none border-none cursor-pointer relative transition-all duration-200 flex items-center justify-center no-underline hover:scale-110"
            :class="{ 'opacity-100': $route.path === '/checkout', 'opacity-70': $route.path !== '/checkout' }">
            <LucideShoppingBag :size="24" />
            <span v-if="cartCount > 0"
              class="absolute -top-2 -right-2 bg-primary text-white text-[10px] py-0.5 px-1.5 rounded-[10px] font-mono">{{
              cartCount }}</span>
          </router-link>
          <router-link to="/profile"
            class="text-primary bg-none border-none cursor-pointer relative transition-all duration-200 flex items-center justify-center no-underline hover:scale-110"
            :class="{ 'opacity-100': $route.path === '/profile', 'opacity-70': $route.path !== '/profile' }">
            <LucideUser :size="24" />
          </router-link>
        </div>
      </nav>
    </div>
  </header>

  <!-- Mobile Bottom Navigation -->
  <nav v-if="showMobileNav"
    class="fixed bottom-3 left-4 right-4 h-20 bg-primary flex justify-around items-center z-2000 pb-[env(safe-area-inset-bottom)] rounded-[200px] md:hidden">
    <router-link to="/"
      class="text-white/50 bg-none border-none cursor-pointer flex flex-col items-center relative gap-0 no-underline flex-1 h-full justify-center transition-colors"
      :class="{ 'text-white': $route.path === '/' }">
      <LucideHome :size="24" />
      <div class="absolute bottom-[18px] w-1.5 h-1.5 bg-white rounded-full" v-if="$route.path === '/'"></div>
    </router-link>
    <router-link to="/shop"
      class="text-white/50 bg-none border-none cursor-pointer flex flex-col items-center relative gap-0 no-underline flex-1 h-full justify-center transition-colors"
      :class="{ 'text-white': $route.path === '/shop' }">
      <LucideLayoutGrid :size="24" />
      <div class="absolute bottom-[18px] w-1.5 h-1.5 bg-white rounded-full" v-if="$route.path === '/shop'"></div>
    </router-link>
    <router-link to="/checkout"
      class="text-white/50 bg-none border-none cursor-pointer flex flex-col items-center relative gap-0 no-underline flex-1 h-full justify-center transition-colors"
      :class="{ 'text-white': $route.path === '/checkout' }">
      <div class="relative">
        <LucideShoppingBag :size="24" />
        <span v-if="cartCount > 0"
          class="absolute -top-2 -right-2 bg-[#FF3B30] text-white text-[10px] py-0.5 px-1.5 rounded-[10px] font-mono">{{
          cartCount }}</span>
      </div>
      <div class="absolute bottom-[18px] w-1.5 h-1.5 bg-white rounded-full" v-if="$route.path === '/checkout'"></div>
    </router-link>
    <router-link to="/profile"
      class="text-white/50 bg-none border-none cursor-pointer flex flex-col items-center relative gap-0 no-underline flex-1 h-full justify-center transition-colors"
      :class="{ 'text-white': $route.path === '/profile' }">
      <LucideUser :size="24" />
      <div class="absolute bottom-[18px] w-1.5 h-1.5 bg-white rounded-full" v-if="$route.path === '/profile'"></div>
    </router-link>
  </nav>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Home as LucideHome,
  Search as LucideSearch,
  ShoppingBag as LucideShoppingBag,
  User as LucideUser,
  LayoutGrid as LucideLayoutGrid,
  ArrowRight as LucideArrowRight
} from '@lucide/vue'
import { store, products } from '@/store'

const route = useRoute()
const router = useRouter()

const searchContainer = ref<HTMLElement | null>(null)
const isSearchFocused = ref(false)

const showMobileNav = computed(() => {
  if (route.path.startsWith('/profile') && store.currentProfileTab) {
    return false
  }
  const hiddenRoutes = ['/product', '/checkout']
  return !hiddenRoutes.some(path => route.path.startsWith(path))
})

const showGlobalSearch = computed(() => {
  const hiddenRoutes = ['/shop', '/checkout']
  return !hiddenRoutes.some(path => route.path.startsWith(path))
})

const searchResults = computed(() => {
  if (!store.searchQuery) return []
  return products.filter(p => 
    p.name.toLowerCase().includes(store.searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(store.searchQuery.toLowerCase())
  )
})

const limitedResults = computed(() => searchResults.value.slice(0, 3))

const navigateToProduct = (id: number) => {
  isSearchFocused.value = false
  router.push(`/product/${id}`)
}

const navigateToShop = () => {
  isSearchFocused.value = false
  router.push('/shop')
}

const cartCount = computed(() => {
  return store.cart.reduce((acc, item) => acc + item.quantity, 0)
})

// Handle click outside to close dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    isSearchFocused.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
