<template>
  <div class="select-wrapper" ref="wrapperRef" :class="{ disabled: props.disabled }">
    <input type="text" v-model="search" :placeholder="placeholder" :class="[
      'search-input',
      { 'input-error': props.error },
      $attrs.class
    ]" :disabled="props.disabled" @click="openMenu" @blur="handleBlur" @keydown="handleKeydown"
      :maxlength="maxInputLength" @input="userTyping = true" ref="inputRef" />

    <!-- flecha -->
    <span class="arrow" :class="{ open: open }">
      <svg width="10" height="10" viewBox="0 0 10 10">
        <path d="M2 3 L5 6 L8 3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" />
      </svg>
    </span>

    <!-- ✕ BOTÓN CLEAR -->
    <span v-if="search && !props.disabled" class="clear-btn" @mousedown.prevent="clearInput">
      <svg width="10" height="10" viewBox="0 0 10 10">
        <path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" />
      </svg>
    </span>

    <teleport to="body">
      <ul v-if="open" class="dropdown dropdown-portal" :style="portalStyle">
        <li v-for="(option, index) in filteredOptions" :key="index" @mousedown.prevent="selectOption(option)"
          :class="{ active: index === activeIndex }">
          {{ getDisplay(option) }}
        </li>
      </ul>
    </teleport>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'

/* props & emits */
const props = defineProps({
  options: Array,
  modelValue: [String, Number, null],
  placeholder: String,
  optionKey: { type: String, default: 'label' },
  valueKey: { type: String, default: 'value' },
  disabled: Boolean,
  displayFormatter: Function,
  clearOnSelect: { type: Boolean, default: false }, // 👈 NUEVA
  error: Boolean
})
const emit = defineEmits(['update:modelValue', 'select'])

/* state */
const search = ref('')
const open = ref(false)
const inputRef = ref(null)
const wrapperRef = ref(null)
const activeIndex = ref(-1)
const userTyping = ref(false)

/* === limpiar === */
function clearInput() {
  search.value = ''
  emit('update:modelValue', null)
  open.value = true
  nextTick(positionPortal)
}


/* === resto del código igual === */
function openMenu() {
  if (!props.disabled) {
    open.value = true
    activeIndex.value = 0
    nextTick(positionPortal)
  }
}

function closeMenu() {
  open.value = false
}

function getValueByPath(obj, path) {
  return path.split('.').reduce((acc, p) => acc?.[p], obj)
}
function toStringSafe(v) { return v == null ? '' : String(v) }
function getDisplay(option) {
  return typeof props.displayFormatter === 'function'
    ? toStringSafe(props.displayFormatter(option))
    : toStringSafe(getValueByPath(option, props.optionKey))
}

function isMatched(option) {
  if (!search.value) return false
  return getDisplay(option).toLowerCase().includes(search.value.toLowerCase())
}

// function selectOption(option) {
//   userTyping.value = false

//   const value = getValueByPath(option, props.valueKey)
//   emit('update:modelValue', value)
//   emit('select', option)

//   if (props.clearOnSelect) {
//     search.value = '' // deja placeholder visible
//   } else {
//     search.value = getDisplay(option)
//   }

//   closeMenu()
//   activeIndex.value = -1
// }



// function handleBlur() {
//   // esperamos a que termine el mousedown del click en una opción
//   // (así no se cierra/limpia antes de seleccionar)
//   setTimeout(() => {
//     const typed = search.value.trim().toLowerCase()

//     // si quedó vacío: limpia todo
//     if (!typed) {
//       search.value = ''
//       emit('update:modelValue', null)
//       closeMenu()
//       return
//     }

//     // busca match exacto
//     const exact = props.options.find(
//       opt => getDisplay(opt).toLowerCase() === typed
//     )

//     if (exact) {
//       selectOption(exact)
//       return
//     }

//     // ❌ no existe: limpia el select y el input
//     search.value = ''
//     emit('update:modelValue', null)
//     closeMenu()
//   }, 0)
// }

const justSelected = ref(false)

function selectOption(option) {
  userTyping.value = false
  justSelected.value = true

  const value = getValueByPath(option, props.valueKey)
  emit('update:modelValue', value)
  emit('select', option)

  if (props.clearOnSelect) {
    search.value = ''
  } else {
    search.value = getDisplay(option)
  }

  closeMenu()
  activeIndex.value = -1

  setTimeout(() => {
    justSelected.value = false
  }, 0)
}

function handleBlur() {
  setTimeout(() => {
    // evita reprocesar el blur inmediatamente después de seleccionar
    if (justSelected.value) {
      closeMenu()
      return
    }

    const typed = search.value.trim().toLowerCase()

    if (!typed) {
      search.value = ''
      emit('update:modelValue', null)
      closeMenu()
      return
    }

    const exact = props.options.find(
      opt => getDisplay(opt).toLowerCase() === typed
    )

    if (exact) {
      // solo normaliza el texto, NO vuelvas a emitir select/update:modelValue
      search.value = getDisplay(exact)
      closeMenu()
      return
    }

    search.value = ''
    emit('update:modelValue', null)
    closeMenu()
  }, 0)
}


