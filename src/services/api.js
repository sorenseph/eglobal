import axios from 'axios'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://mock.apidog.com/m1/1388539-1395274-default'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
})

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const toast = useToast()

    if (status === 401) {
      toast.error('Tu sesión expiró o no es válida. Inicia sesión nuevamente.')
      useAuthStore().logout()
      router.push({ name: 'login' })
    } else if (status === 403) {
      toast.error('Acceso no autorizado para tu rol.')
    }

    return Promise.reject(error)
  }
)

/**
 * Ejecuta la petición y devuelve `response.data`.
 * Si no hay respuesta del servidor (red caída, timeout) devuelve `{}` para que el
 * servicio use su respuesta local. Los errores HTTP (401, 403, 500...) sí se propagan.
 */
export async function requestData(request) {
  try {
    const response = await request()
    return response.data ?? {}
  } catch (error) {
    if (error.response) throw error
    return {}
  }
}

export default api
