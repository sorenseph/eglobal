<script setup>
import { Vue3Lottie } from 'vue3-lottie'

defineProps({
  /** JSON de la animación importado desde src/assets/lottie */
  animation: { type: Object, required: true }
})
</script>

<template>
  <div class="flex h-full w-full items-center justify-center overflow-hidden">
    <Vue3Lottie :animation-data="animation" width="100%" height="100%" />
  </div>
</template>
