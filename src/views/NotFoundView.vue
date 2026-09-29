<script setup>
import { ArrowLeft } from 'lucide-vue-next'
import BrandLogo from '@/components/BrandLogo.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
    <BrandLogo size="h-8" />
    <p class="mt-10 text-7xl font-extrabold tracking-tight text-brand-600">404</p>
    <h1 class="mt-2 text-xl font-bold">Página no encontrada</h1>
    <p class="mt-2 max-w-sm text-sm text-ink-600">La ruta que buscas no existe o fue movida.</p>
    <RouterLink :to="{ name: 'dashboard' }" class="btn-primary mt-8">
      <ArrowLeft class="h-4 w-4" /> Volver al inicio
    </RouterLink>
  </div>
</template>
