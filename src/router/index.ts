import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/businesses',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/business/:id',
        name: 'business-detail',
        component: () => import('@/views/client/BookView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/client',
        component: () => import('@/views/client/ClientLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            { path: '', redirect: { name: 'my-bookings' } },
            { path: 'my', name: 'my-bookings', component: () => import('@/views/client/MyBookingsView.vue') },
        ],
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/ProfileView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "/login",
        name: "Login",
        component: () => import('@/views/Login.vue'),
    },
    {
        path: "/register",
        name: "Register",
        component: () => import('@/views/Register.vue'),
    },

    { path: '/', redirect: '/businesses' },
    { path: '/:pathMatch(.*)*', redirect: '/businesses' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to) => {
    const authStore = useAuthStore()
    const isAuthenticated = !!authStore.token

    if (to.meta.requiresAuth && !isAuthenticated) {
        return { name: 'Login' }
    }

    if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
        return { name: 'Dashboard' }
    }
})

export default router;
