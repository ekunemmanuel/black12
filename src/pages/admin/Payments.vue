<template>
  <div class="space-y-8 pb-10">
    <!-- Header & Stats -->
    <div class="space-y-8">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto ml-auto">
          <BaseInput v-model="searchQuery" class="w-full sm:min-w-[400px]" placeholder="Search Transaction ID, Customer...">
            <template #prefix>
              <LucideSearch :size="18" class="text-secondary/40 transition-colors" />
            </template>
          </BaseInput>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Transactions" 
          :value="store.payments.length.toString()" 
          :icon="LucideCreditCard" 
          iconBg="bg-blue-50" 
          iconColor="text-blue-600"
          :trend="15.4"
        />
        <StatCard 
          label="Revenue" 
          :value="'₦' + store.payments.filter(p => p.status === 'successful').reduce((acc, p) => acc + p.amount, 0).toLocaleString()" 
          :icon="LucideDollarSign" 
          iconBg="bg-green-50" 
          iconColor="text-green-600"
          :trend="12.2"
        />
        <StatCard 
          label="Successful" 
          :value="store.payments.filter(p => p.status === 'successful').length.toString()" 
          :icon="LucideCheckCircle" 
          iconBg="bg-green-50" 
          iconColor="text-green-600"
        />
        <StatCard 
          label="Pending" 
          :value="store.payments.filter(p => p.status === 'pending').length.toString()" 
          :icon="LucideClock" 
          iconBg="bg-yellow-50" 
          iconColor="text-yellow-600"
        />
      </div>
    </div>

    <!-- Filters Row -->
    <div class="flex gap-4 overflow-x-auto -mx-2 px-2 scrollbar-hide shrink-0">
      <button v-for="status in allStatuses" :key="status" @click="statusFilter = status"
        class="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-soft shrink-0 border border-gray-100"
        :class="statusFilter === status ? 'bg-primary text-white' : 'bg-white text-secondary hover:bg-gray-50'">
        {{ status }}
      </button>
    </div>

    <!-- Payments Table -->
    <div class="bg-white rounded-[30px] overflow-hidden shadow-soft border border-gray-100">
      <div class="overflow-x-auto">
        <table v-if="paginatedPayments.length > 0" class="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr class="bg-gray-50/50">
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Transaction</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Customer</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Amount</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Order ID</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Status</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Date</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="payment in paginatedPayments" :key="payment.id"
              class="group hover:bg-gray-50/30 transition-all duration-300">
               <td class="px-8 py-6 whitespace-nowrap">
                <span class="font-mono text-xs font-black text-primary tracking-tighter">{{ payment.id }}</span>
              </td>
              <td class="px-8 py-6 whitespace-nowrap">
                <span class="text-sm font-black text-primary leading-none tracking-tight">{{ payment.customerName }}</span>
              </td>
              <td class="px-8 py-6 text-sm font-black text-primary whitespace-nowrap">₦{{ payment.amount.toLocaleString() }}</td>
              <td class="px-8 py-6">
                <button 
                  @click="navigateToOrder(payment.orderId)"
                  class="text-[10px] text-primary font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                >
                  {{ payment.orderId }}
                </button>
              </td>
              <td class="px-8 py-6">
                <span class="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider"
                  :class="getStatusClass(payment.status)">
                  {{ payment.status }}
                </span>
              </td>
               <td class="px-8 py-6 text-xs text-secondary/40 font-black uppercase tracking-widest whitespace-nowrap">{{ formatDate(payment.date) }}</td>
              <td class="px-8 py-6 text-right">
                <button @click="viewPaymentDetails(payment)"
                  class="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors">
                  View details
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Premium Empty State -->
        <div v-else
          class="flex-1 flex flex-col items-center justify-center p-20 text-center animate-in fade-in zoom-in duration-700">
          <div
            class="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center text-secondary/20 mb-8 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div
              class="absolute inset-0 bg-linear-to-tr from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000">
            </div>
            <LucideCreditCard :size="40" class="relative z-10" />
          </div>
          <h3 class="text-xl font-black text-primary mb-3 uppercase tracking-tighter">No transactions found</h3>
          <p class="text-sm text-secondary/40 max-w-xs mx-auto leading-relaxed font-medium">
            {{ searchQuery || statusFilter !== 'All Transactions'
              ? "We couldn't find any payments matching your current search or filters. Try adjusting them."
              : "Your transaction history is currently empty. Payments will appear here as they are processed."
            }}
          </p>
          <div class="mt-10">
            <BaseButton v-if="searchQuery || statusFilter !== 'All Transactions'" variant="outline"
              class="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]" @click="clearFilters">
              Clear all filters
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <BasePagination v-model:current-page="currentPage" v-model:limit="itemsPerPage"
        :total="filteredPayments.length" />
    </div>

    <!-- Transaction Details Drawer -->
    <BaseDrawer v-model="isDetailsOpen" title="Transaction Details" :subtitle="'Reference: ' + selectedPayment?.id">
      <div v-if="selectedPayment" class="space-y-12">
        <!-- Amount Section (Simplified) -->
        <div class="text-center pt-4">
          <p class="text-[10px] font-black uppercase tracking-widest text-secondary/40 mb-2">Transaction Amount</p>
          <h3 class="text-4xl font-black text-primary tracking-tighter">₦{{ selectedPayment.amount.toLocaleString() }}
          </h3>
        </div>

        <!-- Payment Info (Flat) -->
        <div class="space-y-6">
          <div class="flex justify-between items-center py-4">
            <span class="text-[10px] font-black uppercase tracking-widest text-secondary/40">Status</span>
            <span class="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider"
              :class="getStatusClass(selectedPayment.status)">
              {{ selectedPayment.status }}
            </span>
          </div>
          <div class="flex justify-between items-center py-4">
            <span class="text-[10px] font-black uppercase tracking-widest text-secondary/40">Date & Time</span>
            <span class="text-xs font-bold text-primary">{{ formatDate(selectedPayment.date) }}</span>
          </div>
          <div class="flex justify-between items-center py-4">
            <span class="text-[10px] font-black uppercase tracking-widest text-secondary/40">Related Order</span>
            <button 
              @click="navigateToOrder(selectedPayment.orderId)"
              class="text-xs font-bold text-primary uppercase hover:underline decoration-2 underline-offset-4"
            >
              {{ selectedPayment.orderId }}
            </button>
          </div>
          <div class="flex justify-between items-center py-4 ">
            <span class="text-[10px] font-black uppercase tracking-widest text-secondary/40">Currency</span>
            <span class="text-xs font-bold text-primary">NGN</span>
          </div>
        </div>

        <!-- Customer Details (Flat) -->
        <div class="space-y-6">
          <h4 class="text-[10px] font-black uppercase tracking-widest text-secondary/40">Customer Details</h4>
          <div class="flex items-center justify-between group cursor-pointer">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                <LucideUsers :size="20" class="text-primary" />
              </div>
              <div>
                <p class="text-sm font-bold text-primary leading-tight">{{ selectedPayment.customerName }}</p>
                <p class="text-[10px] text-secondary font-medium mt-0.5">Customer ID: CUST-{{
                  selectedPayment.id.split('-')[1] }}</p>
              </div>
            </div>
            <LucideExternalLink :size="14" class="text-secondary/20 group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-4 w-full">
          <BaseButton v-if="selectedPayment?.status === 'successful'" variant="outline"
            class="flex-1 py-4 text-xs font-black uppercase tracking-widest text-red-500 border-red-100 hover:bg-red-50"
            @click="handleRefund(selectedPayment.id)">
            <LucideRefreshCcw :size="14" class="mr-2" />
            Initiate Refund
          </BaseButton>
          <BaseButton variant="primary" class="flex-1 py-4 text-xs font-black uppercase tracking-widest"
            @click="isDetailsOpen = false">
            Close details
          </BaseButton>
        </div>
      </template>
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Search as LucideSearch,
  CreditCard as LucideCreditCard,
  DollarSign as LucideDollarSign,
  CheckCircle as LucideCheckCircle,
  Clock as LucideClock,
  RefreshCcw as LucideRefreshCcw,
  ExternalLink as LucideExternalLink,
  Users as LucideUsers
} from '@lucide/vue'
import StatCard from '@/components/admin/StatCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'
import { store, type Payment } from '@/store'
import { formatDate } from '@/utils'

