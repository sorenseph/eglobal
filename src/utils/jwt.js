export const ROLES = Object.freeze({
  SUPERVISOR: 'Supervisor',
  OPERADOR: 'Operador'
})

export const PREDEFINED_TOKENS = Object.freeze({
  [ROLES.SUPERVISOR]:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3OTA2MzU4NDcsImV4cCI6MTgyMjE3MTg1NSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIlJvbGUiOiJTdXBlcnZpc29yIn0.mB24ithmxy7I4bWElUBFVZ2P-WC8-iWEdQ-zWnFIyTE',
  [ROLES.OPERADOR]:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3OTA2MzU4NDcsImV4cCI6MTgyMjE3MTg1NSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIlJvbGUiOiJPcGVyYWRvciJ9.G_SOGO1QXCP6el_Q1tnSfGz2zyYaMLLlBpoBWnRjveg'
})

function base64UrlDecode(segment) {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function decodeJwt(token) {
  if (typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    return JSON.parse(base64UrlDecode(parts[1]))
  } catch {
    return null
  }
}

export function getRoleFromToken(token) {
  const role = decodeJwt(token)?.Role
  return Object.values(ROLES).includes(role) ? role : null
}

export function isTokenExpired(token) {
  const exp = decodeJwt(token)?.exp
  if (!exp) return false
  return Date.now() >= exp * 1000
}
