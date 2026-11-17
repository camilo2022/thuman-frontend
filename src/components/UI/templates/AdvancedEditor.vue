<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const props = defineProps({
    modelValue: { type: String, default: '' },
    mode: { type: String, default: 'single' },           // 'single' | 'panel'
    panelPosition: { type: String, default: 'right' },   // 'right' | 'bottom'
    minHeight: { type: Number, default: 200 },
    autoHeight: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'focus'])

const rootRef = ref(null)
const editorRef = ref(null)
let lastRange = null

let $el = null
let ro = null

// ✅ Recalcula el alto editable SIN cambiar el diseño (solo layout/alto)
const resizeToContainer = () => {
    if (!props.autoHeight) return
    if (!rootRef.value || !$el) return

    const root = rootRef.value

    // Wrapper real de Summernote
    const noteEditor = root.querySelector('.note-editor')
    if (!noteEditor) return

    const toolbar = noteEditor.querySelector('.note-toolbar')
    const status = noteEditor.querySelector('.note-statusbar')
    const editable = noteEditor.querySelector('.note-editable')
    if (!editable) return

    const toolbarH = toolbar?.offsetHeight || 0
    const statusH = status?.offsetHeight || 0

    // Alto disponible: root si existe, si no, el padre
    const containerH =
        (root.clientHeight && root.clientHeight > 0)
            ? root.clientHeight
            : (root.parentElement?.clientHeight || 0)

    const available = Math.max(props.minHeight, containerH - toolbarH - statusH - 2)
    editable.style.minHeight = `${available}px`
}

const saveRange = () => {
    const sel = window.getSelection()
    if (!sel || !sel.rangeCount) return
    lastRange = sel.getRangeAt(0).cloneRange()
}

const restoreRange = () => {
    if (!$el) return

    $el.summernote('focus')

    const sel = window.getSelection()
    if (!sel) return

    if (lastRange) {
        sel.removeAllRanges()
        sel.addRange(lastRange)
    }
}

onMounted(async () => {
    if (!window.$ || !window.$.fn || !window.$.fn.summernote) {
        console.error('Summernote no está cargado')
        return
    }

    $el = window.$(editorRef.value)

    $el.summernote({
        height: props.minHeight,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
            ['fontname', ['fontname']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']],
            ['table', ['table']],
            ['insert', ['link', 'picture']],
        ],
        callbacks: {
            onChange(contents) {
                if (props.disabled) return
                emit('update:modelValue', contents)
            },
            onFocus() {
                if (props.disabled) return
                saveRange()
                emit('focus')
            },
            onKeyup() {
                if (props.disabled) return
                saveRange()
            },
            onMouseup() {
                if (props.disabled) return
                saveRange()
            }
        }
    })

    if (props.modelValue) {
        $el.summernote('code', props.modelValue)
    }

    $el.summernote(props.disabled ? 'disable' : 'enable')

    await nextTick()
    requestAnimationFrame(() => resizeToContainer())

    // ✅ Recalcular si cambia el tamaño (responsive/panel)
    ro = new ResizeObserver(() => resizeToContainer())
    if (rootRef.value) {
        ro.observe(rootRef.value)
        if (rootRef.value.parentElement) ro.observe(rootRef.value.parentElement)
    }

    // ✅ Recalcular también cuando cambia el viewport (móvil/rotación)
    window.addEventListener('resize', resizeToContainer, { passive: true })
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeToContainer)

    if (ro) ro.disconnect()
    ro = null

    if ($el) {
        $el.summernote('destroy')
        $el = null
    }
})

watch(
    () => props.disabled,
    (isDisabled) => {
        if (!$el) return
        $el.summernote(isDisabled ? 'disable' : 'enable')
        requestAnimationFrame(() => resizeToContainer())
    },
    { immediate: true }
)

watch(
    () => props.modelValue,
    (val) => {
        if (!$el) return
        const current = $el.summernote('code')
        if (val !== current) {
            $el.summernote('code', val || '')
        }
    }
)

watch(
    () => [props.mode, props.panelPosition],
    async () => {
        await nextTick()
        requestAnimationFrame(() => resizeToContainer())
    }
)

