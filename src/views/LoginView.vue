<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { ArrowRight, Eye, EyeOff, Headset, Loader2, Lock, Mail, ShieldCheck, Store, Zap } from 'lucide-vue-next'
import BrandLogo from '@/components/BrandLogo.vue'
import FormField from '@/components/FormField.vue'
import LottieAnimation from '@/components/LottieAnimation.vue'
import commerceAnimation from '@/assets/lottie/international-commerce.json'
import { useAuthStore } from '@/stores/auth'
import { ROLES } from '@/utils/jwt'
import { sanitizeEvent } from '@/utils/formatters'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const roles = [
  {
    value: ROLES.OPERADOR,
    title: 'Operador',
    description: 'Ventas y consultas',
    icon: Store,
    username: 'operador@example.com'
  },
  {
    value: ROLES.SUPERVISOR,
    title: 'Supervisor',
    description: 'Cancelaciones y devoluciones',
    icon: ShieldCheck,
    username: 'supervisor@example.com'
  }
]

const form = reactive({ username: roles[0].username, password: '123456', role: ROLES.OPERADOR })
const errors = reactive({ username: '', password: '' })
const showPassword = ref(false)

const highlights = [
  { icon: Zap, text: 'Millones de transacciones procesadas al día' },
  { icon: Headset, text: 'Soporte a redes de comercios' },
  { icon: ShieldCheck, text: 'Soluciones a la medida en medios de pago' }
]

function selectRole(role) {
  form.role = role.value
  form.username = role.username
  form.password = '123456'
  errors.username = errors.password = ''
}

function validate() {
  errors.username = /^\S+@\S+\.\S+$/.test(form.username) ? '' : 'Ingresa un correo válido.'
  errors.password = form.password.length >= 4 ? '' : 'La contraseña es obligatoria.'
  return !errors.username && !errors.password
}

async function submit() {
  if (!validate()) return
  try {
    const { role } = await auth.login({ ...form })
    toast.success(`Bienvenido, has iniciado sesión como ${role}`)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
    router.push(redirect ?? { name: 'dashboard' })
  } catch (error) {
    toast.error(error.response?.data?.message ?? error.message ?? 'No fue posible iniciar sesión')
  }
}
</script>

<template>
  <div class="grid min-h-screen lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
    <!-- Hero -->
    <section class="relative hidden overflow-hidden bg-white lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div class="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-canvas-200 blur-3xl" />

      <BrandLogo size="h-9" class="relative self-start" />

      <div class="relative mx-auto w-full max-w-lg">
        <LottieAnimation :animation="commerceAnimation" />
      </div>

      <div class="relative max-w-xl">
        <h2 class="text-3xl font-bold leading-tight tracking-tight text-ink xl:text-4xl">
          Millones de veces al día, <span class="text-brand-600">procesamos tus transacciones</span>
          simplificando tu vida.
        </h2>
        <p class="mt-4 text-sm leading-relaxed text-ink-600">
          En E-Global brindamos soluciones de medios de pago, procesando millones de transacciones al día.
          Brindamos servicio de soporte a redes de comercios y desarrollamos soluciones a la medida en medios de pago.
        </p>
        <ul class="mt-6 grid gap-3 sm:grid-cols-3">
          <li v-for="h in highlights" :key="h.text" class="flex items-start gap-2 text-xs font-medium text-ink-800">
            <component :is="h.icon" class="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            {{ h.text }}
          </li>
        </ul>
      </div>
    </section>

    <!-- Formulario -->
    <section class="flex items-center justify-center bg-canvas px-5 py-10 sm:px-10">
      <div class="w-full max-w-md animate-fade-up">
        <div class="mb-8 lg:hidden">
          <BrandLogo size="h-8" />
          <div class="mx-auto mt-4 h-52 w-full max-w-xs">
            <LottieAnimation :animation="commerceAnimation" />
          </div>
        </div>

        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Portal de comercios</p>
        <h1 class="mt-1 text-3xl font-bold tracking-tight">Inicia sesión</h1>
        <p class="mt-2 text-sm text-ink-600">Selecciona tu perfil y accede con tus credenciales.</p>

        <form class="card mt-8 space-y-5 p-6 sm:p-8" novalidate @submit.prevent="submit">
          <fieldset>
            <legend class="form-label">Perfil de acceso</legend>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="role in roles"
                :key="role.value"
                type="button"
                :aria-pressed="form.role === role.value"
                :class="[
                  'flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition',
                  form.role === role.value
                    ? 'border-brand-600 bg-brand-50 ring-4 ring-brand-100'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                ]"
                @click="selectRole(role)"
              >
                <component
                  :is="role.icon"
                  :class="['h-5 w-5', form.role === role.value ? 'text-brand-600' : 'text-ink-600']"
                />
                <span class="text-sm font-semibold text-ink">{{ role.title }}</span>
                <span class="text-xs leading-snug text-ink-600">{{ role.description }}</span>
              </button>
            </div>
          </fieldset>

          <FormField id="username" label="Usuario" :icon="Mail" :error="errors.username">
            <template #default="{ inputClass }">
              <input
                id="username"
                :value="form.username"
                type="email"
                autocomplete="username"
                maxlength="60"
                @input="form.username = sanitizeEvent($event, (v) => v.replace(/\s/g, ''))"
                placeholder="usuario@empresa.com"
                :class="inputClass"
              />
            </template>
          </FormField>

          <FormField id="password" label="Contraseña" :icon="Lock" :error="errors.password">
            <template #default="{ inputClass }">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                maxlength="30"
                placeholder="••••••"
                :class="[inputClass, 'pr-11']"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink-400 hover:text-ink"
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                @click="showPassword = !showPassword"
              >
                <component :is="showPassword ? EyeOff : Eye" class="h-4 w-4" />
              </button>
            </template>
          </FormField>

          <button type="submit" class="btn-primary w-full" :disabled="auth.loading">
            <Loader2 v-if="auth.loading" class="h-4 w-4 animate-spin" />
            <template v-else>Ingresar como {{ form.role }} <ArrowRight class="h-4 w-4" /></template>
          </button>

          <p class="text-center text-xs text-ink-400">
            Demo: la contraseña <span class="font-mono font-semibold text-ink-600">123456</span> funciona para ambos perfiles.
          </p>
        </form>

        <p class="mt-8 text-center text-xs text-ink-400">
          © {{ new Date().getFullYear() }} E-Global · Servicios Electrónicos Globales
        </p>
      </div>
    </section>
  </div>
</template>
