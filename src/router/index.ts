import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'role-select',
        component: () => import('@/views/RoleSelectView.vue'),
    },

    {
        path: '/staff',
        component: () => import('@/views/staff/StaffLayout.vue'),
        meta: { requiresRole: 'staff' },
        children: [
            { path: '/',        redirect: { name: 'schedule' } },
            { path: 'schedule',   name: 'schedule',    component: () => import('@/views/staff/ScheduleView.vue')   },
            { path: 'employees',  name: 'employees',   component: () => import('@/views/staff/EmployeesView.vue')   },
            { path: 'bookings',   name: 'bookings',    component: () => import('@/views/staff/BookingsView.vue')   },
            { path: 'add',        name: 'add-booking', component: () => import('@/views/staff/AddBookingView.vue')   },
        ],
    },

    {
        path: '/client',
        component: () => import('@/views/client/ClientLayout.vue'),
        meta: { requiresRole: 'client' },
        children: [
            { path: '',         redirect: { name: 'book' } },
            { path: 'book',     name: 'book',        component: () => import('@/views/client/BookView.vue')       },
            { path: 'my',       name: 'my-bookings', component: () => import('@/views/client/MyBookingsView.vue')   },
        ],
    },

    { path: '/:pathMatch(.*)*', redirect: '/' },
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to) => {
    const role = localStorage.getItem('role') as 'staff' | 'client' | null

    if (to.meta.requiresRole && to.meta.requiresRole !== role) {
        return { name: 'role-select' }
    }

    if (to.name === 'role-select' && role) {
        return { path: `/${role}` }
    }
})

export default router;