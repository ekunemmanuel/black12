<template>
  <div class="h-screen overflow-hidden flex bg-[#FDFDFD]">
    <!-- Sidebar Wrapper -->
    <div 
      class="fixed inset-0 bg-primary/20 backdrop-blur-sm z-60 md:hidden transition-opacity duration-300"
      :class="isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      @click="isMobileSidebarOpen = false"
    ></div>

    <div 
      class="fixed inset-y-0 left-0 z-70 transition-transform duration-500 ease-in-out md:relative md:translate-x-0 shrink-0"
      :class="[
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        isSidebarCollapsed ? 'md:w-24' : 'md:w-72'
      ]"
    >
      <AdminSidebar 
        class="h-full" 
        :is-collapsed="isSidebarCollapsed"
        @toggle="isSidebarCollapsed = !isSidebarCollapsed" 
      />
    </div>

    <div class="flex-1 flex flex-col min-w-0">
      <!-- Fixed Header -->
      <header
        class="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-10 shrink-0 z-40 sticky top-0">
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Button -->
          <button 
            @click="isMobileSidebarOpen = true"
            class="md:hidden w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-secondary hover:text-primary transition-all"
          >
            <LucideMenu :size="20" />
          </button>

          <div>
            <h2 class="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-secondary/50 mb-0.5 md:mb-1">{{ currentRouteLabel }}</h2>
            <p class="text-lg md:text-xl font-bold tracking-tight text-primary leading-tight">{{ pageTitle }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3 md:gap-6">
          <div class="relative group">
            <button @click="isNotificationsOpen = true"
              class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-secondary hover:text-primary hover:bg-gray-100 transition-all relative">
              <LucideBell :size="20" />
              <span v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center scale-90">
                {{ unreadCount }}
              </span>
            </button>
          </div>
          <div class="h-8 w-px bg-gray-100 mx-2"></div>
          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-black text-primary leading-none mb-1">Pablo Emmanuel</p>
              <p class="text-[10px] text-secondary font-bold uppercase tracking-wider">admin@black12thrift.com</p>
            </div>
            <div
              class="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-black shadow-lg border-2 border-white overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=pablo" alt="P" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto p-4 md:p-10 bg-gray-50/50">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Notifications Drawer -->
    <BaseDrawer v-model="isNotificationsOpen" title="Notifications" subtitle="Stay updated with platform activity"
      mobile-mode="slideover">
      <div class="flex flex-col h-full max-h-[calc(100vh-200px)]">
        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div v-if="store.notifications.length === 0"
            class="flex flex-col items-center justify-center h-full text-center p-10 opacity-40">
            <LucideInbox :size="48" class="mb-4" />
            <p class="font-bold">No notifications yet</p>
          </div>

          <div v-else class="space-y-6 pb-4">
            <div v-for="notif in store.notifications" :key="notif.id" @click="handleNotifClick(notif)"
              class="transition-all cursor-pointer relative group">
              <div v-if="notif.status === 'unread'"
                class="absolute left-0 top-0 w-2 h-2 bg-red-400 rounded-full"></div>

              <div class="flex gap-4">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  :class="getIconColor(notif.type)">
                  <component :is="getIcon(notif.type)" :size="18" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <p class="text-sm font-bold text-primary truncate">{{ notif.title }}</p>
                    <span class="text-[10px] text-secondary/40 font-bold uppercase whitespace-nowrap">{{
                      formatTime(notif.date) }}</span>
                  </div>
                  <p class="text-xs text-secondary leading-relaxed line-clamp-2">{{ notif.message }}</p>
                </div>
              </div>

              <button v-if="notif.status === 'unread'" @click.stop="store.markNotificationAsRead(notif.id)"
                class="absolute right-4 bottom-4 p-1.5 rounded-lg text-secondary/40 hover:text-primary hover:bg-primary/5 transition-all opacity-0 group-hover:opacity-100"
                title="Mark as read">
                <LucideCheck :size="14" />
              </button>
            </div>
          </div>
        </div>


      </div>

      <template #footer v-if="unreadCount > 0">
        <!-- Footer Actions -->
        <div>
          <button @click="store.markAllNotificationsAsRead()"
            class="w-full py-4 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <LucideCheckCheck :size="16" />
            Mark All as Read
          </button>
        </div>
      </template>
    </BaseDrawer>

    <!-- Welcome Popup -->
    <Transition name="fade-up">
      <div v-if="showWelcomePopup"
        class="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-100 max-w-[calc(100%-2rem)] md:max-w-sm w-full bg-primary text-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] shadow-2xl overflow-hidden group">
        <!-- Background Elements -->
        <div
          class="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000">
        </div>
        <div class="absolute -bottom-12 -left-12 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

        <div class="relative">
          <button @click="showWelcomePopup = false"
            class="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <LucideX :size="16" />
          </button>

          <div class="flex items-start gap-5">
            <div
              class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0 shadow-inner">
              <LucideSparkles :size="24" class="text-white" />
            </div>
            <div>
              <h3 class="text-xl font-bold mb-2">Welcome Back!</h3>
              <p class="text-white/70 text-sm leading-relaxed mb-6">
                You have <span class="text-white font-bold">{{ unreadCount }} unread</span> notifications.
                Platform activity is high today!
              </p>

              <div class="flex items-center gap-3">
                <button @click="isNotificationsOpen = true; showWelcomePopup = false"
                  class="px-5 py-2.5 bg-white text-primary text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-gray-100 transition-all">
                  View Alerts
                </button>
                <button @click="showWelcomePopup = false"
                  class="px-5 py-2.5 bg-white/10 text-white text-[10px] font-black uppercase tracking-wider rounded-xl border border-white/10 hover:bg-white/20 transition-all">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Bell as LucideBell,
  Check as LucideCheck,
  CheckCheck as LucideCheckCheck,
  Package as LucidePackage,
  CreditCard as LucideCreditCard,
  RefreshCcw as LucideRefresh,
  Users as LucideUsers,
  Settings as LucideSettings,
  Inbox as LucideInbox,
  X as LucideX,
  Sparkles as LucideSparkles,
  Menu as LucideMenu
} from '@lucide/vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'
import { store, type Notification } from '@/store'

