<template>
  <div class="space-y-8 pb-10">
    <!-- Header & Stats -->
    <div class="space-y-8">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto ml-auto">
          <BaseInput v-model="searchQuery" class="w-full sm:min-w-[400px]" placeholder="Search name or SKU...">
            <template #prefix>
              <LucideSearch :size="18" class="text-secondary/40 transition-colors" />
            </template>
          </BaseInput>
          <BaseButton @click="openCreateDrawer" variant="primary" class="h-[56px] px-8 rounded-2xl whitespace-nowrap shrink-0">
            <LucidePlus :size="20" />
            Add New Product
          </BaseButton>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Total Products" 
          :value="products.length.toString()" 
          :icon="LucidePackage" 
          iconBg="bg-blue-50" 
          iconColor="text-blue-600"
        />
        <StatCard 
          label="Low Stock" 
          :value="products.filter((p: Product) => (p.stock || 0) <= 10 && (p.stock || 0) > 0).length.toString()" 
          :icon="LucideAlertTriangle" 
          iconBg="bg-orange-50" 
          iconColor="text-orange-600"
          :trend="-5.2"
        />
        <StatCard 
          label="Out of Stock" 
          :value="products.filter((p: Product) => (p.stock || 0) === 0).length.toString()" 
          :icon="LucideBox" 
          iconBg="bg-red-50" 
          iconColor="text-red-600"
        />
        <StatCard 
          label="Categories" 
          :value="new Set(products.map((p: Product) => p.category)).size.toString()" 
          :icon="LucideLayers" 
          iconBg="bg-purple-50" 
          iconColor="text-purple-600"
        />
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-[30px] overflow-hidden shadow-soft border border-gray-100">
      <div class="overflow-x-auto">
        <table v-if="paginatedProducts.length > 0" class="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr class="bg-gray-50/50">
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Product</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Category</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Size</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Price</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Stock</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Status</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="product in paginatedProducts" :key="product.id" class="group hover:bg-gray-50/30 transition-all duration-300">
               <td class="px-8 py-6 whitespace-nowrap">
                <div class="flex items-center gap-5">
                  <div class="w-14 h-14 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                    <img :src="product.image" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p class="text-sm font-black text-primary mb-1 leading-none tracking-tight">{{ product.name }}</p>
                    <p class="text-[10px] font-black tracking-widest uppercase text-secondary/40">ID: #{{ product.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="text-xs font-bold text-secondary uppercase tracking-tight">{{ product.category }}</span>
              </td>
              <td class="px-8 py-6">
                <div class="flex flex-wrap gap-1 max-w-[120px]">
                  <span v-for="size in product.sizes" :key="size" class="text-[9px] font-black bg-gray-100 px-1.5 py-0.5 rounded uppercase">
                    {{ size }}
                  </span>
                  <span v-if="!product.sizes?.length" class="text-[9px] text-secondary/40 italic">N/A</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <p class="text-sm font-bold text-primary">₦{{ (product.price || product.originalPrice).toLocaleString() }}</p>
                <p v-if="product.price && product.originalPrice > product.price" class="text-[10px] text-secondary/40 line-through">₦{{ product.originalPrice.toLocaleString() }}</p>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2">
                  <div class="h-1.5 w-12 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full rounded-full" 
                         :class="getStockColor(product.stock || 0)"
                         :style="{ width: Math.min((product.stock || 0) * 2, 100) + '%' }"></div>
                  </div>
                  <span class="text-xs font-bold text-primary">{{ product.stock }}</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                      :class="product.stock && product.stock > 10 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'">
                  {{ product.stock && product.stock > 10 ? 'In Stock' : 'Low Stock' }}
                </span>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2">
                  <button @click="openEditDrawer(product)" class="p-2.5 rounded-xl bg-gray-50 text-secondary hover:text-primary hover:bg-gray-100 transition-all shadow-sm">
                    <LucideEdit2 :size="16" />
                  </button>
                  <button @click="confirmDelete(product)" class="p-2.5 rounded-xl bg-gray-50 text-secondary hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">
                    <LucideTrash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Premium Empty State -->
        <div v-else class="flex-1 flex flex-col items-center justify-center p-20 text-center animate-in fade-in zoom-in duration-700">
           <div class="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center text-secondary/20 mb-8 border border-gray-100 shadow-sm relative overflow-hidden group">
              <div class="absolute inset-0 bg-linear-to-tr from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <LucidePackage :size="40" class="relative z-10" />
           </div>
           <h3 class="text-xl font-black text-primary mb-3 uppercase tracking-tighter">
              {{ searchQuery ? "No products found" : "Your catalog is empty" }}
           </h3>
           <p class="text-sm text-secondary/40 max-w-xs mx-auto leading-relaxed font-medium">
              {{ searchQuery 
                 ? "We couldn't find any products matching your search. Try a different keyword or SKU." 
                 : "Start building your premium collection by adding your first product to the store." 
              }}
           </p>
           <div class="mt-10 flex gap-4">
              <BaseButton v-if="searchQuery" variant="outline" class="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]" @click="searchQuery = ''">
                 Clear search
              </BaseButton>
              <BaseButton v-if="!searchQuery" variant="primary" class="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em]" @click="openCreateDrawer">
                 Add First Product
              </BaseButton>
           </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <BasePagination 
        v-model:current-page="currentPage"
        v-model:limit="itemsPerPage"
        :total="filteredProducts.length"
      />
    </div>

    <!-- Edit/Create Drawer -->
    <BaseDrawer v-model="isDrawerOpen" :title="isEditing ? 'Edit Product' : 'Add New Product'" subtitle="Fill in the product information below">
      <div class="space-y-8">
        <BaseInput v-model="form.name" label="Product Name" placeholder="e.g. Essential Tee" />
        
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-widest text-secondary/60">Category</label>
            <select v-model="form.category" class="w-full px-5 h-[56px] bg-gray-50 border-none rounded-2xl text-sm focus:ring-1 focus:ring-primary transition-all font-medium">
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <BaseInput v-model.number="form.stock" label="Stock Quantity" type="number" />
        </div>

        <div class="grid grid-cols-2 gap-6">
          <BaseInput v-model.number="form.price" label="Sale Price (₦)" placeholder="Leave empty to use original" type="number" />
          <BaseInput v-model.number="form.originalPrice" label="Original Price (₦)" type="number" />
        </div>

        <div class="space-y-4">
          <label class="text-[10px] font-black uppercase tracking-widest text-secondary/60">Available Sizes</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="size in availableSizes" 
              :key="size"
              @click="toggleSize(size)"
              class="px-4 py-2 rounded-xl text-xs font-black transition-all border-2"
              :class="form.sizes.includes(size) ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-secondary border-transparent hover:border-gray-200'"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-[10px] font-black uppercase tracking-widest text-secondary/60">Description</label>
          <textarea v-model="form.description" rows="4" class="w-full p-5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-1 focus:ring-primary transition-all font-medium resize-none" placeholder="Enter product details..."></textarea>
        </div>

        <div class="space-y-4">
          <label class="text-[10px] font-black uppercase tracking-widest text-secondary/60">Product Image URL</label>
          <div class="flex gap-4">
            <div class="w-24 h-24 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
               <img v-if="form.image" :src="form.image" class="w-full h-full object-cover" />
               <LucideImage v-else class="text-gray-300" :size="32" />
            </div>
            <div class="flex-1">
              <BaseInput v-model="form.image" placeholder="https://..." />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-4 w-full">
          <BaseButton variant="outline" class="flex-1 py-4 text-xs font-black uppercase tracking-widest" @click="isDrawerOpen = false">Cancel</BaseButton>
          <BaseButton variant="primary" class="flex-1 py-4 text-xs font-black uppercase tracking-widest" @click="saveProduct">
            {{ isEditing ? 'Save Changes' : 'Create Product' }}
          </BaseButton>
        </div>
      </template>
    </BaseDrawer>

    <!-- Delete Confirmation Drawer -->
    <BaseDrawer v-model="isDeleteDrawerOpen" title="Confirm Deletion" subtitle="This action cannot be undone" desktop-mode="modal">
      <div class="py-10 text-center">
        <div class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <LucideTrash2 :size="40" />
        </div>
        <h4 class="text-xl font-bold text-primary mb-3">Delete {{ productToDelete?.name }}?</h4>
        <p class="text-sm text-secondary leading-relaxed px-6">
          The product will soon be deducted from the catalog. Are you sure you want to proceed with this removal?
        </p>
      </div>

      <template #footer>
        <div class="flex gap-4 w-full">
          <BaseButton variant="outline" class="flex-1 py-4 text-xs font-black uppercase tracking-widest" @click="isDeleteDrawerOpen = false">No, Keep it</BaseButton>
          <BaseButton variant="primary" class="flex-1 py-4 text-xs font-black uppercase tracking-widest bg-red-500 hover:bg-red-600 border-none shadow-red-500/20" @click="performDelete">
            Yes, Delete Product
          </BaseButton>
        </div>
      </template>
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { 
  Search as LucideSearch,
  Plus as LucidePlus,
  Package as LucidePackage,
  AlertTriangle as LucideAlertTriangle,
  Box as LucideBox,
  Layers as LucideLayers,
  Edit2 as LucideEdit2,
  Trash2 as LucideTrash2,
  Image as LucideImage
} from '@lucide/vue'
import StatCard from '@/components/admin/StatCard.vue'
import { store, products, type Product } from '@/store'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'
import BasePagination from '@/components/ui/BasePagination.vue'

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const isDrawerOpen = ref(false)
const isDeleteDrawerOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const productToDelete = ref<Product | null>(null)

