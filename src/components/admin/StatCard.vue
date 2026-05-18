<template>
  <div class="bg-white p-5 md:p-8 rounded-premium md:rounded-[32px] shadow-soft border border-gray-100 flex flex-col relative overflow-hidden group hover:shadow-medium transition-all duration-500">
    <!-- Decorative gradient -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full translate-x-16 -translate-y-16 group-hover:bg-primary/5 transition-colors duration-500"></div>
    
    <div class="flex items-center justify-between mb-6 relative z-10">
      <div class="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500" :class="iconBg">
        <component :is="icon" :size="20" class="md:hidden" :class="iconColor" />
        <component :is="icon" :size="24" class="hidden md:block" :class="iconColor" />
      </div>
      <div v-if="trend" class="flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase" 
           :class="trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
        <LucideArrowUp v-if="trend > 0" :size="10" />
        <LucideArrowDown v-else :size="10" />
        {{ Math.abs(trend) }}%
      </div>
    </div>
    
    <div class="relative z-10">
      <p class="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-secondary/40 mb-1 md:mb-2">{{ label }}</p>
      <h3 class="text-xl md:text-3xl font-black tracking-tight md:tracking-tighter text-primary">{{ value }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ArrowUp as LucideArrowUp, 
  ArrowDown as LucideArrowDown 
} from '@lucide/vue'

defineProps<{
  label: string
  value: string | number
  icon: any
  iconBg: string
  iconColor: string
  trend?: number
}>()
</script>
