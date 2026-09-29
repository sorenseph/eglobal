<script setup>
import BaseModal from './BaseModal.vue'
import LottieAnimation from './LottieAnimation.vue'
import StatusPill from './StatusPill.vue'
import documentAnimation from '@/assets/lottie/read-the-document.json'
import { formatCurrency } from '@/utils/formatters'

defineProps({
  open: { type: Boolean, default: false },
  transaction: { type: Object, default: null }
})
const emit = defineEmits(['close'])
</script>

<template>
  <BaseModal :open="open && !!transaction" max-width="max-w-lg" @close="emit('close')">
    <div v-if="transaction" class="rounded-t-3xl bg-white p-6 shadow-float sm:rounded-3xl sm:p-8">
      <div class="flex flex-col items-center gap-4 sm:flex-row">
        <div class="h-28 w-28 shrink-0">
          <LottieAnimation :animation="documentAnimation" />
        </div>
        <div class="text-center sm:text-left">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Detalle del comprobante</p>
          <p class="mt-1 text-3xl font-extrabold tracking-tight">{{ formatCurrency(transaction.monto) }}</p>
          <div class="mt-2"><StatusPill :status="transaction.estatus" /></div>
        </div>
      </div>

      <dl class="mt-6 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-canvas font-mono text-sm">
        <div class="flex justify-between gap-4 px-4 py-3">
          <dt class="font-sans text-ink-600">ID de transacción</dt>
          <dd class="font-semibold">{{ transaction.id }}</dd>
        </div>
        <div class="flex justify-between gap-4 px-4 py-3">
          <dt class="font-sans text-ink-600">No. de aprobación</dt>
          <dd class="font-semibold">{{ transaction.numeroAprobacion }}</dd>
        </div>
        <div class="flex justify-between gap-4 px-4 py-3">
          <dt class="font-sans text-ink-600">Ref. financiera</dt>
          <dd class="font-semibold">{{ transaction.referencia }}</dd>
        </div>
        <div class="flex justify-between gap-4 px-4 py-3">
          <dt class="font-sans text-ink-600">Tarjeta</dt>
          <dd class="font-semibold">{{ transaction.tarjeta }}</dd>
        </div>
      </dl>

      <button type="button" class="btn-primary mt-6 w-full" @click="emit('close')">Cerrar</button>
    </div>
  </BaseModal>
</template>
