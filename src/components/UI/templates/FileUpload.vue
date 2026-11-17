<template>
  <div class="fu" :class="{ disabled, error: props.error }">
    <!-- ✅ input fuera del overlay (offscreen) -->
    <input ref="fileInput" type="file" class="fu__input" :multiple="multiple" :disabled="disabled" :accept="accept"
      @change="handleFileChange" tabindex="-1" />

    <div class="fu__row">
      <!-- ✅ tooltip SOLO aquí -->
      <span ref="btnRef" class="fu__btn" @mouseenter="onEnter" @mouseleave="onLeave" @focus="onEnter" @blur="onLeave"
        @click="openPicker" tabindex="0" role="button" :aria-disabled="disabled">
        {{ buttonText }}
      </span>

      <span class="fu__name" :title="fileName">
        {{ fileName }}
      </span>
    </div>

    <Teleport to="body">
      <Transition name="tooltip-fade">
        <div v-if="tipOpen && tooltipText" ref="tipRef" class="tooltip-pop" :class="{ 'is-wrap': wrapTip }"
          :style="tipStyle">
          {{ tooltipText }}
        </div>
      </Transition>
    </Teleport>

    <div class="fu__overlay" :class="phase">
      {{ statusText }}
    </div>
  </div>
</template>


<script setup>
import { ref, watch, computed, reactive, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: [File, Object, String, Array, null], default: null },
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  emptyText: { type: String, default: 'No se ha seleccionado ningún archivo.' },
  error: { type: Boolean, default: false },

  accept: { type: String, default: '' },
  types: { type: [Array, String, null], default: null },
  maxSize: { type: Number, default: 2 }, // MB
  dimMin: { type: String, default: null },
  dimMax: { type: String, default: null },
  showHint: { type: Boolean, default: true },
  currentFileName: {
    type: String,
    default: null
  },
})

const emit = defineEmits(['update:modelValue', 'invalid'])

const fileInput = ref(null)
const closeTooltip = () => { tipOpen.value = false }

function openPicker(e) {
  if (props.disabled) return
  closeTooltip()
  // evita que el click en el row dispare cosas raras si venía de focus/enter
  if (e?.target?.closest?.('.fu__btn') || e?.target?.closest?.('.fu__name')) {
    fileInput.value?.click()
  } else {
    fileInput.value?.click()
  }
}

/* ----------------- tu lógica actual ----------------- */
const fileName = ref(props.emptyText)
const buttonText = ref('Adjuntar archivo')
const statusText = ref('')
const phase = ref('')

let t1, t2, t3
function clearTimers() { ;[t1, t2, t3].forEach(t => t && clearTimeout(t)) }

function isFileLike(v) {
  if (v instanceof File) return true
  return v && typeof v === 'object' && typeof v.name === 'string' && typeof v.size === 'number'
}

function isEmptyValue(v) {
  if (v === null || v === undefined) return true
  if (isFileLike(v)) return false
  if (typeof v === 'string') return v.trim() === ''
  if (Array.isArray(v)) return v.length === 0
  if (typeof v === 'object') {
    if (typeof v.path === 'string' && v.path.trim()) return false
    if (typeof v.name === 'string' && v.name.trim()) return false
    return Object.keys(v).length === 0
  }
  return false
}

function getDisplayName(v) {
  if (!v || typeof v !== 'object') return ''
  if (typeof v.name === 'string' && v.name.trim()) return v.name.trim()

  const candidates = [v.original_name, v.filename, v.file_name, v.nombre, v.name_file]
  const found = candidates.find(x => typeof x === 'string' && x.trim())
  if (found) return found.trim()

  if (typeof v.path === 'string' && v.path.trim()) {
    const parts = v.path.split('/')
    return parts[parts.length - 1] || ''
  }
  return ''
}

function updateUI(value) {
  if (isEmptyValue(value)) {
    if (props.currentFileName) {
      fileName.value = props.currentFileName
      buttonText.value = 'Sustituir archivo'
      return
    }

    fileName.value = props.emptyText
    buttonText.value = 'Adjuntar archivo'
    return
  }

  if (props.multiple && Array.isArray(value)) {
    fileName.value = `${value.length} archivo(s) seleccionados`
    buttonText.value = 'Sustituir archivo'
    return
  }

  const name = getDisplayName(value)
  fileName.value = name || 'Archivo'
  buttonText.value = 'Sustituir archivo'
}

function startOverlay() {
  clearTimers()
  statusText.value = 'Cargando archivo'
  phase.value = 'loading'

  t1 = setTimeout(() => {
    statusText.value = 'Completado'
    phase.value = 'done'
  }, 900)

  t2 = setTimeout(() => {
    phase.value = 'retract'
  }, 1800)

  t3 = setTimeout(() => {
    statusText.value = ''
    phase.value = ''
  }, 2400)
}

const maxBytes = computed(() => props.maxSize * 1024 * 1024)

const displayTypes = computed(() => {
  if (Array.isArray(props.types) && props.types.length) {
    return props.types.map(t => String(t).trim()).filter(Boolean).join(', ')
  }
  if (typeof props.types === 'string' && props.types.trim()) {
    return props.types
      .split(/[, ]+/)
      .map(t => t.trim())
      .filter(Boolean)
      .join(', ')
  }
  return 'JPG, PDF'
})

