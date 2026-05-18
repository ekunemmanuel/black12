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
    },
    {
        path: '/admin',
        component: () => import('@/pages/admin/AdminLayout.vue'),
        children: [
            {
                path: '',
                name: 'AdminDashboard',
                component: () => import('@/pages/admin/Dashboard.vue')
            },
            {
                path: 'products',
                name: 'AdminProducts',
                component: () => import('@/pages/admin/Products.vue')
            },
            {
                path: 'orders',
                name: 'AdminOrders',
                component: () => import('@/pages/admin/Orders.vue')
            },
            {
                path: 'customers',
                name: 'AdminCustomers',
                component: () => import('@/pages/admin/Customers.vue')
            },
            {
                path: 'payments',
                name: 'AdminPayments',
                component: () => import('@/pages/admin/Payments.vue')
            }
        ]
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