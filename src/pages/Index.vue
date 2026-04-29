<template>
  <div class="pt-5 pb-[100px] md:pt-24 min-h-screen">
    <Navbar />
    <main class="container-wide">
      <!-- Mobile Header -->
      <header class="flex justify-between items-center mb-6 md:hidden">
        <div class="user-greeting">
          <p class="text-[0.9rem] text-secondary mb-1">Hello, Welcome 👋</p>
          <p class="text-2xl font-extrabold font-sans tracking-tight">Albert Stevano</p>
        </div>
        <div class="w-[50px] h-[50px] rounded-xl overflow-hidden border border-black/5 shadow-soft">
          <img src="https://i.pravatar.cc/100?u=albert" alt="User Avatar" class="w-full h-full object-cover" />
        </div>
      </header>
      <!-- Hero Section -->
      <section
        class="mb-10 bg-primary rounded-[32px] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 min-h-[300px] md:min-h-[400px]">
        <div class="relative z-10 flex-1 text-center md:text-left">

          <h1 class="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 uppercase">PREMIUM FINDS
            <br /><span class="text-white/40">FROM ₦1,000</span></h1>
          <p class="text-white/70 mb-8 text-sm md:text-base max-w-md font-medium leading-relaxed">
            Experience high-end fashion at thrift prices. Our curated collection brings you luxury staples starting as
            low as ₦1,000.
          </p>
          <router-link to="/shop"
            class="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-xl">
            Explore Collection
            <LucideArrowRight :size="20" />
          </router-link>
        </div>
        <div class="flex-1 relative w-full h-[300px] md:h-full">
          <img
            src="/images/hero_banner.png"
            alt="Hero Image"
            class="w-full h-full object-cover rounded-2xl" />
        </div>
        <!-- Decorative elements -->
        <div class="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </section>

      <!-- New Arrivals Section -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold uppercase tracking-tight">New Arrivals</h2>
          <router-link to="/shop"
            class="text-sm font-bold text-primary underline underline-offset-4 hover:opacity-70 transition-opacity">
            View All
          </router-link>
        </div>
        <div
          class="flex gap-6 overflow-x-auto pb-4 -mx-5 px-5 scroll-smooth scrollbar-hide [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div v-for="product in newArrivals" :key="product.id" class="w-[280px] shrink-0">
            <ProductCard :product="product" />
          </div>
        </div>
      </section>

      <!-- Children's Wear Section -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold uppercase tracking-tight">Kids & Children</h2>
          <router-link to="/shop"
            class="text-sm font-bold text-primary underline underline-offset-4 hover:opacity-70 transition-opacity">
            View All
          </router-link>
        </div>
        <div
          class="flex gap-6 overflow-x-auto pb-4 -mx-5 px-5 scroll-smooth scrollbar-hide [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div v-for="product in childrenProducts" :key="product.id" class="w-[280px] shrink-0">
            <ProductCard :product="product" />
          </div>
        </div>
      </section>

      <!-- Featured Section -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold uppercase tracking-tight">Best Sellers</h2>
          <router-link to="/shop"
            class="text-sm font-bold text-primary underline underline-offset-4 hover:opacity-70 transition-opacity">
            View All
          </router-link>
        </div>

        <div
          class="flex gap-6 overflow-x-auto pb-4 -mx-5 px-5 scroll-smooth scrollbar-hide [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div v-for="product in featuredProducts" :key="product.id" class="w-[280px] shrink-0">
            <ProductCard :product="product" />
          </div>
        </div>
      </section>

      <!-- Accessories Section -->
      <section class="pb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold uppercase tracking-tight">Accessories</h2>
          <router-link to="/shop"
            class="text-sm font-bold text-primary underline underline-offset-4 hover:opacity-70 transition-opacity">
            View All
          </router-link>
        </div>
        <div
          class="flex gap-6 overflow-x-auto pb-4 -mx-5 px-5 scroll-smooth scrollbar-hide [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div v-for="product in accessoriesProducts" :key="product.id" class="w-[280px] shrink-0">
            <ProductCard :product="product" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import {
  ArrowRight as LucideArrowRight
} from '@lucide/vue'
import Navbar from '@/components/Navbar.vue'
import ProductCard from '@/components/ProductCard.vue'
import { products } from '@/store'

const newArrivals = computed(() => products.slice(0, 4))
const featuredProducts = computed(() => products.filter(p => p.featured))
const childrenProducts = computed(() => products.filter(p => p.category === 'Children'))
const accessoriesProducts = computed(() => products.filter(p => p.category === 'Accessories').slice(0, 6))
</script>