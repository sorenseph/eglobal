<script setup>
defineProps({
  label: { type: String, required: true },
  id: { type: String, required: true },
  error: { type: String, default: '' },
  icon: { type: [Object, Function], default: null }
})
</script>

<template>
  <div>
    <label :for="id" class="form-label">{{ label }}</label>
    <div class="relative">
      <component
        :is="icon"
        v-if="icon"
        class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
      />
      <slot :input-class="['form-input', icon && 'pl-10', error && 'has-error']" />
    </div>
    <p v-if="error" :id="`${id}-error`" class="form-error">{{ error }}</p>
  </div>
</template>
