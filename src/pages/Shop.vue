<template>
  <div class="pt-5 pb-[100px] md:pt-24 min-h-screen">
    <!-- <Navbar /> -->
    <main class="container-wide">
      <div class="flex gap-8">
        <!-- Desktop Sidebar Filters -->
        <aside class="hidden md:block w-64 shrink-0 space-y-8 sticky top-24 h-fit">
          <!-- Search -->
          <div>
            <BaseInput v-model="store.searchQuery" placeholder="Product name..." label="Search">
              <template #prefix>
                <LucideSearch :size="18" class="text-gray-400" />
              </template>
            </BaseInput>
          </div>

          <!-- Categories -->
          <div class="space-y-1.5">
            <h3 class="text-sm font-bold uppercase tracking-wider">Categories</h3>
            <div class="space-y-1.5">
              <button v-for="cat in allCategories" :key="cat" @click="store.activeCategory = cat"
                class="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
                :class="store.activeCategory === cat ? 'bg-primary text-white font-bold' : 'text-secondary hover:bg-gray-100'">
                {{ cat }}
              </button>
            </div>
          </div>

          <!-- Price Range -->
          <div>
            <h3 class="text-sm font-bold uppercase tracking-wider mb-4">Price Range</h3>
            <div class="space-y-2">
              <label v-for="range in priceRanges" :key="range.label"
                class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" name="price" :value="range.value" v-model="priceFilter"
                  class="w-4 h-4 accent-primary cursor-pointer">
                <span class="text-sm text-secondary group-hover:text-primary transition-colors">{{ range.label }}</span>
              </label>
            </div>
          </div>

          <!-- Sizes -->
          <div>
            <h3 class="text-sm font-bold uppercase tracking-wider mb-4">Size</h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="size in ['S', 'M', 'L', 'XL']" :key="size" @click="toggleSize(size)"
                class="w-10 h-10 rounded-lg border flex items-center justify-center text-xs font-bold transition-all"
                :class="selectedSizes.includes(size) ? 'bg-primary border-primary text-white' : 'border-gray-200 text-secondary hover:border-primary'">
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Sort -->
          <div>
            <h3 class="text-sm font-bold uppercase tracking-wider mb-4">Sort By</h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="option in sortOptions" :key="option.value" @click="sortBy = option.value"
                class="px-3 py-2 rounded-full border text-xs font-bold transition-all"
                :class="sortBy === option.value ? 'bg-primary border-primary text-white' : 'border-gray-200 text-secondary hover:border-primary'">
                {{ option.label }}
              </button>
            </div>
          </div>
        </aside>

        <!-- Product Grid -->
        <div class="flex-1 space-y-8">
          <!-- Mobile Filter Header -->
          <div class="md:hidden space-y-4 mb-6">
            <div class="flex gap-3">
              <div class="flex-1 relative">
                <LucideSearch :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search..." v-model="store.searchQuery"
                  class="w-full pl-10 pr-4 h-[50px] bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <button @click="isFilterDrawerOpen = true"
                class="w-[50px] h-[50px] bg-primary text-white rounded-2xl flex items-center justify-center shadow-soft active:scale-95 transition-transform shrink-0">
                <LucideSlidersHorizontal :size="20" />
              </button>
            </div>
          </div>

          <div v-if="sortedProducts.length > 0" class="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard v-for="product in sortedProducts" :key="product.id" :product="product" />
          </div>

          <!-- Empty State -->
          <div v-else class="py-24 flex flex-col items-center justify-center text-center">
            <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <LucideSearch :size="32" />
            </div>
            <h3 class="text-xl font-bold text-primary mb-2">No results found</h3>
            <p class="text-secondary max-w-xs mx-auto">Try adjusting your filters to find what you're looking for.</p>
            <BaseButton variant="outline" class="mt-6" @click="resetFilters">Reset All Filters</BaseButton>
          </div>
        </div>
      </div>
    </main>

    <!-- Mobile Filter Drawer -->
    <BaseDrawer v-model="isFilterDrawerOpen" title="Filters" subtitle="Refine your selection">
      <div class="space-y-8">
        <!-- Categories -->
        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider mb-4">Categories</h3>
          <div class="flex flex-wrap gap-2">
            <button v-for="cat in allCategories" :key="cat" @click="store.activeCategory = cat"
              class="px-4 py-2 border rounded-full text-sm font-bold transition-all"
              :class="store.activeCategory === cat ? 'bg-primary border-primary text-white' : 'border-gray-100 text-secondary'">
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Price Range -->
        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider mb-4">Price Range</h3>
          <div class="grid grid-cols-1 gap-2">
            <button v-for="range in priceRanges" :key="range.label" @click="priceFilter = range.value"
              class="w-full text-left px-4 py-3 border rounded-xl text-sm font-bold transition-all"
              :class="priceFilter === range.value ? 'bg-primary border-primary text-white' : 'border-gray-100 text-secondary'">
              {{ range.label }}
            </button>
          </div>
        </div>

        <!-- Sizes -->
        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider mb-4">Size</h3>
          <div class="flex flex-wrap gap-2">
            <button v-for="size in ['S', 'M', 'L', 'XL']" :key="size" @click="toggleSize(size)"
              class="w-12 h-12 rounded-xl border flex items-center justify-center text-sm font-bold transition-all"
              :class="selectedSizes.includes(size) ? 'bg-primary border-primary text-white' : 'border-gray-100 text-secondary'">
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Sort -->
        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider mb-4">Sort By</h3>
          <div class="grid grid-cols-1 gap-2">
            <button v-for="option in sortOptions" :key="option.value" @click="sortBy = option.value"
              class="w-full text-left px-4 py-3 border rounded-xl text-sm font-bold transition-all"
              :class="sortBy === option.value ? 'bg-primary border-primary text-white' : 'border-gray-100 text-secondary'">
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>

      <template #footer>
        <BaseButton class="w-full" @click="isFilterDrawerOpen = false">Show {{ sortedProducts.length }} results
        </BaseButton>
      </template>
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search as LucideSearch,
  SlidersHorizontal as LucideSlidersHorizontal,
} from '@lucide/vue'
import ProductCard from '@/components/ProductCard.vue'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { store, products } from '@/store'

