import api, { requestData } from './api'
import { buildVentaResponse, DEFAULT_TRANSACCIONES } from './mockFallback'

/** POST /operador/venta */
export async function procesarVenta(venta) {
  const data = await requestData(() => api.post('/operador/venta', venta))

  const esValida = /^\d{6}$/.test(data.numeroAprobacion) && /^\d{8}$/.test(data.numeroReferenciaFinanciera)
  return esValida ? data : buildVentaResponse(venta)
}

/** GET /operador/consultas */
export async function obtenerConsultas() {
  const data = await requestData(() => api.get('/operador/consultas'))

  const lista = data.transacciones
  const esValida = Array.isArray(lista) && lista.length >= 10 && lista.every((t) => t.numeroAprobacion && t.monto)
  return esValida ? lista : DEFAULT_TRANSACCIONES
}
