import { cvvLength, detectCardBrand, onlyDigits } from './formatters'

export function validateImporte(value) {
  const text = String(value ?? '')
  if (!/^\d{1,6}(\.\d{1,2})?$/.test(text)) return 'Ingresa un importe válido (máx. 2 decimales).'
  const amount = Number(text)
  if (amount <= 0) return 'El importe debe ser mayor a 0.'
  if (amount > 999999.99) return 'El importe excede el límite permitido.'
  return ''
}

export function validateNombre(value = '') {
  const name = value.trim()
  if (!name) return 'El nombre es obligatorio.'
  if (!/^[\p{L}\s]+$/u.test(name)) return 'El nombre solo puede contener letras.'
  if (name.length < 3) return 'Ingresa el nombre completo.'
  if (!name.includes(' ')) return 'Ingresa nombre y apellido.'
  return ''
}

export function validateTarjeta(value = '') {
  const digits = onlyDigits(value)
  if (!digits) return 'El número de tarjeta es obligatorio.'
  const expected = detectCardBrand(digits) === 'Amex' ? 15 : 16
  if (digits.length !== expected) return `La tarjeta debe tener ${expected} dígitos.`
  return ''
}

export function validateExpiracion(value = '') {
  const match = /^(\d{2})\/(\d{2})$/.exec(value)
  if (!match) return 'Usa el formato MM/AA.'
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  if (month < 1 || month > 12) return 'Mes inválido.'
  const now = new Date()
  const endOfMonth = new Date(year, month, 0, 23, 59, 59)
  if (endOfMonth < now) return 'La tarjeta está vencida.'
  if (year > now.getFullYear() + 20) return 'Año de expiración inválido.'
  return ''
}

export function validateCvv(value = '', cardNumber = '') {
  const expected = cvvLength(cardNumber)
  if (!new RegExp(`^\\d{${expected}}$`).test(value)) return `El CVV debe tener ${expected} dígitos.`
  return ''
}

export function validateReferencia(value = '') {
  if (!/^\d{8}$/.test(value)) return 'La referencia debe tener exactamente 8 dígitos.'
  return ''
}
