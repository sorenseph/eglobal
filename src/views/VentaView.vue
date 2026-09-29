<script setup>
import { computed, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { CalendarDays, CreditCard, DollarSign, Loader2, LockKeyhole, ShieldCheck, UserRound } from 'lucide-vue-next'
import FormField from '@/components/FormField.vue'
import LottieAnimation from '@/components/LottieAnimation.vue'
import PageHeader from '@/components/PageHeader.vue'
import VoucherModal from '@/components/VoucherModal.vue'
import checkoutAnimation from '@/assets/lottie/easy-checkout.json'
import { procesarVenta } from '@/services/operadorService'
import { useActivityStore } from '@/stores/activity'
import { useAuthStore } from '@/stores/auth'
import {
  cvvLength,
  formatCardInput,
  formatCurrency,
  formatExpiryInput,
  onlyDigits,
  onlyLetters,
  sanitizeAmount,
  sanitizeEvent
} from '@/utils/formatters'
import {
  validateCvv,
  validateExpiracion,
  validateImporte,
  validateNombre,
  validateTarjeta
} from '@/utils/validators'

const toast = useToast()
const auth = useAuthStore()
const activity = useActivityStore()

// ---------- Estado del formulario ----------

const initialForm = () => ({ importe: '', nombrePersona: '', numeroTarjeta: '', fechaExpiracion: '', cvv: '' })
const form = reactive(initialForm())
const errors = reactive({})
const loading = ref(false)
const voucher = ref(null)
const showVoucher = ref(false)

// ---------- Validación ----------

const validators = {
  importe: validateImporte,
  nombrePersona: validateNombre,
  numeroTarjeta: validateTarjeta,
  fechaExpiracion: validateExpiracion,
  cvv: validateCvv
}

const importePreview = computed(() => formatCurrency(form.importe))

function validateField(field) {
  errors[field] = validators[field](form[field], form.numeroTarjeta)
}

function validateAll() {
  Object.keys(validators).forEach(validateField)
  return Object.values(errors).every((e) => !e)
}

// ---------- Limpieza de inputs (solo números / solo letras) ----------

const maxCvv = computed(() => cvvLength(form.numeroTarjeta))

const onImporteInput = (e) => (form.importe = sanitizeEvent(e, sanitizeAmount))
const onNombreInput = (e) => (form.nombrePersona = sanitizeEvent(e, (v) => onlyLetters(v).slice(0, 50)))
const onCardInput = (e) => {
  form.numeroTarjeta = sanitizeEvent(e, formatCardInput)
  form.cvv = form.cvv.slice(0, maxCvv.value)
}
const onExpiryInput = (e) => (form.fechaExpiracion = sanitizeEvent(e, formatExpiryInput))
const onCvvInput = (e) => (form.cvv = sanitizeEvent(e, (v) => onlyDigits(v).slice(0, maxCvv.value)))

// ---------- Envío ----------

async function submit() {
  if (!validateAll()) {
    toast.warning('Revisa los campos marcados antes de continuar.')
    return
  }

  const payload = {
    importe: Number(Number(form.importe).toFixed(2)),
    nombrePersona: form.nombrePersona.trim(),
    numeroTarjeta: onlyDigits(form.numeroTarjeta),
    fechaExpiracion: form.fechaExpiracion,
    cvv: form.cvv
  }

  loading.value = true
  try {
    const result = await procesarVenta(payload)
    voucher.value = { ...result, importe: payload.importe, nombrePersona: payload.nombrePersona, fecha: new Date() }
    showVoucher.value = true

    activity.add({
      role: auth.role,
      tipo: 'Venta',
      monto: payload.importe,
      tarjeta: result.tarjetaEnmascarada,
      referencia: result.numeroReferenciaFinanciera,
      aprobacion: result.numeroAprobacion,
      estatus: result.estatus
    })
    toast.success(`Venta aprobada · Autorización ${result.numeroAprobacion}`)
  } catch (error) {
    // 401 y 403 ya muestran su propio mensaje desde el interceptor de Axios
    if (![401, 403].includes(error.response?.status)) {
      toast.error('La venta no pudo procesarse. Intenta nuevamente.')
    }
  } finally {
    loading.value = false
  }
}

function closeVoucher() {
  showVoucher.value = false
  Object.assign(form, initialForm())
  Object.keys(errors).forEach((k) => (errors[k] = ''))
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader
      eyebrow="Operador · Cobro rápido"
      title="Nueva venta"
      description="Captura los datos de la tarjeta para procesar el cobro. Al aprobarse se generará el comprobante."
    />

    <div class="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <form class="card space-y-5 p-6 sm:p-8" novalidate @submit.prevent="submit">
        <FormField id="importe" label="Importe" :icon="DollarSign" :error="errors.importe">
          <template #default="{ inputClass }">
            <input
              id="importe"
              :value="form.importe"
              type="text"
              inputmode="decimal"
              maxlength="9"
              placeholder="0.00"
              @input="onImporteInput"
              :class="[inputClass, 'text-lg font-semibold']"
              @blur="validateField('importe')"
            />
          </template>
        </FormField>

        <FormField id="nombre" label="Nombre del titular" :icon="UserRound" :error="errors.nombrePersona">
          <template #default="{ inputClass }">
            <input
              id="nombre"
              :value="form.nombrePersona"
              type="text"
              autocomplete="cc-name"
              maxlength="50"
              placeholder="Como aparece en la tarjeta"
              :class="inputClass"
              @input="onNombreInput"
              @blur="validateField('nombrePersona')"
            />
          </template>
        </FormField>

        <FormField id="tarjeta" label="Número de tarjeta" :icon="CreditCard" :error="errors.numeroTarjeta">
          <template #default="{ inputClass }">
            <input
              id="tarjeta"
              :value="form.numeroTarjeta"
              type="text"
              inputmode="numeric"
              autocomplete="cc-number"
              maxlength="19"
              placeholder="1234 5678 1234 1234"
              :class="[inputClass, 'font-mono tracking-wider']"
              @input="onCardInput"
              @blur="validateField('numeroTarjeta')"
            />
          </template>
        </FormField>

        <div class="grid grid-cols-2 gap-4">
          <FormField id="expiracion" label="Expiración" :icon="CalendarDays" :error="errors.fechaExpiracion">
            <template #default="{ inputClass }">
              <input
                id="expiracion"
                :value="form.fechaExpiracion"
                type="text"
                inputmode="numeric"
                autocomplete="cc-exp"
                maxlength="5"
                placeholder="MM/AA"
                :class="[inputClass, 'font-mono']"
                @input="onExpiryInput"
                @blur="validateField('fechaExpiracion')"
              />
            </template>
          </FormField>
          <FormField id="cvv" label="CVV" :icon="LockKeyhole" :error="errors.cvv">
            <template #default="{ inputClass }">
              <input
                id="cvv"
                :value="form.cvv"
                type="password"
                inputmode="numeric"
                autocomplete="cc-csc"
                :maxlength="maxCvv"
                :placeholder="'•'.repeat(maxCvv)"
                :class="[inputClass, 'font-mono']"
                @input="onCvvInput"
                @blur="validateField('cvv')"
              />
            </template>
          </FormField>
        </div>

        <div class="flex items-center justify-between rounded-xl bg-canvas px-4 py-3">
          <span class="text-sm text-ink-600">Total a cobrar</span>
          <span class="text-xl font-bold">{{ importePreview }}</span>
        </div>

        <button type="submit" class="btn-primary w-full !py-3.5" :disabled="loading">
          <Loader2 v-if="loading" class="h-4 w-4 animate-spin" />
          {{ loading ? 'Procesando pago…' : `Cobrar ${importePreview}` }}
        </button>

        <p class="flex items-center justify-center gap-1.5 text-xs text-ink-400">
          <ShieldCheck class="h-3.5 w-3.5 text-brand-600" /> Transacción cifrada de extremo a extremo
        </p>
      </form>

      <aside class="card flex flex-col items-center justify-center p-6">
        <div class="w-full max-w-sm">
          <LottieAnimation :animation="checkoutAnimation" />
        </div>
        <div class="mt-2 text-center">
          <h3 class="font-semibold">Cobro rápido</h3>
          <p class="mt-1 text-sm text-ink-600">Al aprobarse la venta se genera el comprobante con su número de aprobación.</p>
        </div>
      </aside>
    </div>

    <VoucherModal :open="showVoucher" :voucher="voucher" @close="closeVoucher" />
  </div>
</template>
