import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { checkToken } from "@/helpers/checkToken";
import { useToast } from 'vue-toastification';

const Toast = useToast();

const routes: Array<RouteRecordRaw> = [
    {
        path: '/businesses',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
    },
    {
        path: '/business/:id',
        name: 'business-detail',
        component: () => import('@/views/client/BookView.vue'),
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
    {
        path: "/forgot-password",
        name: "ForgotPassword",
        component: () => import('@/views/ForgotPassword.vue'),
    },

    { path: '/', redirect: '/businesses' },
    { path: '/:pathMatch(.*)*', redirect: '/businesses' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

let sessionExpiredShown = false;
router.beforeEach((to, _, next) => {
    const authStore = useAuthStore()
    const isAuthenticated = !!authStore.token

    if (isAuthenticated) {
        const isValid = checkToken();
        if (!isValid) {
            if (!sessionExpiredShown) {
                Toast.info('Sessiya tugadi, tizimga qayta kiring!')
                sessionExpiredShown = true;
            }
            authStore.logout();
            if (to.name === 'Login' || to.name === 'Register') return next()
            return next({ name: 'Login' })
        }
        sessionExpiredShown = false;
    }

    if (to.meta.requiresAuth && !isAuthenticated) {
        return next({ name: 'Login' })
    }

    if ((to.name === 'Login' || to.name === 'Register' || to.name === 'ForgotPassword') && isAuthenticated) {
        return next({ name: 'Dashboard' })
    }
    next()
})

export default router;