// Filters state
const isFilterDrawerOpen = ref(false)
const sortBy = ref('newest')
const priceFilter = ref('all')
const selectedSizes = ref<string[]>([])

const allCategories = ['All Items', 'Dress', 'T-Shirt', 'Jacket', 'Knitwear']

const priceRanges = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under $200', value: 'under-200' },
  { label: '$200 - $400', value: '200-400' },
  { label: 'Over $400', value: 'over-400' }
]

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Highest Rated', value: 'rating' }
]

const toggleSize = (size: string) => {
  const index = selectedSizes.value.indexOf(size)
  if (index === -1) {
    selectedSizes.value.push(size)
  } else {
    selectedSizes.value.splice(index, 1)
  }
}

const filteredProducts = computed(() => {
  return products.filter(p => {
    // Category Filter
    const matchesCategory = store.activeCategory === 'All Items' || p.category === store.activeCategory

    // Search Filter
    const matchesSearch = p.name.toLowerCase().includes(store.searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(store.searchQuery.toLowerCase())

    // Price Filter
    let matchesPrice = true
    if (priceFilter.value === 'under-200') matchesPrice = p.price < 200
    else if (priceFilter.value === '200-400') matchesPrice = p.price >= 200 && p.price <= 400
    else if (priceFilter.value === 'over-400') matchesPrice = p.price > 400

    // Size Filter
    const matchesSize = selectedSizes.value.length === 0 ||
      selectedSizes.value.some(s => p.sizes.includes(s))

    return matchesCategory && matchesSearch && matchesPrice && matchesSize
  })
})

const sortedProducts = computed(() => {
  const result = [...filteredProducts.value]

  if (sortBy.value === 'price-low') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-high') {
    result.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'rating') {
    result.sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'newest') {
    // Since we don't have true dates, we use our mock isNew flag and then original order
    result.sort((a, b) => {
      if (a.isNew && !b.isNew) return -1
      if (!a.isNew && b.isNew) return 1
      return b.id - a.id
    })
  }

  return result
})

const resetFilters = () => {
  store.activeCategory = 'All Items'
  store.searchQuery = ''
  priceFilter.value = 'all'
  selectedSizes.value = []
  sortBy.value = 'newest'
}
</script>

<style scoped>
/* Hidden scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
