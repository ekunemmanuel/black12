<template>
  <button :disabled="loading || disabled" :type="type" :class="[
    'relative flex items-center justify-center gap-2 font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size]
  ]">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit">
      <Loader2 :size="20" class="animate-spin" />
    </div>
    <span :class="{ 'opacity-0': loading }" class="flex items-center gap-2">
      <slot name="prefix"></slot>
      <slot></slot>
      <slot name="suffix"></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { Loader2 } from '@lucide/vue'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white' | 'soft'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'secondary',
  size: 'md',
  loading: false,
  disabled: false
})

const variantClasses = {
  primary: 'bg-primary text-white shadow-lg shadow-primary/10 hover:bg-primary/90',
  secondary: 'bg-secondary text-white shadow-lg shadow-secondary/20 hover:opacity-90',
  outline: 'bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-primary',
  white: 'bg-white text-primary border border-gray-100 shadow-sm hover:bg-gray-50',
  soft: 'bg-secondary/10 text-secondary hover:bg-secondary/20'
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3.5 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-2xl'
}
</script>