const categories = ['T-Shirt', 'Dress', 'Jacket', 'Knitwear', 'Children', 'Accessories']
const availableSizes = ['8', '9', '10', '11', '12', '13', '14', '15', 'S', 'M', 'L', 'XL']

const form = reactive({
  name: '',
  category: 'T-Shirt',
  price: 0,
  originalPrice: 0,
  description: '',
  stock: 0,
  image: '',
  sizes: [] as string[],
  colors: ['#1A1A1A'],
  rating: 5.0,
  reviews: 0
})

const filteredProducts = computed(() => {
  let result = products
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((p: Product) => 
      p.name.toLowerCase().includes(q) || 
      p.id.toString().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  }
  
  return result
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

watch([searchQuery, itemsPerPage], () => {
  currentPage.value = 1
})

const getStockColor = (stock: number) => {
  if (stock < 10) return 'bg-red-500'
  if (stock < 25) return 'bg-yellow-500'
  return 'bg-green-500'
}

const toggleSize = (size: string) => {
  const index = form.sizes.indexOf(size)
  if (index === -1) {
    form.sizes.push(size)
  } else {
    form.sizes.splice(index, 1)
  }
}

const openCreateDrawer = () => {
  isEditing.value = false
  editingId.value = null
  Object.assign(form, {
    name: '',
    category: 'T-Shirt',
    price: 0,
    originalPrice: 0,
    description: '',
    stock: 0,
    image: '',
    sizes: [],
    colors: ['#1A1A1A'],
    rating: 5.0,
    reviews: 0
  })
  isDrawerOpen.value = true
}

const openEditDrawer = (product: Product) => {
  isEditing.value = true
  editingId.value = product.id
  Object.assign(form, { ...product })
  isDrawerOpen.value = true
}

const saveProduct = () => {
  // Pricing logic: fallback to originalPrice if salePrice is missing/0
  const finalPrice = form.price || form.originalPrice
  const productData = { ...form, price: finalPrice } as Product

  if (isEditing.value && editingId.value) {
    store.updateProduct({ ...productData, id: editingId.value })
  } else {
    store.addProduct(productData)
  }
  isDrawerOpen.value = false
}

const confirmDelete = (product: Product) => {
  productToDelete.value = product
  isDeleteDrawerOpen.value = true
}

const performDelete = () => {
  if (productToDelete.value) {
    store.deleteProduct(productToDelete.value.id)
    isDeleteDrawerOpen.value = false
    productToDelete.value = null
  }
}
</script>
