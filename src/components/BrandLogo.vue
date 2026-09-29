<script setup>
defineProps({
  size: { type: String, default: 'h-8' }
})
</script>

<template>
  <img
    src="/e-global.svg"
    alt="e-global"
    width="650"
    height="180"
    :class="[size, 'w-auto max-w-full object-contain select-none']"
    draggable="false"
  />
</template>
