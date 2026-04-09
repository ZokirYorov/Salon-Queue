import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Main',
        redirect: '/home',
        component: () => import("@/Layouts/layout.vue"),
        children: [
            {
                path: '/home',
                name: 'Salon',
                component: () => import("@/views/SalonView.vue"),
                meta: { requiresAuth: true },
            }
        ]
    }
]
const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router;