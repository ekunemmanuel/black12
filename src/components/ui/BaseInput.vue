<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" :for="id" class="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">
      {{ label }}
    </label>
    <div class="relative group">
      <!-- Prefix Slot -->
      <div v-if="$slots.prefix" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
        <slot name="prefix"></slot>
      </div>

      <input
        :id="id"
        :type="type"
        v-model="model"
        :placeholder="placeholder"
        :class="[
          'w-full bg-gray-50/50 border rounded-xl py-3 px-4 text-gray-800 placeholder:text-gray-400 focus:outline-none transition-all duration-200',
          error 
            ? 'border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
            : 'border-gray-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10',
          $slots.prefix ? 'pl-11' : '',
          $slots.suffix || error ? 'pr-11' : ''
        ]"
      />
      
      <!-- Suffix Slot -->
      <div v-if="$slots.suffix || error" class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <slot name="suffix"></slot>
        <AlertCircle v-if="error" :size="18" class="text-red-500" />
      </div>
    </div>
    <p v-if="error" class="text-xs text-red-500 ml-1 font-medium italic">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle } from '@lucide/vue'

const model = defineModel<string | number>()

defineProps<{
  id?: string
  label?: string
  error?: string
  type?: string
  placeholder?: string
}>()
</script>
