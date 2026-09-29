<script setup>
import { computed } from 'vue'
import { ArrowUpRight, BadgeCheck, Inbox, RotateCcw, Undo2, Wallet } from 'lucide-vue-next'
import LottieAnimation from '@/components/LottieAnimation.vue'
import StatCard from '@/components/StatCard.vue'
import StatusPill from '@/components/StatusPill.vue'
import checkoutAnimation from '@/assets/lottie/easy-checkout.json'
import accountantAnimation from '@/assets/lottie/female-accountant.json'
import researchersAnimation from '@/assets/lottie/researchers.json'
import { useActivityStore } from '@/stores/activity'
import { useAuthStore } from '@/stores/auth'
import { formatCurrency, formatDateTime } from '@/utils/formatters'

const auth = useAuthStore()
const activity = useActivityStore()

// Operaciones que el usuario ha realizado en esta sesión
const myActivity = computed(() => activity.byRole(auth.role))

const stats = computed(() => {
  const count = (tipo) => myActivity.value.filter((item) => item.tipo === tipo).length

  if (auth.isOperador) {
    const total = myActivity.value.reduce((sum, item) => sum + Number(item.monto || 0), 0)
    return [
      { label: 'Ventas realizadas', value: count('Venta'), icon: BadgeCheck, accent: true },
      { label: 'Monto cobrado', value: formatCurrency(total), icon: Wallet }
    ]
  }

  return [
    { label: 'Cancelaciones', value: count('Cancelación'), icon: RotateCcw, accent: true },
    { label: 'Devoluciones', value: count('Devolución'), icon: Undo2 }
  ]
})

const shortcuts = computed(() =>
  auth.isOperador
    ? [
        { to: 'venta', title: 'Nueva venta', description: 'Cobra con tarjeta y genera el comprobante.', animation: checkoutAnimation },
        { to: 'consultas', title: 'Consultas', description: 'Revisa las transacciones aprobadas.', animation: accountantAnimation }
      ]
    : [
        {
          to: 'cancelaciones',
          title: 'Cancelaciones y devoluciones',
          description: 'Aplica reversos usando la referencia financiera.',
          animation: researchersAnimation
        }
      ]
)
</script>

<template>
  <div class="space-y-8">
    <section class="card p-6 sm:p-8">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Panel {{ auth.role }}</p>
      <h1 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Bienvenido, {{ auth.displayName.split('@')[0] }}</h1>
      <p class="mt-2 max-w-xl text-sm text-ink-600">
        Millones de veces al día, E-Global procesa tus transacciones electrónicas simplificando tu vida.
      </p>
    </section>

    <section class="grid gap-4 sm:grid-cols-2">
      <StatCard v-for="s in stats" :key="s.label" v-bind="s" />
    </section>

    <section>
      <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-600">Accesos rápidos</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <RouterLink
          v-for="item in shortcuts"
          :key="item.to"
          :to="{ name: item.to }"
          class="card group flex items-center gap-4 p-5 transition hover:border-brand-200 hover:shadow-float"
        >
          <div class="h-24 w-24 shrink-0">
            <LottieAnimation :animation="item.animation" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold">{{ item.title }}</h3>
            <p class="mt-1 text-sm text-ink-600">{{ item.description }}</p>
          </div>
          <ArrowUpRight class="h-5 w-5 shrink-0 text-ink-400 group-hover:text-brand-600" />
        </RouterLink>
      </div>
    </section>

    <section class="card p-6">
      <h2 class="font-semibold">Actividad reciente</h2>
      <p class="text-xs text-ink-400">Operaciones registradas en esta sesión</p>

      <ul v-if="myActivity.length" class="mt-4 divide-y divide-slate-100">
        <li v-for="item in myActivity.slice(0, 5)" :key="item.id" class="flex items-center justify-between gap-3 py-3">
          <div class="min-w-0">
            <p class="truncate text-sm font-medium">
              {{ item.tipo }} · <span class="font-mono text-ink-600">{{ item.tarjeta }}</span>
            </p>
            <p class="text-xs text-ink-400">Ref. {{ item.referencia }} · {{ formatDateTime(item.fecha) }}</p>
          </div>
          <div class="flex shrink-0 flex-col items-end gap-1">
            <span v-if="item.monto" class="text-sm font-semibold">{{ formatCurrency(item.monto) }}</span>
            <StatusPill :status="item.estatus" />
          </div>
        </li>
      </ul>
      <div v-else class="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-slate-200 py-10 text-center">
        <Inbox class="h-8 w-8 text-ink-400" />
        <p class="mt-2 text-sm font-medium text-ink-600">Aún no hay operaciones</p>
      </div>
    </section>
  </div>
</template>
