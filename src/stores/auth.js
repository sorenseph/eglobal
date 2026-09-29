import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as authService from '@/services/authService'
import { ROLES, decodeJwt, getRoleFromToken, isTokenExpired } from '@/utils/jwt'

const TOKEN_KEY = 'eglobal.token'
const USER_KEY = 'eglobal.username'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY))
  const username = ref(localStorage.getItem(USER_KEY) || '')
  const loading = ref(false)

  const payload = computed(() => decodeJwt(token.value))
  const role = computed(() => getRoleFromToken(token.value))
  const isAuthenticated = computed(() => !!role.value && !isTokenExpired(token.value))
  const isSupervisor = computed(() => role.value === ROLES.SUPERVISOR)
  const isOperador = computed(() => role.value === ROLES.OPERADOR)
  const displayName = computed(() => username.value || payload.value?.sub || 'Usuario')

  function setSession(newToken, user) {
    token.value = newToken
    username.value = user
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, user)
  }

  async function login(credentials) {
    loading.value = true
    try {
      const result = await authService.login(credentials)
      if (!result.role) throw new Error('El token recibido no contiene un rol válido.')
      setSession(result.token, credentials.username)
      return result
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    username.value = ''
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  function hasRole(roles = []) {
    return roles.length === 0 || roles.includes(role.value)
  }

  return {
    token,
    username,
    loading,
    payload,
    role,
    isAuthenticated,
    isSupervisor,
    isOperador,
    displayName,
    login,
    logout,
    hasRole
  }
})
