<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  UserRound,
  X
} from 'lucide-vue-next'
import BrandLogo from '@/components/BrandLogo.vue'
import { useAuthStore } from '@/stores/auth'
import { ROLES } from '@/utils/jwt'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const mobileOpen = ref(false)

const navigation = [
  { name: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [ROLES.SUPERVISOR, ROLES.OPERADOR] },
  { name: 'venta', label: 'Nueva venta', icon: CreditCard, roles: [ROLES.OPERADOR] },
  { name: 'consultas', label: 'Consultas', icon: ReceiptText, roles: [ROLES.OPERADOR] },
  { name: 'cancelaciones', label: 'Cancelaciones', icon: RotateCcw, roles: [ROLES.SUPERVISOR] }
]

const items = computed(() => navigation.filter((item) => auth.hasRole(item.roles)))

watch(() => route.fullPath, () => (mobileOpen.value = false))

function logout() {
  auth.logout()
  toast.info('Sesión cerrada correctamente')
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-canvas">
    <!-- Sidebar escritorio -->
    <aside class="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200/70 bg-white lg:flex">
      <div class="flex h-20 items-center px-6">
        <RouterLink :to="{ name: 'dashboard' }"><BrandLogo size="h-7" /></RouterLink>
      </div>

      <nav class="flex-1 space-y-1 px-4 py-4">
        <p class="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">Menú</p>
        <RouterLink
          v-for="item in items"
          :key="item.name"
          :to="{ name: item.name }"
          class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-canvas-200 hover:text-ink"
          active-class="!bg-brand-50 !text-brand-600"
        >
          <component :is="item.icon" class="h-[18px] w-[18px]" />
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="m-4 rounded-2xl border border-slate-200/70 bg-canvas p-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white">
            <UserRound class="h-5 w-5" />
          </div>
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold">{{ auth.displayName }}</p>
            <p class="flex items-center gap-1 text-xs text-brand-600">
              <ShieldCheck class="h-3.5 w-3.5" /> {{ auth.role }}
            </p>
          </div>
        </div>
        <button type="button" class="btn-ghost mt-3 w-full !py-2" @click="logout">
          <LogOut class="h-4 w-4" /> Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- Topbar móvil -->
    <header
      class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/90 px-4 backdrop-blur lg:hidden"
    >
      <RouterLink :to="{ name: 'dashboard' }"><BrandLogo size="h-6" /></RouterLink>
      <div class="flex items-center gap-2">
        <span class="pill bg-brand-50 text-brand-600">{{ auth.role }}</span>
        <button type="button" class="rounded-xl p-2 text-ink hover:bg-canvas-200" aria-label="Abrir menú" @click="mobileOpen = true">
          <Menu class="h-5 w-5" />
        </button>
      </div>
    </header>

    <!-- Drawer móvil -->
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileOpen" class="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden" @click.self="mobileOpen = false">
        <div class="ml-auto flex h-full w-72 flex-col bg-white p-5 shadow-float animate-fade-up">
          <div class="flex items-center justify-between">
            <BrandLogo size="h-6" />
            <button type="button" class="rounded-xl p-2 hover:bg-canvas-200" aria-label="Cerrar menú" @click="mobileOpen = false">
              <X class="h-5 w-5" />
            </button>
          </div>
          <div class="mt-6 rounded-2xl bg-canvas p-4">
            <p class="truncate text-sm font-semibold">{{ auth.displayName }}</p>
            <p class="text-xs text-brand-600">{{ auth.role }}</p>
          </div>
          <nav class="mt-4 flex-1 space-y-1">
            <RouterLink
              v-for="item in items"
              :key="item.name"
              :to="{ name: item.name }"
              class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-ink-600 hover:bg-canvas-200"
              active-class="!bg-brand-50 !text-brand-600"
            >
              <component :is="item.icon" class="h-5 w-5" /> {{ item.label }}
            </RouterLink>
          </nav>
          <button type="button" class="btn-primary w-full" @click="logout">
            <LogOut class="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      </div>
    </Transition>

    <main class="px-4 pb-24 pt-6 sm:px-6 lg:ml-64 lg:px-10 lg:pb-10 lg:pt-10">
      <div class="mx-auto max-w-6xl">
        <RouterView v-slot="{ Component }">
          <Transition
            mode="out-in"
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            leave-active-class="transition duration-100 ease-in"
            leave-to-class="opacity-0"
          >
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </main>

    <!-- Navegación inferior móvil -->
    <nav class="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/70 bg-white/95 backdrop-blur lg:hidden">
      <div class="mx-auto flex max-w-md justify-around px-2 py-2">
        <RouterLink
          v-for="item in items"
          :key="item.name"
          :to="{ name: item.name }"
          class="flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium text-ink-400"
          active-class="!text-brand-600"
        >
          <component :is="item.icon" class="h-5 w-5" />
          {{ item.label }}
        </RouterLink>
      </div>
    </nav>
  </div>
</template>
