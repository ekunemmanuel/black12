import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Index.vue'
import ProductDetails from '@/pages/ProductDetails.vue'
import Checkout from '@/pages/Checkout.vue'
import Profile from '@/pages/Profile.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/product/:id',
        name: 'ProductDetails',
        component: ProductDetails
    },
    {
        path: '/checkout',
        name: 'Checkout',
        component: Checkout
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/shop',
        name: 'Shop',
        component: () => import('@/pages/Shop.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

export default router