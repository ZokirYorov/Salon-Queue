<template>
  <div class="role-screen">
    <div class="role-logo">
      <h1>SalonQueue</h1>
      <p>Kimligingizni tanlang</p>
    </div>
    <div class="role-cards">
      <button class="role-card role-card--staff" @click="enter('staff')">
        <span class="card-icon">👔</span>
        <div class="card-body">
          <h3>Xodim / Admin</h3>
          <p>Kunlik jadval, navbatlarni boshqarish va xodimlar ro'yxati</p>
        </div>
        <span class="card-arrow">→</span>
      </button>
      <button class="role-card role-card--client" @click="enter('client')">
        <span class="card-icon">👤</span>
        <div class="card-body">
          <h3>Mijoz</h3>
          <p>Online navbat olish va bo'sh usta tanlash</p>
        </div>
        <span class="card-arrow">→</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * Rolni sessionStorage ga yozib, mos sahifaga o'tadi.
 * sessionStorage - brauzer tab yopilguncha saqlanadi.
 */
function enter(role: 'staff' | 'client') {
  localStorage.setItem('role', role)
  router.push(`/${role}`)
}
</script>

<style scoped>
.role-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 48px;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
}

.role-logo { text-align: center; }
.logo-icon { font-size: 56px; display: block; margin-bottom: 12px; }
.role-logo h1 { font-size: 36px; font-weight: 800; color: #1e293b; margin: 0 0 8px; }
.role-logo p  { font-size: 16px; color: #64748b; margin: 0; }

.role-cards {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 640px;
}

.role-card {
  flex: 1;
  min-width: 260px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 20px;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  font-family: inherit;
}
.role-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); }

.role-card--staff  { border-left: 4px solid #6366f1; }
.role-card--staff:hover  { border-color: #6366f1; }
.role-card--client { border-left: 4px solid #0ea5e9; }
.role-card--client:hover { border-color: #0ea5e9; }

.card-icon { font-size: 32px; flex-shrink: 0; }
.card-body { flex: 1; }
.card-body h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 6px; }
.card-body p  { font-size: 13px; color: #64748b; margin: 0; line-height: 1.5; }
.card-arrow { font-size: 18px; color: #cbd5e1; flex-shrink: 0; }

@media (max-width: 520px) {
  .role-cards { flex-direction: column; }
}
</style>
