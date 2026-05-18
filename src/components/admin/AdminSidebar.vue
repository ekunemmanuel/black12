<template>
  <aside
    class="bg-primary h-screen sticky top-0 flex flex-col text-white z-50 shadow-2xl transition-[width,padding] duration-500 ease-in-out w-72 md:w-auto"
    :class="isCollapsed ? 'md:w-24 p-4' : 'md:w-72 p-4'">
    <!-- Decorative elements -->
    <div class="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>

    <!-- Logo -->
    <div class="mb-12 relative z-10 flex items-center gap-3" :class="isCollapsed ? 'justify-center' : ''">
      <router-link to="/" class="flex items-center gap-3 group" :class="isCollapsed ? 'justify-center' : ''">
        <div
          class="bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden shrink-0"
          :class="isCollapsed ? 'w-12 h-12 p-2' : 'w-10 h-10 p-1.5'">
          <img src="/favicon.svg" alt="B" class="w-full h-full object-contain" />
        </div>
        <span v-if="!isCollapsed" class="font-mono text-xl tracking-widest uppercase font-black whitespace-nowrap">Black
          12</span>
      </router-link>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-2 relative z-10 overflow-y-auto">
      <router-link v-for="item in navItems" :key="item.path" :to="item.path"
        class="flex items-center rounded-2xl transition-all group overflow-hidden" :class="[
          isActive(item.path) ? 'bg-white text-primary font-bold shadow-xl shadow-white/10' : 'text-white/60 hover:text-white hover:bg-white/5',
          isCollapsed ? 'justify-center p-4' : 'gap-4 px-4 py-4'
        ]" :title="isCollapsed ? item.name : ''">
        <component :is="item.icon" :size="22" class="transition-transform group-hover:scale-110 shrink-0" />
        <span v-if="!isCollapsed" class="text-sm font-medium tracking-tight uppercase whitespace-nowrap">{{ item.name
          }}</span>
      </router-link>
    </nav>

    <!-- Footer / Logout -->
    <div class="pt-4 border-t border-white/10 relative z-10">
      <button @click="logout"
        class="w-full flex items-center rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all text-xs font-bold uppercase tracking-widest"
        :class="isCollapsed ? 'justify-center p-4' : 'gap-3 p-4'" :title="isCollapsed ? 'Logout' : ''">
        <LucideLogOut :size="20" class="shrink-0" />
        <span v-if="!isCollapsed">Logout</span>
      </button>
    </div>

    <!-- Edge Toggle Button -->
    <button @click="$emit('toggle')"
      class="absolute top-10 -right-4 w-8 h-8 rounded-full bg-primary border-2 border-white shadow-xl hidden md:flex items-center justify-center text-white hover:scale-110 transition-all z-50 group">
      <LucideChevronLeft v-if="!isCollapsed" :size="16" class="group-hover:-translate-x-0.5 transition-transform" />
      <LucideChevronRight v-else :size="16" class="group-hover:translate-x-0.5 transition-transform" />
    </button>
  </aside>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard as LucideLayoutDashboard,
  Package as LucidePackage,
  ShoppingBag as LucideShoppingBag,
  Users as LucideUsers,
  LogOut as LucideLogOut,
  ChevronLeft as LucideChevronLeft,
  ChevronRight as LucideChevronRight,
  CreditCard as LucideCreditCard
} from '@lucide/vue'

defineProps<{
  isCollapsed: boolean
}>()

defineEmits(['toggle'])

const route = useRoute()
const router = useRouter()

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LucideLayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: LucidePackage },
  { name: 'Orders', path: '/admin/orders', icon: LucideShoppingBag },
  { name: 'Customers', path: '/admin/customers', icon: LucideUsers },
  { name: 'Payments', path: '/admin/payments', icon: LucideCreditCard },
]

const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}

const logout = () => {
  router.push('/')
}
</script>
