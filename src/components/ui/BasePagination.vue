<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 px-10 bg-white border-t border-gray-50 rounded-b-[32px]">
    <!-- Info -->
    <div class="text-[11px] font-bold text-secondary uppercase tracking-widest">
      Showing <span class="text-primary font-black">{{ from }}</span> to 
      <span class="text-primary font-black">{{ to }}</span> of 
      <span class="text-primary font-black">{{ total }}</span> results
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-8">
      <!-- Limit Selector -->
      <div class="flex items-center gap-3">
        <span class="text-[10px] font-black uppercase tracking-widest text-secondary/40">Rows per page:</span>
        <select 
          :value="limit" 
          @change="$emit('update:limit', Number(($event.target as HTMLSelectElement).value))"
          class="bg-gray-50 border-none rounded-xl px-3 py-1.5 text-[10px] font-black focus:ring-1 focus:ring-primary transition-all cursor-pointer"
        >
          <option v-for="n in [5, 10, 20, 50]" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>

      <!-- Navigation -->
      <div class="flex items-center gap-1.5">
        <button 
          @click="$emit('update:currentPage', currentPage - 1)"
          :disabled="currentPage === 1"
          class="w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-transparent disabled:opacity-30 disabled:cursor-not-allowed"
          :class="currentPage > 1 ? 'hover:bg-gray-50 text-primary border-gray-100' : 'text-secondary/40'"
        >
          <LucideChevronLeft :size="18" />
        </button>

        <div class="flex items-center gap-1">
          <button 
            v-for="page in displayedPages" 
            :key="page"
            @click="typeof page === 'number' && $emit('update:currentPage', page)"
            class="min-w-[40px] h-10 rounded-xl text-[11px] font-black transition-all"
            :class="[
              currentPage === page 
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                : 'text-secondary hover:bg-gray-50',
              typeof page !== 'number' ? 'cursor-default' : ''
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button 
          @click="$emit('update:currentPage', currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-transparent disabled:opacity-30 disabled:cursor-not-allowed"
          :class="currentPage < totalPages ? 'hover:bg-gray-50 text-primary border-gray-100' : 'text-secondary/40'"
        >
          <LucideChevronRight :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft as LucideChevronLeft, ChevronRight as LucideChevronRight } from '@lucide/vue'

interface Props {
  total: number
  limit: number
  currentPage: number
}

const props = defineProps<Props>()
const emit = defineEmits(['update:currentPage', 'update:limit'])

const totalPages = computed(() => Math.ceil(props.total / props.limit))
const from = computed(() => ((props.currentPage - 1) * props.limit) + 1)
const to = computed(() => Math.min(props.currentPage * props.limit, props.total))

const displayedPages = computed(() => {
  const pages: (number | string)[] = []
  const maxDisplayed = 5
  
  if (totalPages.value <= maxDisplayed) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  } else {
    pages.push(1)
    if (props.currentPage > 3) pages.push('...')
    
    const start = Math.max(2, props.currentPage - 1)
    const end = Math.min(totalPages.value - 1, props.currentPage + 1)
    
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i)
    }
    
    if (props.currentPage < totalPages.value - 2) pages.push('...')
    if (!pages.includes(totalPages.value)) pages.push(totalPages.value)
  }
  
  return pages
})
</script>
