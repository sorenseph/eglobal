<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' }
})
</script>

<template>
  <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p v-if="eyebrow" class="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
        {{ eyebrow }}
      </p>
      <h1 class="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{{ title }}</h1>
      <p v-if="description" class="mt-1.5 max-w-2xl text-sm text-ink-600">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="flex shrink-0 gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>
