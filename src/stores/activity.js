import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'eglobal.activity'

/** Historial local de operaciones (ventas, cancelaciones y devoluciones) para mostrar en el Dashboard. */
export const useActivityStore = defineStore('activity', () => {
  const items = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

  function add(entry) {
    items.value = [{ id: Date.now(), fecha: new Date().toISOString(), ...entry }, ...items.value].slice(0, 20)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  function byRole(role) {
    return items.value.filter((item) => item.role === role)
  }

  return { items, add, byRole }
})
