<script setup>
import { reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { AlertTriangle, BadgeCheck, CreditCard, FileDigit, Loader2, RotateCcw, Undo2 } from 'lucide-vue-next'
import FormField from '@/components/FormField.vue'
import LottieAnimation from '@/components/LottieAnimation.vue'
import researchersAnimation from '@/assets/lottie/researchers.json'
import PageHeader from '@/components/PageHeader.vue'
import StatusPill from '@/components/StatusPill.vue'
import { procesarCancelacionDevolucion } from '@/services/supervisorService'
import { useActivityStore } from '@/stores/activity'
import { useAuthStore } from '@/stores/auth'
import { formatCardInput, formatDateTime, onlyDigits, sanitizeEvent } from '@/utils/formatters'
import { validateReferencia, validateTarjeta } from '@/utils/validators'

const toast = useToast()
const auth = useAuthStore()
const activity = useActivityStore()

const tipos = [
  { value: 'Cancelación', label: 'Cancelación', hint: 'Mismo día, antes del cierre', icon: RotateCcw },
  { value: 'Devolución', label: 'Devolución', hint: 'Posterior al cierre de lote', icon: Undo2 }
]

const form = reactive({ numeroReferenciaFinanciera: '', numeroTarjeta: '', tipoOperacion: 'Cancelación' })
const errors = reactive({ numeroReferenciaFinanciera: '', numeroTarjeta: '' })
const loading = ref(false)
const result = ref(null)

const onRefInput = (e) =>
  (form.numeroReferenciaFinanciera = sanitizeEvent(e, (v) => onlyDigits(v).slice(0, 8)))
const onCardInput = (e) => (form.numeroTarjeta = sanitizeEvent(e, formatCardInput))

function validate() {
  errors.numeroReferenciaFinanciera = validateReferencia(form.numeroReferenciaFinanciera)
  errors.numeroTarjeta = validateTarjeta(form.numeroTarjeta)
  return !errors.numeroReferenciaFinanciera && !errors.numeroTarjeta
}

async function submit() {
  if (!validate()) {
    toast.warning('Revisa los campos marcados antes de continuar.')
    return
  }

  const payload = {
    numeroReferenciaFinanciera: form.numeroReferenciaFinanciera,
    numeroTarjeta: onlyDigits(form.numeroTarjeta),
    tipoOperacion: form.tipoOperacion
  }

  loading.value = true
  try {
    const response = await procesarCancelacionDevolucion(payload)
    result.value = { ...response, tipoOperacion: payload.tipoOperacion, fecha: new Date() }
    activity.add({
      role: auth.role,
      tipo: payload.tipoOperacion,
      tarjeta: response.tarjetaEnmascarada,
      referencia: response.numeroReferenciaFinanciera,
      aprobacion: response.numeroAprobacion,
      estatus: response.estatusAplicado
    })
    toast.success(`${response.estatusAplicado} · Aprobación ${response.numeroAprobacion}`)
  } catch (error) {
    if (![401, 403].includes(error.response?.status)) {
      toast.error('No fue posible aplicar la operación. Intenta nuevamente.')
    }
  } finally {
    loading.value = false
  }
}

function reset() {
  result.value = null
  Object.assign(form, { numeroReferenciaFinanciera: '', numeroTarjeta: '', tipoOperacion: 'Cancelación' })
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader
      eyebrow="Supervisor · Reversos"
      title="Cancelaciones y devoluciones"
      description="Aplica una cancelación o devolución sobre una transacción existente usando su referencia financiera."
    />

    <div class="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <div class="card p-6 sm:p-8">
        <!-- Resultado -->
        <div v-if="result" class="animate-fade-up">
          <div class="flex flex-col items-center text-center">
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
              <BadgeCheck class="h-9 w-9 text-brand-600" />
            </div>
            <h2 class="mt-4 text-xl font-bold">Operación aplicada</h2>
            <p class="mt-1 text-sm text-ink-600">{{ formatDateTime(result.fecha) }}</p>
            <div class="mt-3"><StatusPill :status="result.estatusAplicado" /></div>
          </div>

          <dl class="mt-8 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-canvas font-mono text-sm">
            <div class="flex justify-between gap-4 px-4 py-3">
              <dt class="font-sans text-ink-600">No. de aprobación</dt>
              <dd class="font-semibold">{{ result.numeroAprobacion }}</dd>
            </div>
            <div class="flex justify-between gap-4 px-4 py-3">
              <dt class="font-sans text-ink-600">Ref. financiera</dt>
              <dd class="font-semibold">{{ result.numeroReferenciaFinanciera }}</dd>
            </div>
            <div class="flex justify-between gap-4 px-4 py-3">
              <dt class="font-sans text-ink-600">Tarjeta</dt>
              <dd class="font-semibold">{{ result.tarjetaEnmascarada }}</dd>
            </div>
            <div class="flex justify-between gap-4 px-4 py-3">
              <dt class="font-sans text-ink-600">Estatus aplicado</dt>
              <dd class="font-semibold text-brand-600">{{ result.estatusAplicado }}</dd>
            </div>
          </dl>

          <button type="button" class="btn-primary mt-6 w-full" @click="reset">Nueva operación</button>
        </div>

        <!-- Formulario -->
        <form v-else class="space-y-5" novalidate @submit.prevent="submit">
          <fieldset>
            <legend class="form-label">Tipo de operación</legend>
            <div class="grid grid-cols-2 gap-3" role="radiogroup">
              <label
                v-for="t in tipos"
                :key="t.value"
                :class="[
                  'flex cursor-pointer flex-col gap-1.5 rounded-xl border p-4 transition',
                  form.tipoOperacion === t.value
                    ? 'border-brand-600 bg-brand-50 ring-4 ring-brand-100'
                    : 'border-slate-200 hover:border-slate-300'
                ]"
              >
                <input v-model="form.tipoOperacion" type="radio" name="tipo" :value="t.value" class="sr-only" />
                <component
                  :is="t.icon"
                  :class="['h-5 w-5', form.tipoOperacion === t.value ? 'text-brand-600' : 'text-ink-600']"
                />
                <span class="text-sm font-semibold">{{ t.label }}</span>
                <span class="text-xs text-ink-600">{{ t.hint }}</span>
              </label>
            </div>
          </fieldset>

          <FormField
            id="referencia"
            label="Referencia financiera (8 dígitos)"
            :icon="FileDigit"
            :error="errors.numeroReferenciaFinanciera"
          >
            <template #default="{ inputClass }">
              <input
                id="referencia"
                :value="form.numeroReferenciaFinanciera"
                type="text"
                inputmode="numeric"
                maxlength="8"
                placeholder="94837261"
                :class="[inputClass, 'font-mono tracking-widest']"
                @input="onRefInput"
                @blur="errors.numeroReferenciaFinanciera = validateReferencia(form.numeroReferenciaFinanciera)"
              />
            </template>
          </FormField>

          <FormField id="tarjeta-sup" label="Número de tarjeta" :icon="CreditCard" :error="errors.numeroTarjeta">
            <template #default="{ inputClass }">
              <input
                id="tarjeta-sup"
                :value="form.numeroTarjeta"
                type="text"
                inputmode="numeric"
                maxlength="19"
                placeholder="1234 5678 1234 1234"
                :class="[inputClass, 'font-mono tracking-wider']"
                @input="onCardInput"
                @blur="errors.numeroTarjeta = validateTarjeta(form.numeroTarjeta)"
              />
            </template>
          </FormField>

          <div class="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
            <AlertTriangle class="h-4 w-4 shrink-0" />
            <p>Esta acción revierte el cargo al tarjetahabiente y no puede deshacerse. Verifica la referencia antes de continuar.</p>
          </div>

          <button type="submit" class="btn-primary w-full !py-3.5" :disabled="loading">
            <Loader2 v-if="loading" class="h-4 w-4 animate-spin" />
            {{ loading ? 'Aplicando…' : `Aplicar ${form.tipoOperacion.toLowerCase()}` }}
          </button>
        </form>
      </div>

      <aside class="card flex flex-col items-center justify-center p-6">
        <div class="w-full max-w-sm">
          <LottieAnimation :animation="researchersAnimation" />
        </div>
        <div class="mt-2 text-center">
          <h3 class="font-semibold">Validación de reversos</h3>
          <p class="mt-1 text-sm text-ink-600">
            Cada operación se valida contra la referencia financiera y la tarjeta original antes de aplicarse.
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>