const router = useRouter()
const searchQuery = ref('')
const statusFilter = ref('All Transactions')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const isDetailsOpen = ref(false)
const selectedPayment = ref<Payment | null>(null)

const navigateToOrder = (orderId: string) => {
  router.push({ name: 'AdminOrders', query: { open: orderId } })
}

const allStatuses = ['All Transactions', 'successful', 'pending', 'failed', 'refunded']

const filteredPayments = computed(() => {
  let result = store.payments

  if (statusFilter.value !== 'All Transactions') {
    result = result.filter(p => p.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.id.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q)
    )
  }

  return result
})

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPayments.value.slice(start, end)
})

watch([searchQuery, statusFilter, itemsPerPage], () => {
  currentPage.value = 1
})

const getStatusClass = (status: string) => {
  switch (status) {
    case 'successful': return 'bg-green-50 text-green-600'
    case 'pending': return 'bg-yellow-50 text-yellow-600'
    case 'failed': return 'bg-red-50 text-red-600'
    case 'refunded': return 'bg-gray-50 text-gray-500'
    default: return 'bg-gray-50 text-gray-600'
  }
}

const viewPaymentDetails = (payment: Payment) => {
  selectedPayment.value = payment
  isDetailsOpen.value = true
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'All Transactions'
}

const handleRefund = (id: string) => {
  store.refundPayment(id)
  if (selectedPayment.value?.id === id) {
    selectedPayment.value = store.payments.find(p => p.id === id) || null
  }
}
</script>
