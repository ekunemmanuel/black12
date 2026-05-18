<template>
  <div class="space-y-8 pb-10">
    <!-- Header & Stats -->
    <div class="space-y-8">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto ml-auto">
          <BaseInput v-model="searchQuery" class="w-full sm:min-w-[400px]" placeholder="Search by name, email or phone...">
            <template #prefix>
              <LucideSearch :size="18" class="text-secondary/40 transition-colors" />
            </template>
          </BaseInput>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Total Users" 
          :value="store.customers.length.toString()" 
          :icon="LucideUsers" 
          iconBg="bg-blue-50" 
          iconColor="text-blue-600"
          :trend="14.2"
        />
        <StatCard 
          label="Active" 
          :value="activeCustomersCount.toString()" 
          :icon="LucideUserCheck" 
          iconBg="bg-green-50" 
          iconColor="text-green-600"
          :trend="5.4"
        />
        <StatCard 
          label="New Members" 
          :value="'12'" 
          :icon="LucideUserPlus" 
          iconBg="bg-purple-50" 
          iconColor="text-purple-600"
          :trend="24.1"
        />
        <StatCard 
          label="Avg. LTV" 
          :value="'₦' + (store.customers.reduce((acc, c) => acc + c.totalSpent, 0) / (store.customers.length || 1)).toLocaleString(undefined, {maximumFractionDigits: 0})" 
          :icon="LucideTrendingUp" 
          iconBg="bg-orange-50" 
          iconColor="text-orange-600"
        />
      </div>
    </div>

    <!-- Customers Table -->
    <div class="bg-white rounded-[30px] overflow-hidden shadow-soft border border-gray-100">
      <div class="overflow-x-auto">
        <table v-if="paginatedCustomers.length > 0" class="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr class="bg-gray-50/50">
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Customer</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Contact</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Orders</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Total Spent</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Status</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Joined Date</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="customer in paginatedCustomers" :key="customer.id"
              class="group hover:bg-gray-50/30 transition-all duration-300">
               <td class="px-8 py-6 whitespace-nowrap">
                <span class="text-sm font-black text-primary leading-none tracking-tight">{{ customer.name }}</span>
              </td>
               <td class="px-8 py-6 whitespace-nowrap">
                <div class="space-y-1">
                  <p class="text-sm font-black text-primary tracking-tight">{{ customer.email }}</p>
                  <p class="text-[10px] font-black tracking-widest text-secondary/40">{{ customer.phoneNumber }}</p>
                </div>
              </td>
              <td class="px-8 py-6 text-sm font-bold text-primary">
                {{ customer.totalOrders }}
              </td>
               <td class="px-8 py-6 text-sm font-black text-primary whitespace-nowrap">
                ₦{{ customer.totalSpent.toLocaleString() }}
              </td>
              <td class="px-8 py-6">
                <span class="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider"
                  :class="customer.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'">
                  {{ customer.status }}
                </span>
              </td>
              <td class="px-8 py-6 text-xs text-secondary font-medium">
                {{ formatDate(customer.joinedDate) }}
              </td>
              <td class="px-8 py-6">
                <button @click="viewCustomerDetails(customer)"
                  class="text-secondary hover:text-primary text-xs cursor-pointer tracking-wider">
                  view more
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
            <LucideUsers :size="40" class="relative z-10" />
          </div>
          <h3 class="text-xl font-black text-primary mb-3 uppercase tracking-tighter">No customers found</h3>
          <p class="text-sm text-secondary/40 max-w-xs mx-auto leading-relaxed font-medium">
            {{ searchQuery
              ? "We couldn't find any customers matching your search query. Try a different name or email."
              : "Your customer list is currently empty. New customers will appear here once they register."
            }}
          </p>
          <div class="mt-10">
            <BaseButton v-if="searchQuery" variant="outline"
              class="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]" @click="clearFilters">
              Clear all filters
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <BasePagination v-model:current-page="currentPage" v-model:limit="itemsPerPage"
        :total="filteredCustomers.length" />
    </div>

    <!-- Customer Details Drawer -->
    <BaseDrawer v-model="isDetailsOpen" title="Customer Profile" subtitle="Viewing purchase history and activity">
      <div v-if="selectedCustomer" class="space-y-10">
        <!-- Profile Header -->
        <div class="flex flex-col items-center text-center space-y-4 pt-4">
          <div class="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-white shadow-xl">
            <img :src="selectedCustomer.avatar" class="w-full h-full object-cover" />
          </div>
          <div>
            <h3 class="text-2xl font-black tracking-tight text-primary">{{ selectedCustomer.name }}</h3>
            <p class="text-sm text-secondary font-medium">{{ selectedCustomer.email }}</p>
            <a :href="`tel:${selectedCustomer.phoneNumber}`" target="_blank" class="text-sm text-secondary font-medium">
              {{ selectedCustomer.phoneNumber }}
            </a>
          </div>
          <div class="flex gap-2">
            <span class="text-[10px] font-black uppercase tracking-widest text-primary">
              Joined {{ formatDate(selectedCustomer.joinedDate) }}
            </span>
            <span class="text-[10px] font-black uppercase tracking-widest text-green-600">
              {{ selectedCustomer.status }}
            </span>
          </div>
        </div>

        <!-- Metrics -->
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <p class="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-1">Total Orders</p>
            <p class="text-2xl font-black text-primary">{{ selectedCustomer.totalOrders }}</p>
          </div>
          <div class="flex justify-between items-center">
            <p class="text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-1">Total Spent</p>
            <p class="text-2xl font-black text-primary">₦{{ selectedCustomer.totalSpent.toLocaleString() }}</p>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-black uppercase tracking-widest text-secondary/40">Recent Activity</h4>
            <button class="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View
              All</button>
          </div>
          <div class="space-y-4">
            <div v-for="order in customerOrders" :key="order.id" class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary">
                  <LucideShoppingBag :size="20" />
                </div>
                <div>
                  <p class="text-sm font-bold text-primary">Order {{ order.id }}</p>
                  <p class="text-[10px] text-secondary font-medium">{{ order.date }}</p>
                </div>
              </div>
              <p class="text-sm font-bold text-primary">₦{{ order.total.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-4 w-full">
          <BaseButton variant="outline" class="flex-1 py-4 text-xs font-black uppercase tracking-widest"
            @click="toggleStatus">
            {{ selectedCustomer?.status === 'active' ? 'Deactivate Account' : 'Activate Account' }}
          </BaseButton>
          <BaseButton class="flex-1 py-4 text-xs font-black uppercase tracking-widest" @click="isDetailsOpen = false">
            Close Profile</BaseButton>
        </div>
      </template>
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { 
  Search as LucideSearch,
  Users as LucideUsers,
  UserCheck as LucideUserCheck,
  UserPlus as LucideUserPlus,
  TrendingUp as LucideTrendingUp,
  ShoppingBag as LucideShoppingBag
} from '@lucide/vue'
import StatCard from '@/components/admin/StatCard.vue'
import { store, type Customer } from '@/store'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import { formatDate } from '@/utils'

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const isDetailsOpen = ref(false)
const selectedCustomer = ref<Customer | null>(null)

const filteredCustomers = computed(() => {
  let result = store.customers

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    )
  }

  return result
})

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredCustomers.value.slice(start, end)
})

watch([searchQuery, itemsPerPage], () => {
  currentPage.value = 1
})

const activeCustomersCount = computed(() => {
  return store.customers.filter(c => c.status === 'active').length
})

const customerOrders = computed(() => {
  if (!selectedCustomer.value) return []
  return store.orders.filter(o => o.customerId === selectedCustomer.value?.id)
})

const viewCustomerDetails = (customer: Customer) => {
  selectedCustomer.value = customer
  isDetailsOpen.value = true
}

const clearFilters = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const toggleStatus = () => {
  if (selectedCustomer.value) {
    selectedCustomer.value.status = selectedCustomer.value.status === 'active' ? 'inactive' : 'active'
  }
}
</script>
