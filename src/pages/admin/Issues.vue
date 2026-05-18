<template>
  <div class="space-y-8">
    <!-- Filters Row -->
    <div class="flex items-center justify-between">
      <div class="flex gap-4">
        <button 
          v-for="status in ['All Issues', 'open', 'in-progress', 'resolved']" 
          :key="status"
          @click="activeFilter = status"
          class="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-soft border border-gray-100"
          :class="activeFilter === status ? 'bg-primary text-white' : 'bg-white text-secondary hover:bg-gray-50'"
        >
          {{ status }}
        </button>
      </div>

      <div class="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-soft flex items-center gap-4">
        <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        <p class="text-[10px] font-black text-primary uppercase tracking-widest">{{ openIssuesCount }} Unresolved Tickets</p>
      </div>
    </div>

    <!-- Issues List -->
    <div class="grid grid-cols-1 gap-6">
      <div v-for="issue in filteredIssues" :key="issue.id" 
           class="group bg-white rounded-[32px] p-8 shadow-soft border border-gray-100 hover:border-primary/20 transition-all duration-500 flex flex-col md:flex-row gap-8 items-start md:items-center">
        
        <!-- Priority Indicator -->
        <div class="shrink-0 w-2 h-16 rounded-full" :class="getPriorityBg(issue.priority)"></div>

        <!-- Issue Content -->
        <div class="flex-1 space-y-2">
          <div class="flex items-center gap-3">
             <span class="px-3 py-1 rounded-lg bg-gray-50 text-[10px] font-mono font-bold text-secondary/40">{{ issue.id }}</span>
             <span class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider" :class="getStatusClass(issue.status)">{{ issue.status }}</span>
             <span class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider" :class="getPriorityClass(issue.priority)">{{ issue.priority }} Priority</span>
          </div>
          <h3 class="text-lg font-bold text-primary group-hover:text-primary/70 transition-colors">{{ issue.subject }}</h3>
          <p class="text-sm text-secondary line-clamp-1">{{ issue.description }}</p>
        </div>

        <!-- Customer Info -->
        <div class="hidden lg:flex items-center gap-4 px-8 border-l border-gray-50 min-w-[240px]">
           <div class="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
              <img :src="getCustomerAvatar(issue.customerId)" class="w-full h-full object-cover" />
           </div>
           <div>
              <p class="text-sm font-bold text-primary">{{ getCustomerName(issue.customerId) }}</p>
              <p class="text-[10px] text-secondary/40 font-bold uppercase tracking-widest">Reported {{ issue.date }}</p>
           </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 shrink-0">
           <BaseButton variant="outline" class="px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl" @click="viewDetails(issue)">View Ticket</BaseButton>
           <BaseButton v-if="issue.status !== 'resolved'" class="px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl" @click="resolveIssue(issue.id)">Resolve</BaseButton>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredIssues.length === 0" class="py-24 text-center bg-white rounded-[32px] border-2 border-dashed border-gray-100">
         <LucideMessageSquare :size="48" class="mx-auto text-gray-200 mb-4" />
         <h3 class="text-xl font-bold text-primary">All clear!</h3>
         <p class="text-sm text-secondary">No tickets found for this filter.</p>
      </div>
    </div>

    <!-- Issue Details Drawer -->
    <BaseDrawer v-model="isDetailsOpen" title="Ticket Details" :subtitle="'Conversation with ' + getCustomerName(selectedIssue?.customerId || 0)">
       <div v-if="selectedIssue" class="space-y-10">
          <div class="space-y-4">
             <div class="flex items-center justify-between">
                <h4 class="text-xs font-black uppercase tracking-widest text-secondary/40">Subject</h4>
                <span class="text-[10px] font-bold text-secondary">{{ selectedIssue.date }}</span>
             </div>
             <p class="text-xl font-black tracking-tight text-primary">{{ selectedIssue.subject }}</p>
          </div>

          <div class="space-y-4">
             <h4 class="text-xs font-black uppercase tracking-widest text-secondary/40">Description</h4>
             <div class="p-8 bg-gray-50 rounded-[32px] border border-gray-100">
                <p class="text-sm leading-relaxed text-secondary italic">"{{ selectedIssue.description }}"</p>
             </div>
          </div>

          <div class="space-y-4">
             <h4 class="text-xs font-black uppercase tracking-widest text-secondary/40">Update Status</h4>
             <div class="flex flex-wrap gap-2">
                <button 
                   v-for="st in ['open', 'in-progress', 'resolved', 'closed']" 
                   :key="st"
                   @click="updateStatus(st as any)"
                   class="px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border"
                   :class="selectedIssue.status === st ? 'bg-primary text-white border-primary' : 'bg-white text-secondary border-gray-100 hover:border-primary/20'"
                >
                   {{ st }}
                </button>
             </div>
          </div>

          <!-- Quick Reply -->
          <div class="space-y-4">
             <h4 class="text-xs font-black uppercase tracking-widest text-secondary/40">Internal Note / Reply</h4>
             <textarea rows="4" class="w-full p-6 bg-gray-50 border-none rounded-[32px] text-sm focus:ring-1 focus:ring-primary transition-all font-medium resize-none" placeholder="Type a response or internal note..."></textarea>
          </div>
       </div>

       <template #footer>
          <div class="flex gap-4 w-full">
             <BaseButton variant="outline" class="flex-1 py-4 text-xs font-black uppercase tracking-widest" @click="isDetailsOpen = false">Cancel</BaseButton>
             <BaseButton class="flex-1 py-4 text-xs font-black uppercase tracking-widest" @click="isDetailsOpen = false">Send Response</BaseButton>
          </div>
       </template>
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  MessageSquare as LucideMessageSquare
} from '@lucide/vue'
import { store, type Issue } from '@/store'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'

const activeFilter = ref('All Issues')
const isDetailsOpen = ref(false)
const selectedIssue = ref<Issue | null>(null)

const filteredIssues = computed(() => {
  if (activeFilter.value === 'All Issues') return store.issues
  return store.issues.filter(i => i.status === activeFilter.value)
})

const openIssuesCount = computed(() => {
  return store.issues.filter(i => i.status !== 'resolved' && i.status !== 'closed').length
})

const getStatusClass = (status: string) => {
  switch (status) {
    case 'resolved': return 'bg-green-50 text-green-600'
    case 'in-progress': return 'bg-blue-50 text-blue-600'
    case 'open': return 'bg-yellow-50 text-yellow-600'
    case 'closed': return 'bg-gray-50 text-gray-400'
    default: return 'bg-gray-50 text-gray-400'
  }
}

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-500'
    case 'medium': return 'text-orange-500'
    case 'low': return 'text-blue-500'
    default: return 'text-secondary'
  }
}

const getPriorityBg = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-500'
    case 'medium': return 'bg-orange-500'
    case 'low': return 'bg-blue-500'
    default: return 'bg-gray-200'
  }
}

const getCustomerName = (id: number) => {
  return store.customers.find(c => c.id === id)?.name || 'Unknown User'
}

const getCustomerAvatar = (id: number) => {
  return store.customers.find(c => c.id === id)?.avatar || `https://i.pravatar.cc/150?u=${id}`
}

const viewDetails = (issue: Issue) => {
  selectedIssue.value = issue
  isDetailsOpen.value = true
}

const resolveIssue = (id: string) => {
  store.resolveIssue(id)
}

const updateStatus = (status: Issue['status']) => {
  if (selectedIssue.value) {
    selectedIssue.value.status = status
  }
}
</script>
