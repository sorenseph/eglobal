<script setup>
import { CheckCircle2, Printer } from 'lucide-vue-next'
import BaseModal from './BaseModal.vue'
import BrandLogo from './BrandLogo.vue'
import { formatCurrency, formatDateTime } from '@/utils/formatters'

defineProps({
  open: { type: Boolean, default: false },
  /** { numeroAprobacion, numeroReferenciaFinanciera, tarjetaEnmascarada, estatus, importe, nombrePersona, fecha } */
  voucher: { type: Object, default: null }
})
const emit = defineEmits(['close'])

const print = () => window.print()
</script>

<template>
  <BaseModal :open="open && !!voucher" max-width="max-w-sm" @close="emit('close')">
    <div v-if="voucher" class="printable px-3 pb-3 sm:px-0 sm:pb-0">
      <article class="relative rounded-t-3xl bg-white px-6 pb-8 pt-8 shadow-float sm:rounded-3xl">
        <div class="flex flex-col items-center text-center">
          <BrandLogo size="h-6" />
          <p class="mt-1 text-[10px] uppercase tracking-[0.2em] text-ink-400">Comprobante de venta</p>

          <div class="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
            <CheckCircle2 class="h-8 w-8 text-brand-600" />
          </div>
          <p class="mt-3 text-sm font-semibold text-brand-600">Transacción {{ voucher.estatus }}</p>
          <p class="mt-1 text-3xl font-extrabold tracking-tight text-ink">{{ formatCurrency(voucher.importe) }}</p>
          <p class="mt-1 text-xs text-ink-400">{{ formatDateTime(voucher.fecha) }}</p>
        </div>

        <div class="relative my-6 border-t-2 border-dashed border-slate-200">
          <span class="absolute -left-9 -top-3 h-6 w-6 rounded-full bg-slate-900/40 sm:bg-slate-500/30" />
          <span class="absolute -right-9 -top-3 h-6 w-6 rounded-full bg-slate-900/40 sm:bg-slate-500/30" />
        </div>

        <dl class="space-y-3 font-mono text-sm">
          <div class="flex justify-between gap-4">
            <dt class="font-sans text-ink-600">No. de aprobación</dt>
            <dd class="font-semibold text-ink">{{ voucher.numeroAprobacion }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="font-sans text-ink-600">Ref. financiera</dt>
            <dd class="font-semibold text-ink">{{ voucher.numeroReferenciaFinanciera }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="font-sans text-ink-600">Tarjeta</dt>
            <dd class="font-semibold text-ink">{{ voucher.tarjetaEnmascarada }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="font-sans text-ink-600">Titular</dt>
            <dd class="truncate font-semibold uppercase text-ink">{{ voucher.nombrePersona }}</dd>
          </div>
        </dl>

        <p class="mt-6 text-center text-[11px] leading-relaxed text-ink-400">
          Pagaré negociable únicamente con instituciones de crédito.<br />
          E-Global · Servicios Electrónicos Globales
        </p>

        <div class="mt-6 grid grid-cols-2 gap-3 print:hidden">
          <button type="button" class="btn-secondary" @click="print">
            <Printer class="h-4 w-4" /> Imprimir
          </button>
          <button type="button" class="btn-primary" @click="emit('close')">Nueva venta</button>
        </div>
      </article>
    </div>
  </BaseModal>
</template>
