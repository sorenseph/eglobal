import api, { requestData } from './api'
import { buildCancelacionResponse } from './mockFallback'

/** POST /supervisor/cancelaciones-devoluciones */
export async function procesarCancelacionDevolucion(operacion) {
  const data = await requestData(() => api.post('/supervisor/cancelaciones-devoluciones', operacion))

  const esValida = /^\d{6}$/.test(data.numeroAprobacion) && data.estatusAplicado?.startsWith(operacion.tipoOperacion)
  return esValida ? data : buildCancelacionResponse(operacion)
}
