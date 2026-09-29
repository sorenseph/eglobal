import api, { requestData } from './api'
import { PREDEFINED_TOKENS, getRoleFromToken } from '@/utils/jwt'

/**
 * POST /auth/login
 * Si el mock no devuelve un JWT válido para el rol elegido,
 * se usa el token predefinido de ese rol.
 */
export async function login({ username, password, role }) {
  const data = await requestData(() => api.post('/auth/login', { username, password }))

  const token = getRoleFromToken(data.token) === role ? data.token : PREDEFINED_TOKENS[role]
  return { token, role: getRoleFromToken(token) }
}
