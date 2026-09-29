<script setup>
import { computed } from 'vue'
import { Nfc } from 'lucide-vue-next'
import { detectCardBrand, formatCardInput } from '@/utils/formatters'

const props = defineProps({
  number: { type: String, default: '' },
  name: { type: String, default: '' },
  expiry: { type: String, default: '' }
})

const displayNumber = computed(() => {
  const formatted = formatCardInput(props.number)
  const placeholder = '•••• •••• •••• ••••'
  return formatted + placeholder.slice(formatted.length)
})
const brand = computed(() => detectCardBrand(props.number))
</script>

<template>
  <div
    class="relative aspect-[1.586] w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-ink via-ink-800 to-ink p-5 text-white shadow-float sm:p-6"
  >
    <div class="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-600/30 blur-2xl" />
    <div class="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-brand-500/20 blur-2xl" />

    <div class="relative flex h-full flex-col justify-between">
      <div class="flex items-start justify-between">
        <div class="h-8 w-11 rounded-md bg-gradient-to-br from-amber-200 to-amber-400/80" />
        <div class="flex items-center gap-2">
          <Nfc class="h-5 w-5 text-white/70" />
          <span class="text-sm font-semibold tracking-wide">{{ brand }}</span>
        </div>
      </div>

      <p class="font-mono text-lg tracking-[0.12em] sm:text-xl">{{ displayNumber }}</p>

      <div class="flex items-end justify-between gap-4 text-xs">
        <div class="min-w-0">
          <p class="text-[10px] uppercase tracking-widest text-white/50">Titular</p>
          <p class="truncate font-semibold uppercase tracking-wide">{{ name || 'Nombre del titular' }}</p>
        </div>
        <div class="shrink-0 text-right">
          <p class="text-[10px] uppercase tracking-widest text-white/50">Expira</p>
          <p class="font-mono font-semibold">{{ expiry || 'MM/AA' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