function handleFileChange(e) {
  closeTooltip()
  const files = e.target.files
  const value = props.multiple ? [...files] : files[0] || null

  // if (value instanceof File && value.size > maxBytes.value) {
  //   e.target.value = ''
  //   emit('update:modelValue', null)
  //   updateUI(null)
  //   emit('invalid', { type: 'maxSize', maxSize: props.maxSize })
  //   return
  // }

  emit('update:modelValue', value)
  updateUI(value)

  if (!isEmptyValue(value)) startOverlay()
}

watch(
  () => [props.modelValue, props.currentFileName],
  () => updateUI(props.modelValue),
  { immediate: true, deep: true }
)

/* ----------------- TOOLTIP (solo en fu__btn) ----------------- */
const tooltipText = computed(() => {
  if (!props.showHint) return ''

  const parts = [
    `Fmt. ${displayTypes.value}`,
    `Tam. Máx. ${props.maxSize}MB`,
  ]

  const dimMin = String(props.dimMin ?? '').trim()
  const dimMax = String(props.dimMax ?? '').trim()
  if (dimMin && dimMax) parts.push(`Dim. ${dimMin} - ${dimMax}`)

  return parts.join(' | ')
})

const btnRef = ref(null)
const tipRef = ref(null)
const tipOpen = ref(false)
const wrapTip = ref(false)

const tipStyle = reactive({
  top: '-9999px',
  left: '-9999px',
  transform: 'translate(-50%, -100%)'
})

function placeTooltip() {
  if (!btnRef.value) return
  const r = btnRef.value.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  const pad = 6

  const maxW = Math.min(520, vw - pad * 2)
  tipStyle.maxWidth = `${maxW}px`

  const tipW = tipRef.value?.offsetWidth ?? 0
  const tipH = tipRef.value?.offsetHeight ?? 0

  const fitsTop = r.top >= tipH + pad * 2
  if (fitsTop) {
    tipStyle.top = `${r.top - pad}px`
    tipStyle.transform = 'translate(-50%, -100%)'
  } else {
    tipStyle.top = `${r.bottom + pad}px`
    tipStyle.transform = 'translate(-50%, 0)'
  }

  const cx = r.left + r.width / 2
  const minX = pad + tipW / 2
  const maxX = vw - pad - tipW / 2
  tipStyle.left = `${Math.max(minX, Math.min(cx, maxX))}px`

  const topNum = parseFloat(tipStyle.top)
  if (topNum < pad) tipStyle.top = `${pad}px`
  if (topNum + tipH > vh - pad) tipStyle.top = `${vh - pad - tipH}px`

  const natural = tipRef.value?.scrollWidth ?? 0
  wrapTip.value = natural > maxW
}

function onEnter() {
  if (!tooltipText.value) return
  if (props.disabled) return
  tipOpen.value = true
  nextTick(placeTooltip)
}
function onLeave() {
  tipOpen.value = false
}
function onScrollOrResize() {
  if (tipOpen.value) placeTooltip()
}

onMounted(() => {
  window.addEventListener('scroll', onScrollOrResize, true)
  window.addEventListener('resize', onScrollOrResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScrollOrResize, true)
  window.removeEventListener('resize', onScrollOrResize)
})
</script>

<style scoped>
.fu {
  position: relative;
  width: 100%;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 1px 3px .5px #d3d3d3;
  overflow: visible;
  height: 37px;
}

.fu__input {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.fu__row {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 37px;
  padding: 0 8px;
  min-width: 0;
  cursor: pointer;
}

.fu__btn {
  flex: 0 0 auto;
  background: #6c47ff;
  color: #fff;
  height: 26px;
  padding: 0 10px;
  font-size: 10px;
  font-weight: 600;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
}

.fu__name {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  word-break: break-word;
  font-size: 14px;
  color: #666;
}

.fu__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6c47ff;
  color: #fff;
  font-weight: 600;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .35s ease, background-color .25s ease, color .25s ease;
  pointer-events: none;
  z-index: 2;
}

.fu__overlay.loading {
  transform: scaleX(1);
}

.fu__overlay.done {
  transform: scaleX(1);
  background: #fff;
  color: #6c47ff;
}

.fu__overlay.retract {
  transform: scaleX(0);
  transform-origin: left;
}

.fu.disabled {
  background: #f4f2ff;
  border-color: #ddd;
}

.fu.disabled .fu__btn {
  background: #a38cff;
  cursor: not-allowed;
}

.fu.error {
  border: 1.98px solid #C40003 !important;
}

/* ✅ Tooltip tipo el de tu IconButton */
.tooltip-pop {
  position: fixed;
  background: #3e32bf;
  color: #fff;
  font-weight: 600;
  font-size: 12px;
  line-height: 1.25;
  padding: 6px 10px;
  border-radius: 10px;
  pointer-events: none;
  z-index: 999999;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .2);
  display: inline-block;
  width: max-content;
  max-width: 260px;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: normal;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity .18s ease, transform .18s ease;
}

.tooltip-fade-enter-to,
.tooltip-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.tooltip-pop {
  position: fixed;
  background: #7362f0;
  color: #fcfdf0;
  font-weight: 500 !important;
  font-size: 12px;
  line-height: 1.25;
  padding: 6px 10px;
  border-radius: 5px;
  pointer-events: none;
  z-index: 999999;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .2);

  /* ✅ por defecto: 1 línea */
  white-space: nowrap;
  width: max-content;
}

.tooltip-pop.is-wrap {
  /* ✅ si no cabe: permite wrap */
  white-space: normal;
  width: auto;
  overflow-wrap: break-word;
  word-break: normal;
}
</style>