/* modelValue -> input */
watch(
  () => [props.modelValue, props.options],
  ([val, options]) => {
    if (props.clearOnSelect) {
      if (!open.value) search.value = ''
      return
    }

    const list = Array.isArray(options) ? options : []

    const selected = list.find(
      opt => String(getValueByPath(opt, props.valueKey)) === String(val)
    )

    search.value = selected ? getDisplay(selected) : ''
  },
  { immediate: true, deep: true }
)


/* scroll to match */
watch(search, () => {
  nextTick(() => {
    if (!open.value) return
    const el = document.querySelector('.dropdown-portal')
    const match = el?.querySelector('.matched')
    if (match) match.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  })
})

/* teleport positioning */
const portalStyle = ref({})
function positionPortal() {
  const el = inputRef.value
  if (!el) return

  const rect = el.getBoundingClientRect()

  portalStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 2}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    zIndex: 11000
  }
}

/* click fuera */
function handleClickOutside(e) {
  if (!wrapperRef.value.contains(e.target)) closeMenu()
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

//Agregado para poder limpiar la opción seleccionada dado no deba en un caso estar esa opción activa 16-12-2025
// watch(
//   () => props.options,
//   (options) => {
//     console.log(props.valueKey);
//     console.log(props.modelValue);
//     if (!Array.isArray(options)) return

//     // si aún no hay opciones, no hagas nada
//     if (options.length === 0) return

//     // si no hay valor seleccionado, no hagas nada
//     if (props.modelValue == null) return

//     const exists = options.some(
//       opt => String(getValueByPath(opt, props.valueKey)) === String(props.modelValue)
//     )

//     // solo limpia si realmente quieres invalidar un valor inexistente
//     if (!exists) {
//       search.value = ''
//       emit('update:modelValue', null)
//     }
//   },
//   { immediate: false }
// )

watch(search, (val) => {
  if (props.disabled) return
  if (!userTyping.value) return

  if (val !== '') {
    open.value = true
    nextTick(positionPortal)
  }
})


const filteredOptions = computed(() => {
  if (!search.value) return props.options
  const q = search.value.toLowerCase()
  return props.options.filter(opt =>
    getDisplay(opt).toLowerCase().includes(q)
  )
})

function handleKeydown(e) {
  if (!open.value || !filteredOptions.value.length) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value =
      activeIndex.value < filteredOptions.value.length - 1
        ? activeIndex.value + 1
        : 0
    scrollToActive()
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value =
      activeIndex.value > 0
        ? activeIndex.value - 1
        : filteredOptions.value.length - 1
    scrollToActive()
  }

  if (e.key === 'Enter') {
    e.preventDefault()

    // siempre hay una activa
    selectOption(filteredOptions.value[activeIndex.value])
  }
}


function scrollToActive() {
  nextTick(() => {
    const list = document.querySelector('.dropdown-portal')
    const item = list?.querySelector('.active')
    item?.scrollIntoView({ block: 'nearest' })
  })
}

watch(search, () => {
  if (!filteredOptions.value.length) {
    activeIndex.value = -1
    return
  }

  activeIndex.value = 0
})

function updatePortalPosition() {//Se agrega el 22-12-2025 para adaptar el filtro en tiempo real
  if (!open.value) return
  positionPortal()
}

onMounted(() => {
  window.addEventListener('resize', updatePortalPosition)
  window.addEventListener('scroll', updatePortalPosition, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePortalPosition)
  window.removeEventListener('scroll', updatePortalPosition, true)
})

watch(open, async (v) => {
  if (v) {
    await nextTick()
    positionPortal()
    startPortalSync()
  } else {
    stopPortalSync()
  }
})

let resizeObserver//Se agrega el 22-12-2025 para adaptar el filtro en tiempo real

onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    updatePortalPosition()
  })

  if (inputRef.value) {
    resizeObserver.observe(inputRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

onBeforeUnmount(() => {
  stopPortalSync()
})

const maxInputLength = computed(() => {
  if (!props.options || !props.options.length) return undefined

  return Math.max(
    ...props.options.map(opt => getDisplay(opt).length)
  )
})

let portalFrame = null

function startPortalSync() {
  stopPortalSync()

  const loop = () => {
    if (!open.value) return

    positionPortal()
    portalFrame = requestAnimationFrame(loop)
  }

  portalFrame = requestAnimationFrame(loop)
}

function stopPortalSync() {
  if (portalFrame) {
    cancelAnimationFrame(portalFrame)
    portalFrame = null
  }
}
</script>

<style scoped>
.matched {
  background-color: #F4EFFC !important;
  border-left: 2px solid #5B4CD0;
}

.dropdown li:hover {
  background-color: #F4EFFC !important;
  border-left: 2px solid #5B4CD0;
}

.matched {
  background-color: #F4EFFC !important;
  border-left: 2px solid #5B4CD0;
}

/* hover según estilo morado */
.dropdown li:hover {
  background-color: #F4EFFC !important;
  border-left: 2px solid #5B4CD0;
}

.select-wrapper {
  /* defaults (puedes sobrescribir desde fuera) */
  --select-bg: #fff;
  --select-fg: #000000;
  /* texto del input */
  --select-border: #E6E6E6;
  --select-ring: #5B4CD0;

  --select-arrow: var(--select-fg);
  /* color de la flecha */
  --select-list-bg: #fff;
  --select-list-border: #ccc;
  --select-item-hover-bg: #f0f0f0;
  --select-item-hover-border: #5B4CD0;

  position: relative;
  display: flex;
  flex-direction: column;
}

.search-input {
  outline: none;
  box-sizing: border-box;
  background: var(--select-bg);
  color: var(--select-fg);
  border: 1px solid var(--select-border);
  border-radius: 5px;
  min-height: 30px;
  padding: 7.5px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 6px #D3D3D3;
  transition: border-color .2s ease-in-out, box-shadow .2s ease-in-out;
}

.search-input::placeholder {
  /* fallback + derivado */
  color: var(--select-placeholder, #9aa2b1);
  color: color-mix(in srgb, var(--select-fg) 55%, transparent);
}

.search-input:hover,
.search-input:focus {
  box-shadow: 0 0 4px var(--select-ring);
  border-color: var(--select-ring);
}

/* Menú */
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: 100%;
  background: var(--select-list-bg);
  border: 1px solid var(--select-list-border);
  border-top: none;
  border-radius: 0 0 6px 6px;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 2px;
  z-index: 100;
  box-shadow: 0 1px 3px .5px #D3D3D3;
  transition: border-color .2s ease, box-shadow .2s ease;
}

.dropdown li {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
  transition: background-color .2s ease, box-shadow .2s ease;
}

.dropdown li:hover {
  background-color: var(--select-item-hover-bg);
  border-left: 2px solid var(--select-item-hover-border);
  box-shadow: inset 0 0 4px rgba(91, 76, 208, .3);
}

/* Flecha hereda el color */
.arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: var(--select-arrow);
  transition: transform .2s ease;
  pointer-events: none;
}

.arrow.open {
  transform: translateY(-50%) rotate(180deg);
}


.clear-btn {
  position: absolute;
  right: 30px;
  /* deja espacio para la flecha */
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #000;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 50%;
}

.clear-btn:hover {
  background: #f0f0f0;
}

/* Estado deshabilitado */
.select-wrapper.disabled {
  pointer-events: none;
}

/* Input deshabilitado */
.select-wrapper.disabled .search-input {
  background: #f4f2ff;
  color: #000000;
  border-color: #ddd;
  cursor: not-allowed;
}

/* Flecha apagada */
.select-wrapper.disabled .arrow {
  color: #aaa;
}

/* Elimina efectos hover/focus cuando está deshabilitado */
.select-wrapper.disabled .search-input:hover,
.select-wrapper.disabled .search-input:focus {
  border-color: #ddd;
  box-shadow: none;
}

.select-wrapper.disabled .dropdown li:hover {
  background: inherit;
  border-left: none;
  box-shadow: none;
  cursor: default;
}

/* Mantén tu estilo actual del input */
.select-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
}

/* El menú teletransportado hereda estilos, pero vive en <body> */
.dropdown {
  background: var(--select-list-bg, #fff);
  border: 1px solid var(--select-list-border, #ccc);
  border-radius: 0 0 6px 6px;
  max-height: 240px;
  overflow-y: auto;
  margin-top: 0;
  /* ya damos 2px en el cálculo de top */
  box-shadow: 0 10px 24px rgba(0, 0, 0, .18);
}

.dropdown-portal {
  /* claves para que quede por fuera del modal y no afecte al grid */
  position: absolute;
  /* controlado por portalStyle */
  z-index: 11000;
}

.dropdown li {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}

.dropdown li:hover {
  background-color: var(--select-item-hover-bg, #f0f0f0);
  border-left: 2px solid var(--select-item-hover-border, #5B4CD0);
}

/* ========================= */
/* ESTADO ERROR SEARCHSELECT */
/* ========================= */

.search-input.input-error {
  border-color: #e53935;
  background-color: #ffffff;
  /* 👈 fondo blanco como pediste */
  box-shadow: 0 0 0 1px rgba(229, 57, 53, 0.15);
}

/* evita que hover/focus cambien el rojo */
.search-input.input-error:hover,
.search-input.input-error:focus {
  border-color: #e53935;
  box-shadow: 0 0 0 1px rgba(229, 57, 53, 0.25);
}

.active {
  background-color: #EDE7FF;
  border-left: 2px solid #5B4CD0;
}

.search-input {
  outline: none;
  box-sizing: border-box;
  background: var(--select-bg);
  color: var(--select-fg);
  border: 1px solid var(--select-border);
  border-radius: 5px;
  min-height: 30px;

  /* 🔥 IMPORTANTE */
  padding-left: 10px;
  padding-right: 56px;
  /* espacio para ❌ + flecha */

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  box-shadow: 0 2px 6px #D3D3D3;
}

.dropdown li {
  white-space: normal;
  /* permite varias líneas */
  overflow-wrap: anywhere;
  /* rompe palabras largas */
  word-break: break-word;
  /* fallback */
  line-height: 1.3;
}
</style>
