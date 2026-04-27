<template>
  <div class="layout">
    <nav class="navbar">
      <div class="nav-inner">
        <RouterLink to="/client/book" class="nav-logo">
          ✂️ <span>SalonQueue</span>
        </RouterLink>
        <div class="nav-tabs">
          <RouterLink
            v-for="tab in tabs"
            :key="tab.to"
            :to="tab.to"
            class="nav-tab"
            active-class="nav-tab--active"
          >{{ tab.label }}</RouterLink>
        </div>
        <div class="nav-right">
          <span class="role-badge">👤 Mijoz</span>
          <button class="btn-exit" @click="logout">Chiqish</button>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
const router = useRouter()
const tabs = [
  { to: '/client/book', label: '📅 Navbat olish'       },
  { to: '/client/my',   label: '🕐 Mening navbatlarim' },
]
function logout() {
  localStorage.removeItem('role')
  router.push('/')
}
</script>

<style scoped>
.layout { min-height: 100vh; display: flex; flex-direction: column; }
.navbar { background: #0f172a; position: sticky; top: 0; z-index: 20; }
.nav-inner {
  max-width: 900px; margin: 0 auto;
  padding: 0 20px; height: 60px;
  display: flex; align-items: center; gap: 16px;
}
.nav-logo {
  display: flex; align-items: center; gap: 8px;
  font-size: 17px; font-weight: 800; color: #fff;
  text-decoration: none; flex-shrink: 0;
}
.nav-tabs { display: flex; gap: 4px; flex: 1; }
.nav-tab {
  padding: 7px 14px; border-radius: 8px;
  color: #94a3b8; font-size: 13px; font-weight: 500;
  text-decoration: none; white-space: nowrap; transition: all 0.15s;
}
.nav-tab:hover { background: rgba(255,255,255,0.08); color: #fff; }
.nav-tab--active { background: rgba(255,255,255,0.15); color: #fff; }
.nav-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.role-badge {
  font-size: 12px; font-weight: 600;
  padding: 5px 12px; border-radius: 20px;
  background: #0284c7; color: #fff;
}
.btn-exit {
  font-size: 12px; padding: 6px 12px; border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.2);
  background: transparent; color: #94a3b8; cursor: pointer; font-family: inherit;
}
.btn-exit:hover { color: #fff; border-color: rgba(255,255,255,0.4); }
.main-content {
  flex: 1; max-width: 900px; width: 100%; margin: 0 auto; padding: 24px 20px;
}
</style>
