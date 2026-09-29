<script setup>
import { onBeforeUnmount, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  open: { type: Boolean, default: false },
  maxWidth: { type: String, default: 'max-w-md' }
})
const emit = defineEmits(['close'])

function onKeydown(event) {
  if (event.key === 'Escape') emit('close')
}

// Bloquea el scroll de la página y habilita "Esc" mientras el modal está abierto
watch(
  () => props.open,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      window.addEventListener('keydown', onKeydown)
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  }
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
        role="dialog"
        aria-modal="true"
        @click.self="emit('close')"
      >
        <div :class="['relative max-h-[92vh] w-full overflow-y-auto overflow-x-hidden animate-fade-up', maxWidth]">
          <button
            type="button"
            class="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-ink-600 shadow-card transition hover:text-ink print:hidden"
            aria-label="Cerrar"
            @click="emit('close')"
          >
            <X class="h-4 w-4" />
          </button>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
