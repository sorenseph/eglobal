import { maskCard, randomDigits } from '@/utils/formatters'

// El mock de Apidog puede devolver datos aleatorios o cuerpos vacíos.
// Estas funciones generan respuestas con la forma exacta del contrato OpenAPI.

export const buildVentaResponse = (payload) => ({
  numeroAprobacion: randomDigits(6),
  numeroReferenciaFinanciera: randomDigits(8),
  tarjetaEnmascarada: maskCard(payload.numeroTarjeta),
  estatus: 'Aprobada'
})

export const buildCancelacionResponse = (payload) => ({
  numeroAprobacion: randomDigits(6),
  numeroReferenciaFinanciera: payload.numeroReferenciaFinanciera,
  tarjetaEnmascarada: maskCard(payload.numeroTarjeta),
  estatusAplicado: `${payload.tipoOperacion} Exitosa`
})

export const DEFAULT_TRANSACCIONES = [
  { id: 1, numeroAprobacion: '100001', referencia: '11112222', tarjeta: '4152*****1111', monto: 250.0, estatus: 'Aprobada' },
  { id: 2, numeroAprobacion: '100002', referencia: '11112223', tarjeta: '5520*****2222', monto: 120.5, estatus: 'Aprobada' },
  { id: 3, numeroAprobacion: '100003', referencia: '11112224', tarjeta: '4000*****3333', monto: 80.0, estatus: 'Aprobada' },
  { id: 4, numeroAprobacion: '100004', referencia: '11112225', tarjeta: '3711*****4444', monto: 999.9, estatus: 'Aprobada' },
  { id: 5, numeroAprobacion: '100005', referencia: '11112226', tarjeta: '4152*****5555', monto: 430.0, estatus: 'Aprobada' },
  { id: 6, numeroAprobacion: '100006', referencia: '11112227', tarjeta: '5200*****6666', monto: 1500.0, estatus: 'Aprobada' },
  { id: 7, numeroAprobacion: '100007', referencia: '11112228', tarjeta: '4152*****7777', monto: 60.0, estatus: 'Aprobada' },
  { id: 8, numeroAprobacion: '100008', referencia: '11112229', tarjeta: '4000*****8888', monto: 310.2, estatus: 'Aprobada' },
  { id: 9, numeroAprobacion: '100009', referencia: '11112230', tarjeta: '5520*****9999', monto: 75.0, estatus: 'Aprobada' },
  { id: 10, numeroAprobacion: '100010', referencia: '11112231', tarjeta: '4152*****0000', monto: 500.0, estatus: 'Aprobada' }
]
