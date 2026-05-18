<template>
  <div class="space-y-8 pb-10">
    <!-- Header & Stats -->
    <div class="space-y-8">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto ml-auto">
          <BaseInput v-model="searchQuery" class="w-full sm:min-w-[400px]" placeholder="Search Order ID, Customer Name...">
            <template #prefix>
              <LucideSearch :size="18" class="text-secondary/40 transition-colors" />
            </template>
          </BaseInput>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Total Orders" 
          :value="store.orders.length.toString()" 
          :icon="LucideShoppingBag" 
          iconBg="bg-blue-50" 
          iconColor="text-blue-600"
          :trend="12.5"
        />
        <StatCard 
          label="Total Sales" 
          :value="'₦' + totalSales.toLocaleString()" 
          :icon="LucideDollarSign" 
          iconBg="bg-green-50" 
          iconColor="text-green-600"
          :trend="8.2"
        />
        <StatCard 
          label="Pending" 
          :value="store.orders.filter(o => o.status === 'pending').length.toString()" 
          :icon="LucideClock" 
          iconBg="bg-yellow-50" 
          iconColor="text-yellow-600"
        />
        <StatCard 
          label="Delivered" 
          :value="store.orders.filter(o => o.status === 'delivered').length.toString()" 
          :icon="LucideCheckCircle" 
          iconBg="bg-purple-50" 
          iconColor="text-purple-600"
        />
      </div>
    </div>

    <!-- Filters Row -->
    <div class="flex gap-4 overflow-x-auto -mx-2 px-2 scrollbar-hide shrink-0">
      <button v-for="status in allStatuses" :key="status" @click="activeStatusFilter = status"
        class="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-soft shrink-0 border border-gray-100"
        :class="activeStatusFilter === status ? 'bg-primary text-white' : 'bg-white text-secondary hover:bg-gray-50'">
        {{ status }}
      </button>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-[30px] overflow-hidden shadow-soft border border-gray-100">
      <div class="overflow-x-auto">
        <table v-if="paginatedOrders.length > 0" class="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            <tr class="bg-gray-50/50">
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Order Details
              </th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Customer</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Amount</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Status</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Payment</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="order in paginatedOrders" :key="order.id"
              class="group hover:bg-gray-50/30 transition-all duration-300">
              <td class="px-8 py-6 whitespace-nowrap">
                <div class="space-y-1">
                  <p class="text-sm font-black text-primary font-mono tracking-tighter">{{ order.id }}</p>
                  <p class="text-[10px] font-black tracking-widest uppercase text-secondary/40">{{ formatDate(order.date) }}</p>
                </div>
              </td>
              <td class="px-8 py-6 whitespace-nowrap">
                <div class="space-y-1">
                  <p class="text-sm font-black text-primary leading-none tracking-tight">{{ order.customerName }}</p>
                  <p class="text-[10px] font-black tracking-widest text-secondary/40">{{ order.phoneNumber }}</p>
                </div>
              </td>
              <td class="px-8 py-6 whitespace-nowrap">
                <p class="text-sm font-black text-primary">₦{{ order.total.toLocaleString() }}</p>
                <p class="text-[10px] text-secondary/40 uppercase font-black tracking-widest mt-1">{{ order.items.length }} Items</p>
              </td>
              <td class="px-8 py-6">
                <div class="relative group/status inline-block">
                  <span
                    class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all hover:scale-105"
                    :class="getStatusClass(order.status)">
                    {{ order.status }}
                  </span>
                  <!-- Quick Status Switcher -->
                  <div
                    class="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-20 opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all duration-300 w-40">
                    <button v-for="status in ['pending', 'processing', 'shipped', 'delivered', 'cancelled']"
                      :key="status" @click="updateStatus(order.id, status as any)"
                      class="w-full text-left px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-gray-50 transition-colors"
                      :class="order.status === status ? 'text-primary' : 'text-secondary/40'">
                      {{ status }}
                    </button>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full"
                    :class="order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'"></div>
                  <span class="text-xs font-bold text-primary uppercase tracking-tight">{{ order.paymentStatus }}</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <button @click="viewOrderDetails(order)"
                  class="text-secondary hover:text-primary text-xs cursor-pointer tracking-wider">
                  view details
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
            <LucideShoppingBag :size="40" class="relative z-10" />
          </div>
          <h3 class="text-xl font-black text-primary mb-3 uppercase tracking-tighter">No orders to display</h3>
          <p class="text-sm text-secondary/40 max-w-xs mx-auto leading-relaxed font-medium">
            {{ searchQuery || activeStatusFilter !== 'All Orders'
              ? "We couldn't find any orders matching your current search or filters. Try adjusting them."
              : "Your order list is currently empty. New orders will appear here once customers start purchasing."
            }}
          </p>
          <div class="mt-10">
            <BaseButton v-if="searchQuery || activeStatusFilter !== 'All Orders'" variant="outline"
              class="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]" @click="clearFilters">
              Clear all filters
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <BasePagination v-model:current-page="currentPage" v-model:limit="itemsPerPage" :total="filteredOrders.length" />
    </div>

    <!-- Order Details Drawer -->
    <BaseDrawer v-model="isDetailsOpen" title="Order Details" :subtitle="'Viewing ' + selectedOrder?.id">
      <div v-if="selectedOrder" class="space-y-10">
        <!-- Status Banner -->
        <div class="p-6 rounded-premium flex items-center justify-between"
          :class="getStatusClass(selectedOrder.status)">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">Current Status</p>
            <p class="text-xl font-black uppercase tracking-tight">{{ selectedOrder.status }}</p>
          </div>
          <LucideShoppingBag :size="32" class="opacity-20" />
        </div>

        <!-- Customer Info -->
        <div class="space-y-4">
          <h4 class="text-xs font-black uppercase tracking-widest text-secondary/40">Customer Information</h4>
          <div class="flex flex-col gap-1">
            <p class="text-base font-bold text-primary">{{ selectedOrder.customerName }}</p>
            <p class="text-sm text-secondary">{{ getCustomerEmail(selectedOrder.customerId) }}</p>
            <p class="text-sm text-secondary font-medium">{{ selectedOrder.phoneNumber }}</p>
          </div>
        </div>

        <!-- Items -->
        <div class="space-y-4">
          <h4 class="text-xs font-black uppercase tracking-widest text-secondary/40">Order Items</h4>
          <div class="space-y-6">
            <div v-for="item in selectedOrder.items" :key="item.productId" class="flex items-center gap-5">
              <div class="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                <img :src="getProductImage(item.productId)" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-bold text-primary mb-0.5">{{ getProductName(item.productId) }}</p>
                <p class="text-xs text-secondary/60 font-medium">Qty: {{ item.quantity }} × ₦{{
                  item.price.toLocaleString()
                }}</p>
              </div>
              <p class="text-sm font-black text-primary">₦{{ (item.quantity * item.price).toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <!-- Status Update -->
        <div class="space-y-4 pt-6 border-t border-gray-100">
          <h4 class="text-xs font-black uppercase tracking-widest text-secondary/40">Update Order Status</h4>
          <div class="flex flex-wrap gap-2">
            <button v-for="status in ['pending', 'processing', 'shipped', 'delivered', 'cancelled']" :key="status"
              @click="updateStatus(selectedOrder.id, status as any)"
              class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2"
              :class="selectedOrder.status === status
                ? getStatusClass(status) + ' border-current'
                : 'bg-gray-50 text-secondary/40 border-transparent hover:border-gray-200'">
              {{ status }}
            </button>
          </div>

          <div class="mt-4">
            <label class="text-[10px] font-black uppercase tracking-widest text-secondary/40 mb-2 block">Reason / Notes
              (Optional)</label>
            <textarea v-model="orderUpdateReason" rows="3"
              placeholder="Enter reason for status change or internal notes..."
              class="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-1 focus:ring-primary transition-all resize-none"></textarea>
          </div>
        </div>

        <!-- Summary -->
        <div class="pt-6 border-t border-gray-100 space-y-3">
          <div class="flex justify-between text-sm font-medium text-secondary">
            <span>Subtotal</span>
            <span>₦{{ selectedOrder.total.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-sm font-medium text-secondary">
            <span>Shipping</span>
            <span>₦0.00</span>
          </div>
          <div class="flex justify-between text-lg font-black text-primary pt-3 border-t border-gray-50">
            <span>Total</span>
            <span>₦{{ selectedOrder.total.toLocaleString() }}</span>
          </div>
        </div>

        <!-- Order History (Tracking) -->
        <div class="space-y-6 pt-6 border-t border-gray-100">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-black uppercase tracking-widest text-secondary/40">Order History</h4>
            <LucideClock :size="14" class="text-secondary/20" />
          </div>

          <div class="relative space-y-8 pl-4">
            <!-- Connector Line -->
            <div class="absolute left-6 top-3 bottom-3 w-0.5 bg-gray-50"></div>

            <div v-for="(step, idx) in getTrackingSteps(selectedOrder)" :key="idx" class="relative flex gap-6">
              <div class="w-4 h-4 rounded-full z-10 shrink-0 mt-1 transition-all duration-500"
                :class="isStepComplete(selectedOrder.status, step.status) ? 'bg-primary ring-4 ring-primary/10' : 'bg-gray-100'">
              </div>
              <div :class="{ 'opacity-30': !isStepComplete(selectedOrder.status, step.status) }">
                <p class="text-xs font-bold text-primary leading-tight">{{ step.label }}</p>
                <p class="text-[10px] text-secondary mt-1">{{ step.description }}</p>
                <p v-if="isStepComplete(selectedOrder.status, step.status)"
                  class="text-[9px] text-primary font-black mt-2 uppercase tracking-tight opacity-40">
                  {{ step.date }}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <template #footer>
        <div class="flex gap-4">
          <BaseButton variant="outline" class="flex-1 py-4 text-xs font-black uppercase tracking-widest"
            @click="openPaymentDetails">View Payment</BaseButton>
          <BaseButton variant="primary" class="flex-1 py-4 text-xs font-black uppercase tracking-widest"
            @click="isDetailsOpen = false">Close Details</BaseButton>
        </div>
      </template>
    </BaseDrawer>

    <!-- Payment History Drawer -->
    <BaseDrawer v-model="isPaymentOpen" title="Payment History" :subtitle="'Transaction for ' + selectedOrder?.id">
      <div v-if="selectedOrder && getOrderPayment(selectedOrder.id)" class="space-y-10">
        <!-- Payment Success Banner -->
        <div class="border border-gray-200 p-8 rounded-premium text-center space-y-4">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <LucideCheckCircle :size="32" />
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-green-600/60 mb-1">Total Paid</p>
            <p class="text-3xl font-black text-green-700">₦{{ getOrderPayment(selectedOrder.id)?.amount.toLocaleString()
            }}
            </p>
          </div>
        </div>

        <!-- Transaction Progress -->
        <div class="space-y-6">
          <h4 class="text-xs font-black uppercase tracking-widest text-secondary/40">Transaction Progress</h4>
          <div class="relative space-y-8 pl-4">
            <!-- Connector Line -->
            <div class="absolute left-6 top-3 bottom-3 w-0.5 bg-gray-50"></div>

            <div v-for="(step, idx) in paymentSteps" :key="idx" class="relative flex gap-6">
              <div class="w-4 h-4 rounded-full z-10 shrink-0 mt-1 bg-primary ring-4 ring-primary/10"></div>
              <div>
                <p class="text-xs font-bold text-primary leading-tight">{{ step.label }}</p>
                <p class="text-[10px] text-secondary mt-1">{{ step.description }}</p>
                <p class="text-[9px] text-primary font-black mt-2 uppercase tracking-tight opacity-40">
                  {{ getOrderPayment(selectedOrder.id)?.date }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Table -->
        <div class="space-y-4 bg-gray-50/50 p-6 rounded-2xl">
          <div class="flex justify-between items-center py-3 border-b border-gray-100">
            <span class="text-[10px] font-black uppercase tracking-widest text-secondary/40">Payment ID</span>
            <span class="text-xs font-bold text-primary">{{ getOrderPayment(selectedOrder.id)?.id }}</span>
          </div>
          <div class="flex justify-between items-center py-3 border-b border-gray-100">
            <span class="text-[10px] font-black uppercase tracking-widest text-secondary/40">Method</span>
            <span class="text-xs font-bold text-primary">{{ getOrderPayment(selectedOrder.id)?.method }}</span>
          </div>
          <div class="flex justify-between items-center py-3 border-b border-gray-100">
            <span class="text-[10px] font-black uppercase tracking-widest text-secondary/40">Status</span>
            <span
              class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-100 text-green-700">
              {{ getOrderPayment(selectedOrder.id)?.status }}
            </span>
          </div>
        </div>
      </div>
      <div v-else class="h-full flex flex-col items-center justify-center p-10 text-center space-y-4">
        <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary/20">
          <LucideCreditCard :size="32" />
        </div>
        <p class="text-sm font-bold text-secondary">No payment history available for this order.</p>
      </div>
      <template #footer>
        <BaseButton variant="primary" class="w-full py-4 text-xs font-black uppercase tracking-widest"
          @click="isPaymentOpen = false">Back to Order</BaseButton>
      </template>
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ShoppingBag as LucideShoppingBag,
  Search as LucideSearch,
  DollarSign as LucideDollarSign,
  Clock as LucideClock,
  CheckCircle as LucideCheckCircle,

  CreditCard as LucideCreditCard,
} from '@lucide/vue'
import StatCard from '@/components/admin/StatCard.vue'
import { store, products, type Order } from '@/store'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import { formatDate } from '@/utils'
import router from '@/router'

const route = useRoute()
const searchQuery = ref('')
const orderUpdateReason = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const activeStatusFilter = ref('All Orders')
const allStatuses = ['All Orders', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

const isDetailsOpen = ref(false)
const isPaymentOpen = ref(false)
const selectedOrder = ref<Order | null>(null)

const filteredOrders = computed(() => {
  let result = store.orders

  if (activeStatusFilter.value !== 'All Orders') {
    result = result.filter(o => o.status === activeStatusFilter.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(o =>
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q)
    )
  }

  return result
})

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredOrders.value.slice(start, end)
})

watch([searchQuery, activeStatusFilter, itemsPerPage], () => {
  currentPage.value = 1
})

const getOrderPayment = (orderId: string) => {
  return store.payments.find(p => p.orderId === orderId)
}

const isStepComplete = (currentStatus: string, stepStatus: string) => {
  const statusMap: Record<string, number> = {
    'pending': 1,
    'processing': 2,
    'shipped': 3,
    'delivered': 4,
    'cancelled': 0
  }

  if (currentStatus === 'cancelled') return false
  return statusMap[currentStatus] >= statusMap[stepStatus]
}

const getTrackingSteps = (order: Order) => {
  return [
    { status: 'pending', label: 'Order Placed', description: 'Order has been received', date: order.date },
    { status: 'processing', label: 'Processing', description: 'We are preparing your items', date: order.date },
    { status: 'shipped', label: 'In Transit', description: 'Order is on its way', date: order.date },
    { status: 'delivered', label: 'Delivered', description: 'Package has been delivered', date: order.date }
  ]
}

const paymentSteps = [
  { label: 'Payment Initialized', description: 'Transaction record successfully created.' },
  { label: 'Funds Authorized', description: 'Bank has approved the charge.' },
  { label: 'Security Verified', description: 'Gateway 3D secure verification passed.' },
  { label: 'Settled', description: 'Revenue cleared and verified by treasury.' }
]

const openPaymentDetails = () => {
  isPaymentOpen.value = true
}

const totalSales = computed(() => {
  return store.orders.reduce((acc, curr) => acc + curr.total, 0)
})

const getStatusClass = (status: string) => {
  switch (status) {
    case 'delivered': return 'bg-green-50 text-green-600'
    case 'processing': return 'bg-blue-50 text-blue-600'
    case 'shipped': return 'bg-purple-50 text-purple-600'
    case 'pending': return 'bg-yellow-50 text-yellow-600'
    case 'cancelled': return 'bg-red-50 text-red-600'
    default: return 'bg-gray-50 text-gray-600'
  }
}



const getCustomerEmail = (id: number) => {
  return store.customers.find(c => c.id === id)?.email || 'unknown@example.com'
}

const getProductName = (id: number) => {
  return products.find(p => p.id === id)?.name || 'Unknown Product'
}

const getProductImage = (id: number) => {
  return products.find(p => p.id === id)?.image || ''
}

const viewOrderDetails = (order: Order) => {
  orderUpdateReason.value = ''
  selectedOrder.value = order
  isDetailsOpen.value = true
}

onMounted(() => {
  if (route.query.open) {
    const orderId = route.query.open as string
    const order = store.orders.find(o => o.id === orderId)
    if (order) {
      viewOrderDetails(order)
    }
    router.replace({ name: 'AdminOrders', query: {} })
  }
})

const clearFilters = () => {
  searchQuery.value = ''
  activeStatusFilter.value = 'All Orders'
  currentPage.value = 1
}

const updateStatus = (orderId: string, status: Order['status']) => {
  store.updateOrderStatus(orderId, status)
}
</script>
