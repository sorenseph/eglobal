<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true }
})

const tone = computed(() => {
  const s = props.status.toLowerCase()
  if (s.includes('aprobada') || s.includes('exitosa')) return 'bg-brand-50 text-brand-600 ring-brand-200'
  if (s.includes('cancel')) return 'bg-amber-50 text-amber-700 ring-amber-200'
  if (s.includes('devol')) return 'bg-violet-50 text-violet-700 ring-violet-200'
  if (s.includes('rechaz')) return 'bg-rose-50 text-rose-700 ring-rose-200'
  return 'bg-slate-100 text-ink-600 ring-slate-200'
})
</script>

<template>
  <span :class="['pill ring-1 ring-inset', tone]">
    <span class="relative flex h-1.5 w-1.5">
      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-40" />
      <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
    </span>
    {{ status }}
  </span>
</template>