// === insertar variable en la posición del cursor ===
const insertVariable = (html) => {
    if (!$el || props.disabled) return

    const wrapped = html.includes('contenteditable=')
        ? html
        : html.replace(
            /class=(["'])var-chip\1/,
            'class="var-chip" contenteditable="false"'
        )

    restoreRange()

    const sel = window.getSelection()
    if (!sel || !sel.rangeCount) return

    const range = sel.getRangeAt(0)
    range.deleteContents()

    const temp = document.createElement('div')
    temp.innerHTML = wrapped

    const chipNode = temp.firstChild
    if (!chipNode) return

    const spacerNode = document.createTextNode('\u200B')

    range.insertNode(spacerNode)
    range.insertNode(chipNode)

    const newRange = document.createRange()
    newRange.setStart(spacerNode, 1)
    newRange.collapse(true)

    sel.removeAllRanges()
    sel.addRange(newRange)

    lastRange = newRange.cloneRange()

    emit('update:modelValue', $el.summernote('code'))
}

const insertVideo = (url) => {
    if (!$el || props.disabled || !url) return
    const clean = String(url).trim()
    if (!clean) return

    const html = `
    <video controls style="max-width:100%; display:block; margin:8px 0;">
      <source src="${clean}" type="video/mp4" />
      Tu navegador no soporta video HTML5.
    </video>
  `
    $el.summernote('pasteHTML', html)
}
const refresh = () => {
    if (!$el) return
    const code = $el.summernote('code')
    $el.summernote('code', code)
    requestAnimationFrame(() => resizeToContainer())
}

defineExpose({ insertVariable, insertVideo, refresh })
</script>

<template>
    <div ref="rootRef" class="adv-editor" :class="[
        mode === 'panel' ? 'has-panel' : 'single',
        mode === 'panel' ? `panel-${panelPosition}` : '',
        props.disabled ? 'is-disabled' : ''
    ]">
        <div class="adv-editor__main">
            <div ref="editorRef"></div>
        </div>

        <aside v-if="mode === 'panel'" class="adv-editor__panel">
            <slot name="panel" />
        </aside>
    </div>
</template>

<style scoped>
/* SOLO layout adaptativo (NO diseño del editor) */
.adv-editor {
    width: 100%;
    min-height: 320px;
    height: 100%;
    /* 👈 permite adaptarse si el contenedor padre tiene height */
}

.adv-editor.has-panel {
    display: flex;
    gap: 16px;
    align-items: stretch;
}

/* panel derecha */
.adv-editor.panel-right .adv-editor__main {
    flex: 1 1 auto;
    min-width: 0;
}

.adv-editor.panel-right .adv-editor__panel {
    width: 380px;
    flex: 0 0 380px;
}

/* panel abajo */
.adv-editor.panel-bottom {
    flex-direction: column;
}

.adv-editor.panel-bottom .adv-editor__panel {
    width: 100%;
}

/* ✅ Flex interno para que el editor se estire (solo layout) */
.adv-editor__main {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

/* 👇 deep: afecta DOM interno de summernote sin tocar estilos visuales */
.adv-editor__main :deep(.note-editor) {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
}

.adv-editor__main :deep(.note-editing-area) {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
}

.adv-editor__main :deep(.note-editable) {
    flex: 1 1 auto;
}

/* responsive: panel abajo en pantallas chicas */
@media (max-width: 980px) {
    .adv-editor.has-panel {
        flex-direction: column;
    }

    .adv-editor.has-panel .adv-editor__panel {
        width: 100%;
        flex: 0 0 auto;
    }
}
</style>

<!-- 👇 estilos GLOBALes para que sí afecten al contenido del editor -->
<style>
.note-editor .note-editable .var-chip {
    display: inline-block;
    padding: 1px 4px;
    border-radius: 5px;

    color: #5b4cd0;
    font-weight: 600;
    font-size: 13px;
    background: #f4eeff;
}

/* MODALES (link, imagen) */
.note-modal-backdrop {
    background-color: rgba(33, 24, 83, 0.55);
}

.note-modal .note-modal-content {
    border-radius: 14px;
    border: none;
    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.18);
    overflow: hidden;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.note-modal .note-modal-header {
    padding: 14px 18px;
    border-bottom: 1px solid #efeafd;
    background: #f7f4ff;
}

.note-modal .note-modal-title {
    font-size: 16px;
    font-weight: 700;
    color: #3b2f93;
}

.note-modal .note-modal-header .close {
    font-size: 20px;
    opacity: 0.5;
}

.note-modal .note-modal-header .close:hover {
    opacity: 0.9;
}

.note-modal .note-modal-body {
    padding: 18px 20px 12px;
}

.note-modal .note-form-label {
    font-size: 13px;
    font-weight: 600;
    color: #4a3cc0;
    margin-bottom: 6px;
}

.note-modal input[type="file"],
.note-modal input[type="text"] {
    width: 100%;
    border-radius: 8px;
    border: 1px solid #ded8ff;
    padding: 8px 10px;
    font-size: 13px;
    box-shadow: none;
}

.note-modal input[type="text"]:focus {
    border-color: #5b4cd0;
    box-shadow: 0 0 0 1px rgba(91, 76, 208, 0.2);
}

.note-modal .note-modal-footer {
    border-top: 1px solid #efeafd;
    padding: 10px 18px 14px;
    background: #fbf9ff;
    text-align: right;
}

.note-modal .note-btn-primary {
    border-radius: 999px;
    padding: 8px 18px;
    background: #5b4cd0;
    border-color: #5b4cd0;
    font-weight: 600;
    font-size: 13px;
}

.note-modal .note-btn-primary:hover {
    background: #4a3ac0;
    border-color: #4a3ac0;
}

/* CONTENEDOR GENERAL */
.note-editor.note-frame {
    border: none;
    border-radius: 12px;
    box-shadow: 0 0 0 1px #e5e7eb;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.note-editor.note-frame .note-toolbar {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}

.note-editor.note-frame .note-editing-area,
.note-editor.note-frame .note-editable,
.note-editor.note-frame .note-statusbar {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
}

/* TOOLBAR */
.note-editor .note-toolbar {
    background: #f4f6fb;
    border-bottom: 1px solid #e5e7eb;
    padding: 4px 6px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.note-editor .note-btn-group {
    margin-right: 4px;
}

.note-editor .note-btn {
    border: none;
    background: transparent;
    color: #4b5563;
    padding: 6px 8px;
    border-radius: 8px;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    box-shadow: none !important;
}

.note-editor .note-btn:hover,
.note-editor .note-btn:focus {
    background: #e2e7ff;
    color: #111827;
    outline: none;
}

.note-editor .note-btn.active,
.note-editor .note-btn.active:hover {
    background: #d4ddff;
    color: #111827;
}

.note-editor .note-btn i,
.note-editor .note-btn span {
    font-size: 14px;
}

.note-editor .note-btn.dropdown-toggle::after {
    margin-left: 4px;
}

.note-editor .note-color .note-current-color-button {
    border-radius: 999px;
    width: 20px;
    height: 20px;
    padding: 0;
}

/* ÁREA DE EDICIÓN */
.note-editor .note-editing-area {
    background: #ffffff;
}

.note-editor .note-editable {
    min-height: 180px;
    padding: 16px 18px;
    font-size: 14px;
    color: #111827;
    line-height: 1.5;
}

.note-editor.note-frame.focus {
    box-shadow: 0 0 0 1px #c7d2fe;
}

/* TABLAS */
.note-editor .note-editable table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
}

.note-editor .note-editable th,
.note-editor .note-editable td {
    word-wrap: break-word;
    padding: 6px 8px;
}

/* BARRA DE ESTADO */
.note-editor .note-statusbar {
    border-top: 1px solid #e5e7eb;
    background: #f9fafb;
}

.note-editor .note-statusbar .note-resizebar {
    height: 6px;
}

.note-dropdown-menu {
    padding: 0 !important;
}

.note-editor .note-toolbar {
    flex-wrap: wrap;
    /* 👈 clave */
    row-gap: 6px;
    /* espacio entre filas */
}

.note-editor .note-btn-group {
    margin-right: 2px;
    /* reduce separación para que quepa más */
}

.adv-editor.is-disabled .note-toolbar {
    pointer-events: none;
}

/* ✅ evita cursor de escritura raro */
.adv-editor.is-disabled .note-editable {
    cursor: not-allowed;
    background: #f4f2ff !important;
    color: #000000 !important;
    border-color: #ddd !important;
}

.note-editor .note-editable .var-chip {
    display: inline-block;
    padding: 1px 4px;
    border-radius: 5px;
    color: #5b4cd0;
    font-weight: 600;
    font-size: 13px;
    background: #f4eeff;
    user-select: all;
    white-space: nowrap;
}
</style>
