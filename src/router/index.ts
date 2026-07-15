import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/Layouts/layout.vue'),
        redirect: '/home',
        children: [
            {
                path: '/home',
                name: 'Dashboard',
                component: () => import('@/views/Dashboard.vue'),
            },
            {
                path: "/create-salon",
                name: "CreateSalon",
                component: () => import('@/views/CreateSalon.vue'),
                // meta: { requiresAuth: true }
            },
            {
                path: "/admin/manage",
                name: "AdminManagement",
                component: () => import('@/views/admin/AdminManagementView.vue'),
                meta: { requiresRole: 'staff' }
            },
            {
                path: "/new",
                name: "New",
                component: () => import('@/views/DashboardPage.vue'),
            }
        ]
    },

    {
        path: '/staff',
        component: () => import('@/views/staff/StaffLayout.vue'),
        meta: { requiresRole: 'staff' },
        children: [
            { path: '',        redirect: { name: 'schedule' } },
            { path: 'schedule',   name: 'schedule',    component: () => import('@/views/staff/ScheduleView.vue')   },
            { path: 'employees',  name: 'employees',   component: () => import('@/views/staff/EmployeesView.vue')   },
            { path: 'bookings',   name: 'bookings',    component: () => import('@/views/staff/BookingsView.vue')   },
            { path: 'add',        name: 'add-booking', component: () => import('@/views/staff/AddBookingView.vue')   },
            { path: 'service',    name: 'services',   component: () => import('@/views/staff/ServicesView.vue')   },
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
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/ProfileView.vue'),
    },
    {
      path: "/role",
      name: "Role",
      component: () => import('@/views/RoleSelectView.vue')
    },
    {
        path: "/login",
        name: "Login",
        component: () => import('@/views/Login.vue')
    },
    {
        path: "/register",
        name: "Register",
        component: () => import('@/views/Register.vue')
    },

    { path: '/:pathMatch(.*)*', redirect: '/' },
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to) => {
    const role = localStorage.getItem('role') as 'staff' | 'client' | null;
    const selectedSalonId = localStorage.getItem('selectedSalonId');
    const isAuthenticated = !!role; // Foydalanuvchi tizimga kirganmi?

    // Agar marshrut autentifikatsiyani talab qilsa va foydalanuvchi tizimga kirmagan bo'lsa
    if (to.meta.requiresAuth && !isAuthenticated) {
        alert('Bu sahifaga kirish uchun avval tizimga kirishingiz kerak!');
        return { name: 'Login' }; // Login sahifasiga yo'naltiramiz
    }

    // Agar marshrut rol talab qilsa va foydalanuvchida bu rol bo'lmasa, Dashboardga qaytaramiz
    // if (to.meta.requiresRole && to.meta.requiresRole !== role) {
    //     alert('Bu sahifaga kirish uchun sizda tegishli ruxsat yo\'q!');
    //     if(role === 'staff') {
    //         return { name: 'schedule' };
    //     }
    //     if(role === 'client') {
    //         return { name: 'book' };
    //     }
    //     return { name: 'Dashboard' };
    // }

    // Agar foydalanuvchi Dashboardga kirsa va allaqachon roli bo'lsa, uni o'z sahifasiga yo'naltiramiz
    if (to.name === 'Dashboard' && isAuthenticated && selectedSalonId) {
        if (role === 'staff') {
            return { path: `/staff/schedule?salonId=${selectedSalonId}` };
        } else if (role === 'client') {
            return { path: `/client/book?salonId=${selectedSalonId}` };
        }
    }

    // Agar foydalanuvchi staff/client sahifalariga kirmoqchi bo'lsa, lekin salon tanlanmagan bo'lsa, Dashboardga qaytaramiz
    if ((to.path.startsWith('/staff') || to.path.startsWith('/client')) && !selectedSalonId && isAuthenticated) {
        alert('Iltimos, avval salonni tanlang!');
        return { name: 'Dashboard' };
    }
})

export default router;