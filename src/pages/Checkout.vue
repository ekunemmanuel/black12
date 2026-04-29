<template>
  <div class="min-h-screen pb-12"
  :class="[store.cart.length > 0 ? 'bg-white' : '']">
    <!-- Header -->
    <header
      class="max-w-[1440px] mx-auto px-6 pt-8 pb-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-30 md:hidden">
      <button @click="$router.back()"
        class="w-12 h-12 flex items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-active active:scale-90">
        <LucideChevronLeft :size="24" class="text-black" />
      </button>

      <h1 class="text-xl font-bold tracking-tight text-gray-900">Checkout</h1>

      <div class="size-12">

      </div>
    </header>

    <main class="max-w-[1440px] mx-auto px-6 pt-4 md:pt-32 pb-4">
      <div v-if="store.cart.length === 0" class="py-20 text-center space-y-4">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <LucideShoppingBag :size="32" />
        </div>
        <h2 class="text-xl font-bold">Your cart is empty</h2>
        <p class="text-gray-500">Looks like you haven't added anything yet.</p>
        <router-link to="/"
          class="inline-block px-8 py-3 bg-black text-white rounded-full font-bold transition-active active:scale-95">
          Start Shopping
        </router-link>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 md:gap-24 gap-12 items-start">
        <!-- Left Column: Shipping & Payment -->
        <div class="space-y-12 order-2 md:order-1">
          <!-- Delivery Mode Toggle -->
          <div class="space-y-6">
            <h3 class="text-xl font-bold text-gray-900 tracking-tight">How would you like your order?</h3>
            <div class="flex p-1 bg-gray-100 rounded-2xl w-full max-w-sm">
              <button @click="deliveryMode = 'delivery'"
                class="flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                :class="deliveryMode === 'delivery' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'">
                <LucideMapPin :size="18" />
                Delivery
              </button>
              <button @click="deliveryMode = 'pickup'"
                class="flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                :class="deliveryMode === 'pickup' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'">
                <LucideBuilding2 :size="18" />
                Pickup
              </button>
            </div>
          </div>

          <!-- Personal Information -->
          <div class="space-y-6">
            <h3 class="text-xl font-bold text-gray-900 tracking-tight">Personal Details</h3>
            <div class="grid grid-cols-1 gap-4">
              <BaseInput v-model="form.fullName" label="Full Name" placeholder="John Doe">
                <template #prefix>
                  <LucideUser :size="18" />
                </template>
              </BaseInput>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput v-model="form.phone" type="tel" label="Phone Number" placeholder="+234 ...">
                  <template #prefix>
                    <LucidePhone :size="18" />
                  </template>
                </BaseInput>
                <BaseInput v-model="form.email" type="email" label="Email Address" placeholder="john@example.com">
                  <template #prefix>
                    <LucideMail :size="18" />
                  </template>
                </BaseInput>
              </div>
            </div>
          </div>

          <!-- Shipping Address (Only if delivery) -->
          <div v-if="deliveryMode === 'delivery'" class="space-y-6 ">
            <h3 class="text-xl font-bold text-gray-900 tracking-tight">Shipping Address</h3>
            <div class="grid grid-cols-1 gap-4">
              <BaseInput v-model="form.address" label="Street Address" placeholder="123 Luxury St, Victoria Island">
                <template #prefix>
                  <LucideMapPin :size="18" />
                </template>
              </BaseInput>
              <div class="grid grid-cols-2 gap-4">
                <BaseInput v-model="form.city" label="City" placeholder="Lagos" />
                <BaseInput v-model="form.state" label="State" placeholder="Lagos" />
              </div>
            </div>
          </div>

          <!-- Create Account Toggle -->
          <div class=" flex items-center justify-between group cursor-pointer" @click="createAccount = !createAccount">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-black">
                <LucideUser :size="20" />
              </div>
              <div>
                <p class="font-bold text-gray-900">Create an account?</p>
                <p class="text-sm text-gray-400">Save your details for later</p>
              </div>
            </div>
            <button class="w-12 h-6 rounded-full relative transition-colors duration-300"
              :class="createAccount ? 'bg-black' : 'bg-gray-200'" type="button">
              <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300"
                :class="{ 'translate-x-6': createAccount }"></div>
            </button>
          </div>


        </div>

        <!-- Right Column: Order Review -->
        <div class="space-y-12 order-2 md:sticky md:top-36">
          <!-- Items List -->
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900 tracking-tight">Order Review</h3>
              <span class="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500">{{ totalItems }}
                items</span>
            </div>

            <div class="divide-y divide-gray-100">
              <div v-for="(item, index) in store.cart" :key="index" class="flex gap-4 py-4 group first:pt-0">
                <div class="w-20 h-20 shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
                  <img :src="item.product.image" :alt="item.product.name"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div class="flex-1 flex flex-col justify-center gap-1">
                  <div class="flex justify-between items-start">
                    <h4 class="font-bold text-gray-900">{{ item.product.name }}</h4>
                    <button @click="store.removeFromCart(index)"
                      class="p-1 text-gray-300 hover:text-red-500 transition-colors">
                      <LucideTrash2 :size="16" />
                    </button>
                  </div>
                  <p class="text-xs text-gray-400">{{ item.product.category }} • {{ item.color || 'Modern Black' }}</p>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-sm font-bold text-gray-900">₦{{ (item.product.price * item.quantity).toLocaleString() }}</span>
                    <span class="text-xs font-medium text-gray-400">Qty: {{ item.quantity }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Price Summary -->
          <div class="space-y-6 ">
            <div class="space-y-4">
              <div class="flex justify-between text-gray-500 font-medium">
                <span>Items Subtotal</span>
                <span class="text-gray-900 font-bold">₦{{ subTotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-gray-500 font-medium h-6">
                <span>Shipping Fee</span>
                <span v-if="deliveryMode === 'delivery'" class="text-gray-900 font-bold ">₦{{
                  deliveryFee.toLocaleString() }}</span>
                <span v-else
                  class="text-green-500 font-bold  uppercase text-[10px] tracking-widest bg-green-50 px-2 flex items-center rounded-lg">Free</span>
              </div>
              <div class="pt-4 border-t border-gray-200 flex justify-between items-center">
                <div>
                  <span class="text-gray-900 font-bold text-lg">Total Amount</span>
                  <p class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Including VAT</p>
                </div>
                <span class="text-3xl font-bold text-gray-900 tracking-tighter">₦{{ Number(grandTotal).toLocaleString() }}</span>
              </div>
            </div>

            <!-- Pay Button (Desktop) -->
            <button @click="processPayment"
              class="w-full h-16 bg-black text-white rounded-3xl font-bold text-lg transition-active active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              :disabled="isProcessing">
              <LucideLoader2 v-if="isProcessing" class="animate-spin" />
              <template v-else>
                <span>Complete Purchase</span>
                <LucideCheck :size="20" class="transition-transform group-hover:scale-110" />
              </template>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Processing Overlay -->
    <div v-if="isProcessing"
      class="fixed inset-0 h-screen bg-white/60 backdrop-blur-sm z-10000 flex items-center justify-center">
      <div class="flex flex-col items-center gap-4">
        <LucideLoader2 :size="48" class="text-black animate-spin" />
        <p class="font-bold text-lg animate-pulse">Processing Payment...</p>
      </div>
    </div>

    <!-- Success Overlay -->
    <div v-if="showSuccess"
      class="fixed inset-0 bg-white z-200 flex items-center justify-center px-6 transition-all duration-700 ">
      <div class="max-w-md w-full text-center space-y-8">
        <div
          class="w-24 h-24 bg-[#34C759] rounded-full flex items-center justify-center mx-auto text-white shadow-xl animate-scale-up">
          <LucideCheck :size="48" stroke-width="3" />
        </div>

        <div class="space-y-3">
          <h2 class="text-3xl font-bold tracking-tight">Payment Successful!</h2>
          <p class="text-gray-500 text-lg">Thank you for choosing Black 12. Your order is being prepared and will be
            with you soon.</p>
        </div>

        <div class="pt-8">
          <button @click="finishCheckout"
            class="w-full h-16 bg-black text-white rounded-3xl font-bold text-lg transition-active active:scale-95 shadow-xl">
            Return Home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronLeft as LucideChevronLeft,
  ShoppingBag as LucideShoppingBag,
  Trash2 as LucideTrash2,
  Loader2 as LucideLoader2,
  Check as LucideCheck,
  User as LucideUser,
  Phone as LucidePhone,
  Mail as LucideMail,
  MapPin as LucideMapPin,
  Building2 as LucideBuilding2
} from '@lucide/vue'
import BaseInput from '../components/ui/BaseInput.vue'
import { store } from '../store'

const router = useRouter()
const isProcessing = ref(false)
const showSuccess = ref(false)

// New States for Advanced Flow
const deliveryMode = ref<'delivery' | 'pickup'>('delivery')
const createAccount = ref(false)

const form = ref({
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: ''
})

const deliveryFee = computed(() => deliveryMode.value === 'delivery' ? 2500 : 0)

const totalItems = computed(() => store.cart.reduce((acc, item) => acc + item.quantity, 0))
const subTotal = computed(() => store.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0))
const grandTotal = computed(() => (subTotal.value + deliveryFee.value).toFixed(2))

const processPayment = () => {
  isProcessing.value = true
  setTimeout(() => {
    isProcessing.value = false
    showSuccess.value = true
    store.cart = [] // Clear cart after success
  }, 10500)
}

const finishCheckout = () => {
  router.push('/')
}

const isScrollActive = ref(false)

const handleScroll = () => {
  // Trigger visibility when user starts scrolling anywhere on mobile
  if (window.innerWidth < 768) {
    if (window.scrollY > 10) {
      isScrollActive.value = true
    } else {
      isScrollActive.value = false
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
