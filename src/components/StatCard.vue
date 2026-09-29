<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  hint: { type: String, default: '' },
  icon: { type: [Object, Function], required: true },
  accent: { type: Boolean, default: false }
})
</script>

<template>
  <div class="card flex items-start gap-4 p-5 animate-fade-up">
    <div
      :class="[
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
        accent ? 'bg-brand-600 text-white' : 'bg-canvas-200 text-ink'
      ]"
    >
      <component :is="icon" class="h-5 w-5" />
    </div>
    <div class="min-w-0">
      <p class="text-xs font-medium uppercase tracking-wide text-ink-400">{{ label }}</p>
      <p class="mt-1 truncate text-xl font-bold text-ink">{{ value }}</p>
      <p v-if="hint" class="mt-0.5 text-xs text-ink-600">{{ hint }}</p>
    </div>
  </div>
</template>
