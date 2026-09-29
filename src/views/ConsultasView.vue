<script setup>
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import {
  ArrowDownUp,
  ChevronRight,
  Hash,
  ListChecks,
  RefreshCw,
  Search,
  SearchX,
  TrendingUp,
  Wallet
} from 'lucide-vue-next'
import LottieAnimation from '@/components/LottieAnimation.vue'
import accountantAnimation from '@/assets/lottie/female-accountant.json'
import PageHeader from '@/components/PageHeader.vue'
import StatCard from '@/components/StatCard.vue'
import StatusPill from '@/components/StatusPill.vue'
import TransactionDetailModal from '@/components/TransactionDetailModal.vue'
import { obtenerConsultas } from '@/services/operadorService'
import { formatCurrency } from '@/utils/formatters'

const toast = useToast()
const transacciones = ref([])
const loading = ref(false)
const search = ref('')
const sortKey = ref('id')
const sortDir = ref('asc')
const selected = ref(null)

const columns = [
  { key: 'id', label: '#', sortable: true },
  { key: 'numeroAprobacion', label: 'Aprobación', sortable: true },
  { key: 'referencia', label: 'Referencia', sortable: true },
  { key: 'tarjeta', label: 'Tarjeta', sortable: false },
  { key: 'monto', label: 'Monto', sortable: true, align: 'right' },
  { key: 'estatus', label: 'Estatus', sortable: false }
]

async function load() {
  loading.value = true
  try {
    transacciones.value = await obtenerConsultas()
  } catch (error) {
    if (![401, 403].includes(error.response?.status)) {
      toast.error('No fue posible obtener las transacciones.')
    }
  } finally {
    loading.value = false
  }
}

onMounted(load)

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = key === 'monto' ? 'desc' : 'asc'
  }
}

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  const list = term
    ? transacciones.value.filter((t) =>
        [t.numeroAprobacion, t.referencia, t.tarjeta, String(t.monto)].some((v) =>
          String(v).toLowerCase().includes(term)
        )
      )
    : [...transacciones.value]

  const dir = sortDir.value === 'asc' ? 1 : -1
  return list.sort((a, b) => {
    const x = a[sortKey.value]
    const y = b[sortKey.value]
    return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y))) * dir
  })
})

const total = computed(() => transacciones.value.reduce((s, t) => s + Number(t.monto), 0))
const promedio = computed(() => (transacciones.value.length ? total.value / transacciones.value.length : 0))
</script>

<template>
  <div class="space-y-8">
    <PageHeader
      eyebrow="Operador · Historial"
      title="Consulta de transacciones"
      description="Listado de transacciones aprobadas. Selecciona una fila para ver el detalle del comprobante."
    >
      <template #actions>
        <button type="button" class="btn-secondary" :disabled="loading" @click="load">
          <RefreshCw :class="['h-4 w-4', loading && 'animate-spin']" /> Actualizar
        </button>
      </template>
    </PageHeader>

    <section class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div class="grid gap-4 sm:grid-cols-3">
        <StatCard label="Transacciones" :value="transacciones.length" hint="Aprobadas" :icon="ListChecks" accent />
        <StatCard label="Monto total" :value="formatCurrency(total)" hint="Suma de operaciones" :icon="Wallet" />
        <StatCard label="Ticket promedio" :value="formatCurrency(promedio)" hint="Por transacción" :icon="TrendingUp" />
      </div>
      <div class="card hidden items-center justify-center overflow-hidden p-2 lg:flex">
        <div class="h-32 w-full">
          <LottieAnimation :animation="accountantAnimation" />
        </div>
      </div>
    </section>

    <section class="card overflow-hidden">
      <div class="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div class="relative w-full sm:max-w-xs">
          <Search class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            v-model="search"
            type="search"
            maxlength="20"
            placeholder="Buscar aprobación, referencia, tarjeta…"
            class="form-input !py-2.5 pl-10"
            aria-label="Buscar transacciones"
          />
        </div>
        <p class="text-xs text-ink-400">
          Mostrando <span class="font-semibold text-ink">{{ filtered.length }}</span> de {{ transacciones.length }} registros
        </p>
      </div>

      <!-- Skeleton -->
      <div v-if="loading && !transacciones.length" class="space-y-3 p-5">
        <div v-for="n in 6" :key="n" class="h-12 animate-pulse rounded-xl bg-canvas-200" />
      </div>

      <template v-else-if="filtered.length">
        <!-- Tabla escritorio -->
        <div class="hidden overflow-x-auto md:block">
          <table class="w-full text-left text-sm">
            <thead class="bg-canvas text-xs uppercase tracking-wide text-ink-600">
              <tr>
                <th
                  v-for="col in columns"
                  :key="col.key"
                  scope="col"
                  :class="['px-5 py-3 font-semibold', col.align === 'right' && 'text-right']"
                >
                  <button
                    v-if="col.sortable"
                    type="button"
                    :class="[
                      'inline-flex items-center gap-1 uppercase transition hover:text-brand-600',
                      sortKey === col.key && 'text-brand-600'
                    ]"
                    @click="toggleSort(col.key)"
                  >
                    {{ col.label }} <ArrowDownUp class="h-3 w-3" />
                  </button>
                  <span v-else>{{ col.label }}</span>
                </th>
                <th class="px-5 py-3"><span class="sr-only">Detalle</span></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="t in filtered"
                :key="t.id"
                class="group cursor-pointer transition hover:bg-brand-50/50"
                tabindex="0"
                @click="selected = t"
                @keydown.enter="selected = t"
              >
                <td class="px-5 py-4 text-ink-400">{{ t.id }}</td>
                <td class="px-5 py-4 font-mono font-semibold">{{ t.numeroAprobacion }}</td>
                <td class="px-5 py-4 font-mono text-ink-600">{{ t.referencia }}</td>
                <td class="px-5 py-4 font-mono text-ink-600">{{ t.tarjeta }}</td>
                <td class="px-5 py-4 text-right font-semibold">{{ formatCurrency(t.monto) }}</td>
                <td class="px-5 py-4"><StatusPill :status="t.estatus" /></td>
                <td class="px-5 py-4 text-right">
                  <ChevronRight class="ml-auto h-4 w-4 text-ink-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tarjetas móvil -->
        <ul class="divide-y divide-slate-100 md:hidden">
          <li v-for="t in filtered" :key="t.id">
            <button type="button" class="flex w-full items-center gap-3 p-4 text-left active:bg-canvas" @click="selected = t">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Hash class="h-4 w-4" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-mono text-sm font-semibold">{{ t.tarjeta }}</p>
                <p class="text-xs text-ink-400">Aprob. {{ t.numeroAprobacion }} · Ref. {{ t.referencia }}</p>
              </div>
              <div class="flex flex-col items-end gap-1">
                <span class="text-sm font-bold">{{ formatCurrency(t.monto) }}</span>
                <StatusPill :status="t.estatus" />
              </div>
            </button>
          </li>
        </ul>
      </template>

      <div v-else class="flex flex-col items-center py-14 text-center">
        <SearchX class="h-8 w-8 text-ink-400" />
        <p class="mt-2 text-sm font-medium text-ink-600">Sin resultados para "{{ search }}"</p>
        <button type="button" class="btn-ghost mt-2 !py-2" @click="search = ''">Limpiar búsqueda</button>
      </div>
    </section>

    <TransactionDetailModal :open="!!selected" :transaction="selected" @close="selected = null" />
  </div>
</template>