const route = useRoute()
const router = useRouter()
const isSidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)
const isNotificationsOpen = ref(false)
const showWelcomePopup = ref(false)

// Close mobile sidebar on route change
router.afterEach(() => {
  isMobileSidebarOpen.value = false
})

const unreadCount = computed(() => store.notifications.filter(n => n.status === 'unread').length)

onMounted(() => {
  // Simulate login check and show popup after a short delay
  setTimeout(() => {
    if (unreadCount.value > 0) {
      showWelcomePopup.value = true
    }
  }, 1500)
})

const currentRouteLabel = computed(() => {
  const path = route.path
  if (path === '/admin') return 'Overview'
  if (path.includes('products')) return 'Catalog'
  if (path.includes('orders')) return 'Sales'
  if (path.includes('customers')) return 'Users'
  return 'Admin'
})

const pageTitle = computed(() => {
  const name = route.name as string
  if (!name) return 'Dashboard'
  return name.replace('Admin', '')
})

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'order': return LucidePackage
    case 'payment': return LucideCreditCard
    case 'refund': return LucideRefresh
    case 'customer': return LucideUsers
    default: return LucideSettings
  }
}

const getIconColor = (type: Notification['type']) => {
  switch (type) {
    case 'order': return 'bg-blue-50 text-blue-600'
    case 'payment': return 'bg-green-50 text-green-600'
    case 'refund': return 'bg-orange-50 text-orange-600'
    case 'customer': return 'bg-purple-50 text-purple-600'
    default: return 'bg-gray-50 text-gray-600'
  }
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMin = Math.floor(diffInMs / 60000)

  if (diffInMin < 1) return 'Just now'
  if (diffInMin < 60) return `${diffInMin}m ago`

  const diffInHours = Math.floor(diffInMin / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  return date.toLocaleDateString()
}

const handleNotifClick = (notif: Notification) => {
  store.markNotificationAsRead(notif.id)
  if (notif.link) {
    router.push(notif.link)
    isNotificationsOpen.value = false
  }
}
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.95);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #e5e5e5;
}
</style>
