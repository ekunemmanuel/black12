<template>
  <div class="space-y-10">
    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
      <StatCard 
        label="Total Revenue" 
        :value="'₦' + store.orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()" 
        :icon="LucideDollarSign" 
        iconBg="bg-blue-50" 
        iconColor="text-blue-600"
        :trend="12.5"
      />
      <StatCard 
        label="Total Orders" 
        :value="store.orders.length.toString()" 
        :icon="LucideShoppingBag" 
        iconBg="bg-purple-50" 
        iconColor="text-purple-600"
        :trend="8.2"
      />
      <StatCard 
        label="Active Customers" 
        :value="store.customers.length.toLocaleString()" 
        :icon="LucideUsers" 
        iconBg="bg-orange-50" 
        iconColor="text-orange-600"
        :trend="4.1"
      />
      <StatCard 
        label="Successful Payments" 
        :value="store.payments.filter(p => p.status === 'successful').length.toString()" 
        :icon="LucideCreditCard" 
        iconBg="bg-green-50" 
        iconColor="text-green-600"
        :trend="15.4"
      />
    </div>

    <!-- Charts & Tables Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <!-- Recent Activity Tabs -->
      <div class="lg:col-span-2 bg-white rounded-[30px] md:rounded-[40px] p-6 md:p-10 shadow-soft border border-gray-100 flex flex-col">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
          <div>
            <h3 class="text-2xl font-black tracking-tight uppercase text-primary">Recent Activity</h3>
            <p class="text-xs text-secondary font-bold uppercase tracking-widest mt-1">Real-time update of your store</p>
          </div>
          
          <!-- Tabs -->
          <div class="bg-gray-50 p-1.5 rounded-2xl flex items-center shrink-0">
            <button 
              @click="activeTab = 'orders'"
              class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all w-full"
              :class="activeTab === 'orders' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-primary'"
            >
              Orders
            </button>
            <button 
              @click="activeTab = 'payments'"
              class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all w-full"
              :class="activeTab === 'payments' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-primary'"
            >
              Payments
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-x-auto min-h-[400px]">
          <!-- Orders Table -->
          <table v-if="activeTab === 'orders'" class="w-full text-left min-w-[800px]">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="pb-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Order ID</th>
                <th class="pb-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Customer</th>
                <th class="pb-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 text-right">Amount</th>
                <th class="pb-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 text-center">Status</th>
                <th class="pb-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 text-center">Payment ID</th>
                <th class="pb-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 text-right">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="order in store.orders.slice(0, 6)" :key="order.id" class="group transition-colors">
                <td class="py-6">
                  <router-link :to="`/admin/orders`" class="text-xs font-black text-primary font-mono hover:text-blue-600 transition-colors">{{ order.id }}</router-link>
                </td>
                <td class="py-6 pr-4">
                  <div class="flex flex-col whitespace-nowrap">
                    <span class="text-sm font-black text-primary">{{ order.customerName }}</span>
                    <span class="text-[10px] text-secondary font-bold mt-0.5">{{ order.phoneNumber }}</span>
                  </div>
                </td>
                <td class="py-6 text-right">
                  <span class="text-sm font-black text-primary">₦{{ order.total.toLocaleString() }}</span>
                </td>
                <td class="py-6 text-center">
                  <span class="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-block min-w-[90px]" 
                        :class="getStatusClass(order.status)">
                    {{ order.status }}
                  </span>
                </td>
                <td class="py-6 text-center">
                  <router-link 
                    v-if="getPaymentByOrder(order.id)" 
                    :to="`/admin/payments`"
                    class="text-[10px] font-black text-secondary font-mono bg-gray-50 px-2 py-1 rounded hover:bg-gray-100 hover:text-primary transition-all"
                  >
                    {{ getPaymentByOrder(order.id)?.id }}
                  </router-link>
                  <span v-else class="text-[9px] text-secondary/40 font-black italic">No Payment</span>
                </td>
                <td class="py-6 text-right whitespace-nowrap">
                  <span class="text-[10px] text-secondary font-bold uppercase tracking-tight">{{ formatDate(order.date) }}</span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Payments Table -->
          <table v-else class="w-full text-left min-w-[800px]">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="pb-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Payment ID</th>
                <th class="pb-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Customer</th>
                <th class="pb-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 text-right">Amount</th>
                <th class="pb-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 text-center">Status</th>
                <th class="pb-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 text-center">Order ID</th>
                <th class="pb-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 text-right">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="payment in store.payments.slice(0, 6)" :key="payment.id" class="group transition-colors">
                <td class="py-6">
                  <router-link :to="`/admin/payments`" class="text-xs font-black text-primary font-mono hover:text-blue-600 transition-colors">{{ payment.id }}</router-link>
                </td>
                <td class="py-6 pr-4">
                  <div class="flex flex-col whitespace-nowrap">
                    <span class="text-sm font-black text-primary">{{ payment.customerName }}</span>
                    <span class="text-[10px] text-secondary font-bold mt-0.5">{{ payment.method }}</span>
                  </div>
                </td>
                <td class="py-6 text-right">
                  <span class="text-sm font-black text-primary">₦{{ payment.amount.toLocaleString() }}</span>
                </td>
                <td class="py-6 text-center">
                  <span class="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-block min-w-[90px]" 
                        :class="getPaymentStatusClass(payment.status)">
                    {{ payment.status }}
                  </span>
                </td>
                <td class="py-6 text-center">
                  <router-link 
                    :to="`/admin/orders`"
                    class="text-[10px] font-black text-secondary font-mono bg-gray-50 px-2 py-1 rounded hover:bg-gray-100 hover:text-primary transition-all"
                  >
                    {{ payment.orderId }}
                  </router-link>
                </td>
                <td class="py-6 text-right whitespace-nowrap">
                  <span class="text-[10px] text-secondary font-bold uppercase tracking-tight">{{ formatDate(payment.date) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer Button -->
        <div class="mt-8 pt-8 border-t border-gray-50">
          <router-link 
            :to="activeTab === 'orders' ? '/admin/orders' : '/admin/payments'"
            class="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 text-primary transition-all group"
          >
            <span class="text-[10px] font-black uppercase tracking-[0.2em]">View All {{ activeTab }}</span>
            <LucideArrowRight :size="14" class="group-hover:translate-x-1 transition-transform" />
          </router-link>
        </div>
      </div>

      <!-- Sidebar Area -->
      <div class="space-y-10">
        <!-- Performance -->
        <div class="bg-primary rounded-[30px] md:rounded-[40px] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-primary/30 flex-1 flex flex-col min-h-[400px]">
          <div class="absolute top-[-20%] right-[-10%] w-60 h-60 bg-white/5 rounded-full blur-[80px]"></div>
          <div class="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-white/5 rounded-full blur-[60px]"></div>
          
          <h3 class="text-xl font-bold tracking-tight uppercase mb-8 relative z-10">Inventory Status</h3>
          <div class="space-y-8 relative z-10 flex-1">
            <div v-for="cat in categories" :key="cat.name" class="space-y-3">
              <div class="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span class="text-white/60">{{ cat.name }}</span>
                <span>{{ cat.percentage }}%</span>
              </div>
              <div class="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-white rounded-full transition-all duration-1000 ease-out" :style="{ width: cat.percentage + '%' }"></div>
              </div>
            </div>
          </div>
          
          <BaseButton 
            variant="white" 
            class="w-full relative z-10 py-4 text-[10px] tracking-[0.2em] font-black uppercase shadow-xl hover:scale-[1.02] mt-8"
          >
            Add New Product
          </BaseButton>
        </div>

        <!-- Location Insights -->
        <div class="bg-white rounded-[30px] md:rounded-[40px] p-6 md:p-10 border border-gray-100 shadow-soft">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-lg font-black tracking-tight uppercase text-primary">Top Locations</h3>
            <div class="p-2 bg-blue-50 rounded-xl">
              <LucideMapPin :size="16" class="text-blue-600" />
            </div>
          </div>
          
          <div class="space-y-6">
            <div v-for="loc in locations" :key="loc.city" class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xs font-black text-primary">
                {{ loc.city.substring(0, 1) }}
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-[10px] font-black uppercase tracking-widest text-primary">{{ loc.city }}</span>
                  <span class="text-[10px] font-bold text-secondary">{{ loc.orders }} orders</span>
                </div>
                <div class="h-1 bg-gray-50 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-600 rounded-full" :style="{ width: loc.percentage + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
          
          <button class="w-full mt-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors border-t border-gray-50">
            View Global Insights
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  DollarSign as LucideDollarSign,
  ShoppingBag as LucideShoppingBag,
  Users as LucideUsers,
  CreditCard as LucideCreditCard,
  ArrowRight as LucideArrowRight,
  MapPin as LucideMapPin
} from '@lucide/vue'
import StatCard from '@/components/admin/StatCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { store } from '@/store'
import { formatDate } from '@/utils'

const activeTab = ref<'orders' | 'payments'>('orders')

const categories = [
  { name: 'T-Shirts', percentage: 75 },
  { name: 'Dresses', percentage: 45 },
  { name: 'Jackets', percentage: 30 },
  { name: 'Knitwear', percentage: 60 },
]

const locations = [
  { city: 'Lagos', orders: 842, percentage: 85 },
  { city: 'Abuja', orders: 425, percentage: 60 },
  { city: 'Port Harcourt', orders: 310, percentage: 45 },
  { city: 'Ibadan', orders: 195, percentage: 25 },
]

const getStatusClass = (status: string) => {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-600'
    case 'processing': return 'bg-blue-100 text-blue-600'
    case 'pending': return 'bg-yellow-100 text-yellow-600'
    case 'cancelled': return 'bg-red-100 text-red-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getPaymentStatusClass = (status: string) => {
  switch (status) {
    case 'successful': return 'bg-green-100 text-green-600'
    case 'pending': return 'bg-yellow-100 text-yellow-600'
    case 'failed': return 'bg-red-100 text-red-600'
    case 'refunded': return 'bg-gray-100 text-gray-500'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getPaymentByOrder = (orderId: string) => {
  return store.payments.find(p => p.orderId === orderId)
}

</script>
