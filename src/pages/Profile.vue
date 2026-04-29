<template>
  <div class="min-h-screen bg-background pb-10 md:pt-24">
    <!-- Mobile Header -->
    <header v-if="selectedTab && isMobile"
      class="sticky top-0 bg-white/80 backdrop-blur-md z-30 px-6 py-6 flex items-center justify-between md:hidden border-b border-black/5">
      <button @click="handleBack"
        class="w-12 h-12 flex items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-active active:scale-90">
        <LucideChevronLeft :size="24" class="text-black" />
      </button>

      <h1 class="text-xl font-bold tracking-tight text-gray-900 uppercase font-mono">
        {{ selectedTab }}
      </h1>

      <div class="w-12"></div>
    </header>

    <main class="container-wide pt-8">
      <div class="grid grid-cols-1 lg:grid-cols-[320px_1fr] items-start gap-8 lg:gap-12">
        <!-- Sidebar / User Info -->
        <aside v-if="!selectedTab || !isMobile" class="lg:sticky lg:top-24 space-y-8 pt-4 md:pt-0 pb-14"
          :class="{ 'hidden md:block': selectedTab && isMobile }">
          <div class="bg-surface rounded-2xl p-10 text-center">
            <div class="relative w-[120px] h-[120px] mx-auto mb-6">
              <div
                class="w-full h-full bg-accent rounded-full flex items-center justify-center text-primary border-4 border-white shadow-soft">
                <!-- <LucideUser :size="60" /> -->
                 <img src="https://i.pravatar.cc/100?u=albert" alt="Albert" class="rounded-full">
              </div>
              <!-- <button
                class="absolute bottom-0 right-0 w-9 h-9 bg-primary text-white rounded-full border-3 border-white flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 shadow-soft">
                <LucideCamera :size="16" />
              </button> -->
            </div>

            <div>
              <h2 class="text-2xl font-extrabold tracking-tight uppercase">Albert Stevano</h2>
              <p class="text-secondary text-sm mb-4">albertstevano@gmail.com</p>
              <!-- <div
                class="inline-block px-4 py-1.5 bg-primary text-white text-[10px] font-extrabold tracking-[0.15em] rounded-full uppercase">
                Platinum Member
              </div> -->
            </div>
          </div>

          <nav class="flex flex-col gap-2">
            <button v-for="tab in tabs" :key="tab.name" @click="selectedTab = tab.name"
              class="flex items-center gap-4 px-6 py-5 rounded-2xl font-bold transition-all hover:translate-x-1" :class="selectedTab === tab.name
                ? 'bg-white text-primary shadow-soft translate-x-1'
                : 'text-secondary bg-transparent hover:bg-white hover:text-primary'
                ">
              <component :is="tab.icon" :size="20" />
              <span>{{ tab.name }}</span>
            </button>

            <button @click="showSignOutDrawer = true"
              class="flex items-center gap-4 px-6 py-5 rounded-2xl font-bold text-[#FF3B30] bg-transparent hover:bg-white transition-all hover:translate-x-1 mt-4">
              <LucideLogOut :size="20" />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        <!-- Main Content Area -->
        <section v-if="selectedTab || !isMobile" class="space-y-8 pt-4 md:pt-0"
          :class="{ 'hidden md:block': !selectedTab && isMobile }">
          <!-- Order History View -->
          <div v-if="selectedTab === 'Orders' || (!selectedTab && !isMobile)" class="space-y-8">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 class="text-4xl font-mono uppercase tracking-tight shrink-0">Order History</h1>
              <div class="relative flex-1 max-w-md">
                <LucideSearch class="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" :size="18" />
                <input v-model="orderSearchQuery" type="text" placeholder="Search by Order ID..."
                  class="w-full pl-12 pr-4 py-3 bg-surface rounded-xl border border-accent focus:border-primary outline-none transition-all font-sans" />
              </div>
            </div>

            <div class="flex flex-col gap-6">
              <div v-if="paginatedOrders.length === 0"
                class="text-center py-20 bg-surface rounded-2xl border border-dashed border-accent">
                <p class="text-secondary font-bold">No orders found matching your search.</p>
              </div>
              <div v-for="order in paginatedOrders" :key="order.id" class="bg-surface rounded-3xl p-6 md:p-8">
                <div class="flex justify-between items-start mb-6 pb-6 border-b border-accent">
                  <div>
                    <p class="font-extrabold text-lg mb-0.5 uppercase tracking-wide">Order #{{ order.id }}</p>
                    <p class="text-sm text-secondary">{{ order.date }}</p>
                  </div>
                  <div class="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                    :class="order.status === 'Delivered' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'">
                    {{ order.status }}
                  </div>
                </div>

                <div class="flex items-center mb-8 h-20">
                  <div class="flex -space-x-8">
                    <div v-for="(item, i) in order.items.slice(0, 3)" :key="i"
                      class="relative w-16 h-20 bg-accent rounded-xl overflow-hidden border-2 border-surface"
                      :style="{ zIndex: 10 - i }">
                      <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                    </div>
                    <div v-if="order.items.length > 3"
                      class="relative z-0 w-16 h-20 bg-surface border-2 border-dashed border-accent rounded-xl flex items-center justify-center text-primary font-mono font-bold text-sm shadow-sm ring-2 ring-surface">
                      +{{ order.items.length - 3 }}
                    </div>
                  </div>
                  <div class="ml-auto text-right">
                    <p class="text-[10px] text-secondary uppercase font-bold tracking-widest mb-1">Total Amount</p>
                    <p class="text-xl font-extrabold font-mono tracking-tight">₦{{ order.total.toLocaleString() }}</p>
                  </div>
                </div>

                <div class="flex gap-6">
                  <button @click="openOrderTracking(order)"
                    class="px-8 py-3 bg-primary text-white rounded-xl font-bold uppercase text-xs tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-soft">
                    Track Order
                  </button>
                  <button @click="openOrderDetails(order)"
                    class="bg-transparent border-none text-primary font-bold underline text-xs uppercase tracking-widest cursor-pointer hover:text-secondary transition-all">
                    Details
                  </button>
                </div>
              </div>
            </div>

            <!-- Pagination Controls -->
            <div v-if="totalPages > 1" class="flex items-center justify-center gap-4 pt-4">
              <button @click="currentOrderPage--" :disabled="currentOrderPage === 1"
                class="w-10 h-10 flex items-center justify-center rounded-full border border-accent bg-white shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90">
                <LucideChevronLeft :size="20" />
              </button>
              <div class="flex items-center gap-2">
                <span class="text-sm font-mono font-bold">{{ currentOrderPage }}</span>
                <span class="text-xs text-secondary italic">of</span>
                <span class="text-sm font-mono font-bold">{{ totalPages }}</span>
              </div>
              <button @click="currentOrderPage++" :disabled="currentOrderPage === totalPages"
                class="w-10 h-10 flex items-center justify-center rounded-full border border-accent bg-white shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90">
                <LucideChevronRight :size="20" />
              </button>
            </div>
          </div>

          <!-- Wishlist View -->
          <div v-else-if="selectedTab === 'Wishlist'" class="space-y-8">
            <div class="flex items-center justify-between">
              <h1 class="text-4xl font-mono uppercase tracking-tight">My Wishlist</h1>
              <span class="text-secondary font-mono font-bold text-sm">{{ wishlistProducts.length }} Items</span>
            </div>

            <div v-if="wishlistProducts.length === 0"
              class="text-center py-24 bg-surface rounded-3xl border border-dashed border-accent flex flex-col items-center">
              <div class="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-secondary/30 mb-6">
                <LucideHeart :size="40" />
              </div>
              <h3 class="text-xl font-bold mb-2">Your wishlist is empty</h3>
              <p class="text-secondary mb-8 max-w-xs mx-auto">Save items you love to find them later and keep track of
                style.</p>
              <button @click="router.push('/')"
                class="px-10 py-4 bg-primary text-white rounded-xl font-bold uppercase text-xs tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-soft">
                Explore Collection
              </button>
            </div>

            <div v-else class="grid grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              <ProductCard v-for="product in wishlistProducts" :key="product.id" :product="product" />
            </div>
          </div>

          <!-- Payments View (Payment History) -->
          <div v-else-if="selectedTab === 'Payments'" class="space-y-8">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 class="text-4xl font-mono uppercase tracking-tight shrink-0">Payment History</h1>
              <div class="relative flex-1 max-w-md">
                <LucideSearch class="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" :size="18" />
                <input v-model="txnSearchQuery" type="text" placeholder="Search by Order ID or Txn ID..."
                  class="w-full pl-12 pr-4 py-3 bg-surface rounded-xl border border-accent focus:border-primary outline-none transition-all font-sans" />
              </div>
            </div>

            <div class="flex flex-col gap-6">
              <div v-if="paginatedTransactions.length === 0"
                class="text-center py-20 bg-surface rounded-2xl border border-dashed border-accent">
                <p class="text-secondary font-bold">No transactions found.</p>
              </div>
              <div v-for="txn in paginatedTransactions" :key="txn.id"
                class="bg-surface rounded-3xl p-6 md:p-8 border border-black/5 transition-all group">
                <div class="flex justify-between items-start mb-6">
                  <div class="flex gap-4">
                    <div
                      class="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-primary  transition-colors">
                      <LucideShoppingBag v-if="txn.label.includes('Purchase')" :size="20" />
                      <LucideCreditCard v-else :size="20" />
                    </div>
                    <div class="space-y-0.5">
                      <p class="font-extrabold text-lg uppercase tracking-wide leading-tight">{{ txn.label }}</p>
                      <p class="text-[10px] text-secondary font-mono tracking-tight uppercase">{{ txn.date }}</p>
                    </div>
                  </div>
                  <div
                    class="px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest leading-none"
                    :class="txn.status === 'Success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
                    {{ txn.status }}
                  </div>
                </div>

                <div class="pt-6 border-t border-accent flex flex-col gap-4">
                  <div class="flex gap-6 flex-1 w-full lg:items-end">
                    <div class="order-1 space-y-1.5 flex-none hidden md:block">
                      <button @click="openTxnDetails(txn)"
                        class="px-8 py-3 bg-primary text-white rounded-xl font-bold uppercase text-xs tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-soft">
                        Track Payment
                      </button>
                    </div>
                    <div v-if="txn.orderId" class="order-2 space-y-1.5 flex-none">
                      <p class="text-[10px] text-secondary uppercase font-extrabold tracking-widest">Related Order</p>
                      <button @click="openRelatedOrder(txn.orderId)"
                        class="text-sm font-bold text-primary underline hover:text-secondary uppercase tracking-tight text-left block transition-colors">
                        #{{ txn.orderId }}
                      </button>
                    </div>

                    <!-- Amount: Order 3 on mobile, Order 4 on desktop -->
                    <div class="order-3 lg:order-4 lg:ml-auto space-y-1.5">
                      <p class="text-[10px] text-secondary uppercase font-extrabold tracking-widest">Total Amount</p>
                      <p class="text-xl font-extrabold font-mono tracking-tighter text-primary leading-none">
                        ₦{{ txn.amount.toLocaleString() }}
                      </p>
                    </div>


                  </div>
                  <!-- Button: mobile -->
                  <div class="block md:hidden">
                    <button @click="openTxnDetails(txn)"
                      class="w-full lg:w-auto px-10 py-5 bg-primary text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all hover:opacity-90 active:scale-95 shadow-soft whitespace-nowrap">
                      Track Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Transaction Pagination -->
            <div v-if="totalTxnPages > 1" class="flex items-center justify-center gap-4 pt-4">
              <button @click="currentTxnPage--" :disabled="currentTxnPage === 1"
                class="w-10 h-10 flex items-center justify-center rounded-full border border-accent bg-white shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90">
                <LucideChevronLeft :size="20" />
              </button>
              <div class="flex items-center gap-2">
                <span class="text-sm font-mono font-bold">{{ currentTxnPage }}</span>
                <span class="text-xs text-secondary italic">of</span>
                <span class="text-sm font-mono font-bold">{{ totalTxnPages }}</span>
              </div>
              <button @click="currentTxnPage++" :disabled="currentTxnPage === totalTxnPages"
                class="w-10 h-10 flex items-center justify-center rounded-full border border-accent bg-white shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90">
                <LucideChevronRight :size="20" />
              </button>
            </div>
          </div>

          <!-- Addresses View (Dummy) -->
          <div v-else-if="selectedTab === 'Addresses'" class="space-y-8">
            <h1 class="text-4xl font-mono uppercase tracking-tight">Addresses</h1>
            <div class="space-y-4">
              <div v-for="i in 2" :key="i" class="bg-surface rounded-3xl p-6 flex justify-between items-start">
                <div class="flex gap-4">
                  <div class="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary shrink-0">
                    <LucideMapPin :size="20" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <p class="font-bold uppercase tracking-wide">{{ i === 1 ? 'Home' : 'Office' }}</p>
                      <span v-if="i === 1"
                        class="text-[10px] px-2 py-0.5 bg-primary text-white rounded-full font-bold uppercase tracking-widest">Default</span>
                    </div>
                    <p class="text-sm text-secondary">123 Fashion Blvd, Suite 400<br />New York, NY 10001, USA</p>
                  </div>
                </div>
                <button @click="openAddressDrawer({ label: i === 1 ? 'Home' : 'Office' })"
                  class="text-primary font-bold text-sm underline uppercase tracking-widest cursor-pointer hover:text-secondary transition-all">
                  Edit
                </button>
              </div>
              <button @click="openAddressDrawer()"
                class="w-full py-6 border-2 border-dashed border-accent rounded-2xl text-secondary font-bold hover:border-primary hover:text-primary transition-all">
                + Add New Address
              </button>
            </div>
          </div>

          <!-- Settings View (Dummy) -->
          <div v-else-if="selectedTab === 'Settings'" class="space-y-8">
            <h1 class="text-4xl font-mono uppercase tracking-tight">Settings</h1>
            <div class="bg-surface rounded-3xl divide-y divide-accent">
              <div class="p-6 flex justify-between items-center text-primary group">
                <div>
                  <p class="font-bold uppercase tracking-wide">Push Notifications</p>
                  <p class="text-xs text-secondary mt-0.5">Receive updates about orders and sales</p>
                </div>
                <div @click="togglePreference('pushNotifications')"
                  class="w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors duration-300"
                  :class="store.userPreferences.pushNotifications ? 'bg-primary' : 'bg-accent'">
                  <div class="w-4 h-4 bg-white rounded-full absolute transition-all duration-300 shadow-sm"
                    :class="store.userPreferences.pushNotifications ? 'right-1' : 'left-1'"></div>
                </div>
              </div>
              <div class="p-6 flex justify-between items-center group">
                <div>
                  <p class="font-bold uppercase tracking-wide">Email Marketing</p>
                  <p class="text-xs text-secondary mt-0.5">Weekly newsletters and exclusive offers</p>
                </div>
                <div @click="togglePreference('emailMarketing')"
                  class="w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors duration-300"
                  :class="store.userPreferences.emailMarketing ? 'bg-primary' : 'bg-accent'">
                  <div class="w-4 h-4 bg-white rounded-full absolute transition-all duration-300 shadow-sm"
                    :class="store.userPreferences.emailMarketing ? 'right-1' : 'left-1'"></div>
                </div>
              </div>
              <div class="p-6 flex justify-between items-center">
                <div>
                  <p class="font-bold uppercase tracking-wide">Appearance</p>
                  <p class="text-xs text-secondary mt-0.5">System default theme</p>
                </div>
                <p
                  class="text-sm font-bold text-primary uppercase underline cursor-pointer hover:text-secondary transition-all">
                  Modify</p>
              </div>
              <div class="p-6">
                <button @click="showDeleteAccountDrawer = true"
                  class="text-[#FF3B30] font-bold uppercase tracking-widest text-sm hover:underline hover:text-red-800 transition-all">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Order Details Drawer -->
    <BaseDrawer v-model="showDetailsDrawer" title="Order Details"
      :subtitle="selectedOrderForDrawer ? `ID: #${selectedOrderForDrawer.id}` : ''">
      <div v-if="selectedOrderForDrawer" class="space-y-8">
        <div class="space-y-4">
          <div v-for="(item, i) in selectedOrderForDrawer.items" :key="i" class="flex gap-4">
            <div class="w-20 h-24 bg-accent rounded-xl overflow-hidden shrink-0 border border-black/5">
              <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <p class="font-bold text-gray-800 line-clamp-1 truncate">{{ item.name }}</p>
              <p class="text-xs text-secondary mt-1">Size: M | Color: Midnight Black</p>
              <div class="mt-auto flex justify-between items-end">
                <p class="text-sm font-bold text-primary">₦{{ item.price.toLocaleString() }}</p>
                <p class="text-xs text-secondary">Qty: 1</p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex justify-between text-sm">
            <span class="text-secondary">Subtotal</span>
            <span class="font-bold text-gray-800">₦{{ selectedOrderForDrawer.total.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-secondary">Shipping</span>
            <span class="font-bold text-green-600">FREE</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-secondary">Estimated Tax</span>
            <span class="font-bold text-gray-800">₦0</span>
          </div>
          <div class="pt-4 border-t border-accent flex justify-between items-center">
            <span class="font-bold uppercase tracking-wide">Total Amount</span>
            <span class="text-2xl font-extrabold font-mono tracking-tight">₦{{ selectedOrderForDrawer.total.toLocaleString()
            }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <button
          @click="reorderAllItems"
          class="w-full py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-soft transition-transform active:scale-95">
          Reorder All Items
        </button>
      </template>
    </BaseDrawer>

    <!-- Track Order Drawer -->
    <BaseDrawer v-model="showTrackingDrawer" title="Track Order"
      :subtitle="selectedOrderForDrawer ? `ID: #${selectedOrderForDrawer.id}` : ''">
      <div v-if="selectedOrderForDrawer" class="space-y-10 py-4">
        <div class="flex items-center gap-6 p-6 bg-accent rounded-3xl">
          <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0">
            <LucideTruck :size="32" />
          </div>
          <div>
            <p class="text-xs text-secondary uppercase font-bold tracking-widest mb-1">Estimated Delivery</p>
            <p class="text-xl font-extrabold">Oct 18, 2023</p>
          </div>
        </div>

        <div class="relative space-y-12 pl-4">
          <!-- Connector Line -->
          <div class="absolute left-6 top-4 bottom-4 w-0.5 bg-accent"></div>

          <div v-for="(step, idx) in trackingSteps" :key="idx" class="relative flex gap-8">
            <div class="w-4 h-4 rounded-full z-10 shrink-0 mt-1.5 transition-colors duration-500"
              :class="isStepComplete(step.status) ? 'bg-primary ring-4 ring-primary/20' : 'bg-gray-200'"></div>
            <div :class="{ 'opacity-40': !isStepComplete(step.status) }">
              <p class="font-bold text-lg leading-tight">{{ step.label }}</p>
              <p class="text-sm text-secondary mt-1">{{ step.description }}</p>
              <p v-if="isStepComplete(step.status)"
                class="text-[10px] text-primary font-bold mt-2 uppercase tracking-tight">
                {{ step.date }}
              </p>
            </div>
          </div>
        </div>
      </div>


    </BaseDrawer>


    <!-- Transaction Details Drawer -->
    <BaseDrawer v-model="showTxnDetailsDrawer" title="Payment Details"
      :subtitle="selectedTxnForDrawer ? `Reference: ${selectedTxnForDrawer.id}` : ''">
      <div v-if="selectedTxnForDrawer" class="space-y-8 py-4">
        <div class="bg-surface rounded-3xl p-8 border border-accent flex flex-col items-center text-center">
          <div class="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
            <LucideCreditCard :size="32" />
          </div>
          <p class="text-xs text-secondary uppercase font-bold tracking-widest mb-1">{{ selectedTxnForDrawer.label }}
          </p>
          <p class="text-4xl font-extrabold font-mono tracking-tighter">₦{{ selectedTxnForDrawer.amount.toLocaleString() }}
          </p>
        </div>

        <div class="space-y-4">
          <div class="flex justify-between items-center py-4 border-b border-accent/50">
            <span class="text-xs text-secondary uppercase font-bold tracking-widest">Status</span>
            <span
              class="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-green-50 text-green-700">
              {{ selectedTxnForDrawer.status }}
            </span>
          </div>
          <div class="flex justify-between items-center py-4 border-b border-accent/50">
            <span class="text-xs text-secondary uppercase font-bold tracking-widest">Date</span>
            <span class="text-sm font-bold">{{ selectedTxnForDrawer.date }}</span>
          </div>
          <div class="flex justify-between items-center py-4 border-b border-accent/50">
            <span class="text-xs text-secondary uppercase font-bold tracking-widest">Payment Method</span>
            <span class="text-sm font-bold">{{ selectedTxnForDrawer.method }}</span>
          </div>
          <div class="flex justify-between items-center py-4 border-b border-accent/50">
            <span class="text-xs text-secondary uppercase font-bold tracking-widest">Related Order</span>
            <button @click="openRelatedOrder(selectedTxnForDrawer.orderId)"
              class="text-sm font-bold text-primary underline uppercase tracking-tight">
              #{{ selectedTxnForDrawer.orderId }}
            </button>
          </div>
        </div>

        <div class="space-y-10 pl-4 mt-8">
          <p class="text-[10px] text-secondary uppercase font-bold tracking-widest -ml-4 mb-2">Transaction Progress</p>
          <div class="relative space-y-12">
            <!-- Connector Line -->
            <div class="absolute left-2 top-4 bottom-4 w-0.5 bg-accent"></div>

            <div v-for="(step, idx) in paymentSteps" :key="idx" class="relative flex gap-8">
              <div class="w-4 h-4 rounded-full z-10 shrink-0 mt-1.5 bg-primary ring-4 ring-primary/20"></div>
              <div>
                <p class="font-bold text-lg leading-tight">{{ step.label }}</p>
                <p class="text-sm text-secondary mt-1">{{ step.description }}</p>
                <p class="text-[10px] text-primary font-bold mt-2 uppercase tracking-tight">Verified</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 bg-accent/30 rounded-2xl">
          <p class="text-[10px] text-secondary uppercase font-bold tracking-widest mb-2">Internal Note</p>
          <p class="text-xs italic leading-relaxed text-secondary/80">
            This transaction was processed via secure gateway. Funds have been verified and settled.
          </p>
        </div>
      </div>
      <!-- <template #footer>
        <button @click="showTxnDetailsDrawer = false"
          class="w-full py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-soft transition-transform active:scale-95">
          Close Record
        </button>
      </template> -->
    </BaseDrawer>

    <!-- Address Drawer -->
    <BaseDrawer v-model="showAddressDrawer" :title="editingAddress ? 'Edit Address' : 'Add New Address'">
      <div class="space-y-8 py-4">
        <div class="space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-secondary ml-1">Address Label</label>
            <div class="flex gap-2">
              <button v-for="label in ['Home', 'Office', 'Other']" :key="label"
                class="flex-1 py-3 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all"
                :class="label === 'Home' ? 'bg-primary text-white border-primary' : 'bg-surface text-secondary border-accent'">
                {{ label }}
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-secondary ml-1">Full Name</label>
            <input type="text" placeholder="Albert Stevano"
              class="w-full px-5 py-4 bg-surface rounded-2xl border border-accent focus:border-primary outline-none font-bold" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold uppercase tracking-widest text-secondary ml-1">Street Address</label>
            <input type="text" placeholder="123 Fashion Blvd"
              class="w-full px-5 py-4 bg-surface rounded-2xl border border-accent focus:border-primary outline-none font-bold" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-[10px] font-bold uppercase tracking-widest text-secondary ml-1">City</label>
              <input type="text" placeholder="New York"
                class="w-full px-5 py-4 bg-surface rounded-2xl border border-accent focus:border-primary outline-none font-bold" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-bold uppercase tracking-widest text-secondary ml-1">Zip Code</label>
              <input type="text" placeholder="10001"
                class="w-full px-5 py-4 bg-surface rounded-2xl border border-accent focus:border-primary outline-none font-bold" />
            </div>
          </div>
          <div class="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-accent">
            <div class="flex-1">
              <p class="text-sm font-bold uppercase tracking-wide">Set as default</p>
              <p class="text-[10px] text-secondary">Use this address for all future orders</p>
            </div>
            <div class="w-10 h-5 bg-primary rounded-full relative p-0.5 cursor-pointer">
              <div class="w-4 h-4 bg-white rounded-full absolute right-0.5"></div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="showAddressDrawer = false"
          class="w-full py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-soft transition-transform active:scale-95">
          Save Address
        </button>
      </template>
    </BaseDrawer>

    <!-- Sign Out Confirmation Drawer -->
    <BaseDrawer v-model="showSignOutDrawer" title="Sign Out" subtitle="Are you sure you want to leave?"
      desktopMode="modal" mobileMode="bottomsheet">
      <div class="py-10 text-center text-primary">
        <div class="w-20 h-20 bg-red-50 text-[#FF3B30] rounded-3xl flex items-center justify-center mx-auto mb-6">
          <LucideLogOut :size="40" />
        </div>
        <p class="text-secondary leading-relaxed px-4">
          You will need to enter your credentials again to access your account and order history.
        </p>
      </div>
      <template #footer>
        <div class="flex gap-4">
          <button @click="showSignOutDrawer = false"
            class="flex-1 py-4 bg-white border border-accent text-primary rounded-2xl font-bold uppercase tracking-widest transition-all hover:bg-surface active:scale-95">
            Cancel
          </button>
          <button @click="handleSignOut"
            class="flex-1 py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-soft transition-transform active:scale-95">
            Sign Out
          </button>
        </div>
      </template>
    </BaseDrawer>

    <!-- Delete Account Confirmation Drawer -->
    <BaseDrawer v-model="showDeleteAccountDrawer" title="Delete Account" subtitle="This action is permanent"
      desktopMode="modal" mobileMode="bottomsheet">
      <div class="py-10 text-primary">
        <div class="w-20 h-20 bg-red-50 text-[#FF3B30] rounded-3xl flex items-center justify-center mx-auto mb-6">
          <LucideAlertTriangle :size="40" />
        </div>
        <div class="bg-red-50/50 p-6 rounded-2xl border border-red-100 mb-6 mx-4">
          <p class="text-xs font-extrabold uppercase tracking-widest text-[#FF3B30] mb-2 text-center">Warning</p>
          <p class="text-sm text-red-700 leading-relaxed text-center">
            Deleting your account will permanently remove all your order history, saved addresses, and payment data.
          </p>
        </div>
        <p class="text-center text-secondary text-sm px-4">
          This action cannot be undone. Please confirm you wish to proceed.
        </p>
      </div>
      <template #footer>
        <div class="flex flex-col gap-3">
          <button @click="handleDeleteAccount"
            class="w-full py-4 bg-[#FF3B30] text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-red-500/20 transition-transform active:scale-95">
            Delete My Account
          </button>
          <button @click="showDeleteAccountDrawer = false"
            class="w-full py-4 bg-transparent text-secondary rounded-2xl font-bold uppercase tracking-widest transition-colors hover:text-primary active:scale-95">
            Keep My Account
          </button>
        </div>
      </template>
    </BaseDrawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  // User as LucideUser,
  // Camera as LucideCamera,
  ShoppingBag as LucideShoppingBag,
  CreditCard as LucideCreditCard,
  MapPin as LucideMapPin,
  Settings as LucideSettings,
  LogOut as LucideLogOut,
  ChevronLeft as LucideChevronLeft,
  ChevronRight as LucideChevronRight,
  Search as LucideSearch,
  Truck as LucideTruck,
  AlertTriangle as LucideAlertTriangle,
  Heart as LucideHeart,
} from '@lucide/vue'
import { products, store } from '@/store'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'
import ProductCard from '@/components/ProductCard.vue'

const router = useRouter()
const windowWidth = ref(window.innerWidth)

const isMobile = computed(() => windowWidth.value < 1024)

const reorderAllItems = () => {
  if (!selectedOrderForDrawer.value) return
  
  const cartItems = selectedOrderForDrawer.value.items.map((product: any) => ({
    product,
    quantity: 1,
    size: product.sizes?.[0] || 'M',
    color: product.colors?.[0] || 'Modern Black'
  }))
  
  store.reorderAllItems(cartItems)
  showDetailsDrawer.value = false
  router.push('/checkout')
}

const selectedTab = computed({
  get: () => store.currentProfileTab,
  set: (val) => store.currentProfileTab = val
})

const tabs = [
  { name: 'Orders', icon: LucideShoppingBag },
  { name: 'Wishlist', icon: LucideHeart },
  { name: 'Payments', icon: LucideCreditCard },
  { name: 'Addresses', icon: LucideMapPin },
  { name: 'Settings', icon: LucideSettings }
]

const wishlistProducts = computed(() => {
  return products.filter(p => store.favorites.includes(p.id))
})

// Drawer State
const showDetailsDrawer = ref(false)
const showTrackingDrawer = ref(false)
const selectedOrderForDrawer = ref<any>(null)

const openOrderDetails = (order: any) => {
  selectedOrderForDrawer.value = order
  showDetailsDrawer.value = true
}

const openOrderTracking = (order: any) => {
  selectedOrderForDrawer.value = order
  showTrackingDrawer.value = true
}

// Transaction Details State
const showTxnDetailsDrawer = ref(false)
const selectedTxnForDrawer = ref<any>(null)

const openTxnDetails = (txn: any) => {
  selectedTxnForDrawer.value = txn
  showTxnDetailsDrawer.value = true
}

// Address Drawer State
const showAddressDrawer = ref(false)
const editingAddress = ref<any>(null)

const openAddressDrawer = (address: any = null) => {
  editingAddress.value = address
  showAddressDrawer.value = true
}

// Account Actions State
const showSignOutDrawer = ref(false)
const showDeleteAccountDrawer = ref(false)

const handleSignOut = () => {
  // Mock sign out logic
  console.log('Signing out...')
  showSignOutDrawer.value = false
  router.push('/')
}

const handleDeleteAccount = () => {
  // Mock delete account logic
  console.log('Deleting account...')
  showDeleteAccountDrawer.value = false
  router.push('/')
}

const togglePreference = (key: 'pushNotifications' | 'emailMarketing') => {
  store.userPreferences[key] = !store.userPreferences[key]
}

const trackingSteps = [
  { status: 'Placed', label: 'Order Placed', description: 'Your order has been received.', date: 'Oct 12, 10:30 AM' },
  { status: 'Processing', label: 'Processing', description: 'We are preparing your items.', date: 'Oct 12, 02:45 PM' },
  { status: 'Shipped', label: 'In Transit', description: 'Order is on its way to you.', date: 'Oct 13, 08:00 AM' },
  { status: 'Delivered', label: 'Delivered', description: 'Package handed to resident.', date: 'Oct 15, 11:20 AM' }
]

const isStepComplete = (status: string) => {
  if (!selectedOrderForDrawer.value) return false
  const orderStatus = selectedOrderForDrawer.value.status
  if (orderStatus === 'Delivered') return true
  if (orderStatus === 'Processing') {
    return ['Placed', 'Processing'].includes(status)
  }
  return status === 'Placed'
}

const paymentSteps = [
  { label: 'Payment Initialized', description: 'Transaction record successfully created.', date: 'Oct 12, 10:30 AM' },
  { label: 'Funds Authorized', description: 'Bank has approved the charge.', date: 'Oct 12, 10:31 AM' },
  { label: 'Security Verified', description: 'Gateway 3D secure verification passed.', date: 'Oct 12, 10:32 AM' },
  { label: 'Settled', description: 'Revenue cleared and verified by treasury.', date: 'Oct 12, 10:35 AM' }
]

// Order Search & Pagination
const orderSearchQuery = ref('')
const currentOrderPage = ref(1)
const ordersPerPage = 5

const filteredOrders = computed(() => {
  if (!orderSearchQuery.value) return mockOrders
  return mockOrders.filter(order =>
    order.id.toLowerCase().includes(orderSearchQuery.value.toLowerCase())
  )
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / ordersPerPage))

const paginatedOrders = computed(() => {
  const start = (currentOrderPage.value - 1) * ordersPerPage
  const end = start + ordersPerPage
  return filteredOrders.value.slice(start, end)
})

// Payment Search & Pagination
const txnSearchQuery = ref('')
const currentTxnPage = ref(1)
const txnsPerPage = 5

const filteredTransactions = computed(() => {
  if (!txnSearchQuery.value) return mockTransactions
  return mockTransactions.filter(txn =>
    txn.id.toLowerCase().includes(txnSearchQuery.value.toLowerCase()) ||
    (txn.orderId && txn.orderId.toLowerCase().includes(txnSearchQuery.value.toLowerCase()))
  )
})

const totalTxnPages = computed(() => Math.ceil(filteredTransactions.value.length / txnsPerPage))

const paginatedTransactions = computed(() => {
  const start = (currentTxnPage.value - 1) * txnsPerPage
  const end = start + txnsPerPage
  return filteredTransactions.value.slice(start, end)
})

const openRelatedOrder = (orderId: string) => {
  // Close the transaction drawer first to avoid overlap/z-index issues
  showTxnDetailsDrawer.value = false

  const order = mockOrders.find(o => o.id === orderId)
  if (order) {
    // Small delay to ensure smooth transition
    setTimeout(() => {
      openOrderDetails(order)
    }, 300)
  }
}

// Reset page when switching search or tab
watch([orderSearchQuery, txnSearchQuery], () => {
  currentOrderPage.value = 1
  currentTxnPage.value = 1
})

const updateWidth = () => {
  windowWidth.value = window.innerWidth
  if (windowWidth.value >= 1024 && !selectedTab.value) {
    selectedTab.value = 'Orders'
  }
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
  if (window.innerWidth >= 1024 && !selectedTab.value) {
    selectedTab.value = 'Orders'
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
  // Clear tab state when leaving the page to ensure navbar resets
  store.currentProfileTab = null
})

const handleBack = () => {
  if (selectedTab.value && isMobile.value) {
    selectedTab.value = null
  } else {
    router.back()
  }
}

const mockOrders = [
  {
    id: 'B12-9843',
    date: 'Oct 12, 2023',
    status: 'Delivered',
    total: 289.00,
    items: [products[0], products[1], products[3], products[4], products[5], products[1], products[2]]
  },
  {
    id: 'B12-9721',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9723',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9724',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9725',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9726',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9727',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9728',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9729',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9730',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9731',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9732',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9733',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9734',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9735',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9736',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9737',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9738',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9739',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9740',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9741',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9742',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9743',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9744',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9745',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9746',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9747',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9748',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9749',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9750',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9751',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  },
  {
    id: 'B12-9752',
    date: 'Sep 24, 2023',
    status: 'Processing',
    total: 145.50,
    items: [products[2]]
  }
]

const mockTransactions = [
  {
    id: 'TXN-10234',
    orderId: 'B12-9843',
    date: 'Oct 12, 2023',
    label: 'Order Purchase',
    method: 'Visa •••• 4242',
    amount: 289.00,
    status: 'Success'
  },
  {
    id: 'TXN-10198',
    orderId: 'B12-9721',
    date: 'Oct 05, 2023',
    label: 'Order Purchase',
    method: 'Visa •••• 4242',
    amount: 145.50,
    status: 'Success'
  },
  {
    id: 'TXN-09842',
    orderId: 'B12-9723',
    date: 'Sep 24, 2023',
    label: 'Order Refund',
    method: 'Visa •••• 4242',
    amount: 62.99,
    status: 'Refunded'
  },
  {
    id: 'TXN-09811',
    orderId: 'B12-9724',
    date: 'Sep 18, 2023',
    label: 'Order Purchase',
    method: 'Visa •••• 4242',
    amount: 520.00,
    status: 'Success'
  },
  {
    id: 'TXN-09756',
    orderId: 'B12-9725',
    date: 'Sep 10, 2023',
    label: 'Order Purchase',
    method: 'Visa •••• 4242',
    amount: 231.01,
    status: 'Success'
  },
  {
    id: 'TXN-09755',
    orderId: 'B12-9726',
    date: 'Sep 09, 2023',
    label: 'Order Purchase',
    method: 'Visa •••• 4242',
    amount: 89.99,
    status: 'Success'
  },
  {
    id: 'TXN-09754',
    orderId: 'B12-9727',
    date: 'Sep 08, 2023',
    label: 'Order Purchase',
    method: 'Visa •••• 4242',
    amount: 120.00,
    status: 'Success'
  },
  {
    id: 'TXN-09753',
    orderId: 'B12-9728',
    date: 'Sep 07, 2023',
    label: 'Order Purchase',
    method: 'Visa •••• 4242',
    amount: 45.00,
    status: 'Success'
  },
  {
    id: 'TXN-09752',
    orderId: 'B12-9729',
    date: 'Sep 06, 2023',
    label: 'Order Purchase',
    method: 'Visa •••• 4242',
    amount: 300.00,
    status: 'Success'
  },
  {
    id: 'TXN-09751',
    orderId: 'B12-9730',
    date: 'Sep 05, 2023',
    label: 'Order Purchase',
    method: 'Visa •••• 4242',
    amount: 15.50,
    status: 'Success'
  },
  {
    id: 'TXN-09750',
    orderId: 'B12-9731',
    date: 'Sep 04, 2023',
    label: 'Order Purchase',
    method: 'Visa •••• 4242',
    amount: 67.00,
    status: 'Success'
  }
]
</script>
