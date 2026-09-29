// ---------- Formato para mostrar ----------

const currencyFormatter = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })

export const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0)

export const formatDateTime = (date) =>
  new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))

/** "1234567812341234" -> "1234*****1234" */
export function maskCard(cardNumber = '') {
  const digits = onlyDigits(cardNumber)
  return `${digits.slice(0, 4)}*****${digits.slice(-4)}`
}

export function detectCardBrand(cardNumber = '') {
  const digits = onlyDigits(cardNumber)
  if (/^4/.test(digits)) return 'Visa'
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'Mastercard'
  if (/^3[47]/.test(digits)) return 'Amex'
  return 'Tarjeta'
}

/** Amex usa CVV de 4 dígitos, el resto de 3. */
export const cvvLength = (cardNumber) => (detectCardBrand(cardNumber) === 'Amex' ? 4 : 3)

/** Número aleatorio de N dígitos que no empieza con 0 (para respuestas simuladas). */
export const randomDigits = (length) =>
  String(Math.floor(10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1)))

// ---------- Limpieza de inputs mientras el usuario escribe ----------

export const onlyDigits = (value = '') => String(value).replace(/\D/g, '')

/** Solo letras (con acentos) y espacios sencillos. */
export const onlyLetters = (value = '') =>
  String(value)
    .replace(/[^\p{L}\s]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trimStart()

/** Importe: solo dígitos y un punto, máximo 6 enteros y 2 decimales. */
export function sanitizeAmount(value = '') {
  const [integer = '', ...decimals] = String(value).replace(/[^\d.]/g, '').split('.')
  const cleanInteger = integer.replace(/^0+(?=\d)/, '').slice(0, 6)
  if (decimals.length === 0) return cleanInteger
  return `${cleanInteger || '0'}.${decimals.join('').slice(0, 2)}`
}

/** "4152567812341234" -> "4152 5678 1234 1234" (15 dígitos si es Amex). */
export function formatCardInput(value = '') {
  const digits = onlyDigits(value)
  const maxLength = /^3[47]/.test(digits) ? 15 : 16
  return digits.slice(0, maxLength).replace(/(\d{4})(?=\d)/g, '$1 ')
}

/** "1228" -> "12/28". Evita meses inválidos: "5" -> "05", no permite "00" ni "13". */
export function formatExpiryInput(value = '') {
  let digits = onlyDigits(value)
  if (/^[2-9]/.test(digits)) digits = `0${digits}`
  if (/^(00|1[3-9])/.test(digits)) digits = digits.slice(0, 1)
  digits = digits.slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

/**
 * Limpia el valor de un evento `input` y lo escribe de vuelta en el campo.
 * Es necesario porque si el valor limpio no cambia, Vue no vuelve a pintar el input
 * y el carácter inválido se quedaría visible.
 */
export function sanitizeEvent(event, sanitizer) {
  const clean = sanitizer(event.target.value)
  event.target.value = clean
  return clean
}
