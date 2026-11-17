<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick, reactive } from 'vue'
import AdvancedEditor from '@/components/UI/templates/AdvancedEditor.vue'

// ---------------- PROPS ----------------
const props = defineProps({ modelTemplate: Object, getData: Boolean })
const emit = defineEmits(['json', 'index'])

const editorWrapRefs = reactive({})

// ---------------- ESTADOS PRINCIPALES ----------------
const margins = ref({
    top: { length: 0, type: "cm" },
    bottom: { length: 0, type: "cm" },
    left: { length: 0, type: "cm" },
    right: { length: 0, type: "cm" },
})

const orientation = ref("portrait")
const size = ref("letter")
const sections = ref([])
const variables = ref([])

// ---------------- UI ----------------
const isSizeOpen = ref(false)
const sizeSectionRef = ref(null)
const activeTab = ref(0)
const openMenuId = ref(null)
const openSubMenuId = ref(null)

// ---------------- EDITOR ----------------
const activeEditorId = ref(null)
const editorRefs = {}

const registerEditorRef = (id, el) => { if (el) editorRefs[id] = el }
const handleEditorFocus = id => { activeEditorId.value = id }

// inserción de variable
const handleVariableClick = (field) => {
    const editor = editorRefs[activeEditorId.value]
    editor.insertVariable(
        `<span class="var-chip" data-key="${field.key}">[${field.label}]</span>`
    )
}

// ---------------- LISTAS / CLÁUSULAS ----------------
const uuid = () => {
    // 1) Nativo (si existe)
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()

    // 2) Fallback con getRandomValues
    const c = globalThis.crypto
    if (c?.getRandomValues) {
        const a = new Uint8Array(16)
        c.getRandomValues(a)
        a[6] = (a[6] & 0x0f) | 0x40
        a[8] = (a[8] & 0x3f) | 0x80
        const h = [...a].map(b => b.toString(16).padStart(2, "0")).join("")
        return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
    }

    // 3) Último fallback (no criptográfico)
    return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`
}


// ---------------- JSON OUTPUT ----------------
const buildJsonAndEmit = () => {
    if (!validateAll()) return
   console.log(sections.value)
    emit("json", {
        margins: margins.value,
        orientation: orientation.value,
        size: size.value,
        sections: sections.value
    })
}

// ---------------- CARGA DE TEMPLATE ----------------
watch(
    () => props.modelTemplate.variables,
    val => { if (Array.isArray(val)) variables.value = val },
    { immediate: true }
)

watch(
    () => props.modelTemplate.settings,
    (settings) => {
        if (!settings) return

        margins.value = settings.margins ?? margins.value
        orientation.value = settings.orientation ?? "portrait"
        size.value = settings.size ?? "letter"

        sections.value = settings.sections
            ? JSON.parse(JSON.stringify(settings.sections))
            : []

        sections.value.forEach(section => {

            if (!section.id) section.id = uuid()

            section.open = false
            section.isEditing = false
            section.tempTitle = section.title

            // ⭐ Asegurar estructura de settings
            section.settings = section.settings ?? {}
            section.settings.is_visible = section.settings.is_visible ?? true
            section.settings.is_editable = section.settings.is_editable ?? false

            section.subsections.forEach(sub => {
                if (!sub.id) sub.id = uuid()

                sub.open = false

                sub.settings = sub.settings ?? {}
                sub.settings.is_visible = sub.settings.is_visible ?? true
                sub.settings.is_editable = sub.settings.is_editable ?? false

                sub.type = sub.entry_type === "list" ? "Lista" : "Texto"
                sub.list_type = sub.list_type ?? "alphabetic"

                sub.draftClauseTitle = sub.draftClauseTitle ?? ""
                sub.draftClauseContent = sub.draftClauseContent ?? ""
                sub.editingClauseId = sub.editingClauseId ?? null

                if (sub.entry_type === "list") {
                    sub.clauses = (sub.items ?? []).map((item, i) => ({
                        id: i + 1,
                        title: item.title,
                        text: item.content
                    }))
                } else {
                    sub.content = sub.content ?? ""
                    sub.clauses = []
                }
            })

            section.subsectionsCount = section.subsections.length
        })
    },
    { immediate: true }
)

// ---------------- CLICK OUTSIDE ----------------
const toggleSizeMenu = () => isSizeOpen.value = !isSizeOpen.value

const handleClickOutsideSize = (e) => {
    if (!isSizeOpen.value) return
    if (!sizeSectionRef.value?.contains(e.target))
        isSizeOpen.value = false
}

onMounted(() => {
    document.addEventListener('click', handleClickOutsideSize)
    document.addEventListener('click', handleGlobalClick)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutsideSize)
    document.removeEventListener('click', handleGlobalClick)
})

const handleGlobalClick = e => {
    if (!e.target.closest('.section-dropdown') &&
        !e.target.closest('.more-button')) {
        openMenuId.value = null
        openSubMenuId.value = null
    }
}

// ---------------- SECCIONES ----------------
const toggleVisible = (section) => {
    section.settings.is_visible = !section.settings.is_visible
}

const addSection = () => {
    const id = uuid()

    sections.value.push({
        id,
        title: "",
        tempTitle: "",
        isEditing: true,
        open: false,
        visible: true,
        allowEdit: false,
        settings: {
            is_visible: true,
            is_editable: false
        },
        subsectionsCount: 0,
        subsections: []
    })

    setError("sectionTitle", id, "El título de la sección es obligatorio.")
}


const deleteSection = (id) => {
    sections.value = sections.value.filter(s => s.id !== id)
}

const toggleSection = (section) => {
    section.open = !section.open
}

const editSection = (section) => {
    section.tempTitle = section.title
    section.isEditing = true
}

const saveSectionTitle = (section) => {
    const value = (section.tempTitle || "").trim()

    if (!value) {
        setError("sectionTitle", section.id, "El título de la sección es obligatorio.")
        return
    }

    clearError("sectionTitle", section.id)
    section.title = value
    section.isEditing = false
}

const saveSubsectionTitle = (sub) => {
    const value = (sub.title || "").trim()

    if (!value) {
        setError("subsectionTitle", sub.id, "El título de la subsección es obligatorio.")
        return
    }

    clearError("subsectionTitle", sub.id)
    sub.title = value
}

const toggleSectionMenu = (id) => {
    openMenuId.value = openMenuId.value === id ? null : id
}

const addSubsection = (section) => {
    const id = uuid()

    section.subsections.push({
        id,
        title: "",
        open: true,
        type: "Texto",
        list_type: "alphabetic",
        content: "",
        clauses: [],
        draftClauseTitle: "",
        draftClauseContent: "",
        editingClauseId: null,
        settings: {
            is_visible: true,
            is_editable: false
        }
    })

    section.subsectionsCount = section.subsections.length
    setError("subsectionTitle", id, "El título de la subsección es obligatorio.")
}

const toggleSubsection = (sub) => {
    sub.open = !sub.open
}

const toggleSubMenu = (id) => {
    openSubMenuId.value = openSubMenuId.value === id ? null : id
}

const deleteSubsection = (section, sub) => {
    delete editorWrapRefs[sub.id]
    delete editorRefs[`text-${sub.id}`]
    delete editorRefs[`clause-${sub.id}`]

    section.subsections = section.subsections.filter(s => s.id !== sub.id)
    section.subsectionsCount = section.subsections.length
    openSubMenuId.value = null
}

// ---------------- CLÁUSULAS ----------------
const sanitizeHtml = (html) => {
    const doc = document.createElement('div');
    doc.innerHTML = html || '';

    // quita scripts
    doc.querySelectorAll('script').forEach(n => n.remove());

    // quita on* handlers (onclick, onerror, etc)
    doc.querySelectorAll('*').forEach(el => {
        [...el.attributes].forEach(attr => {
            if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
        });
    });

    return doc.innerHTML;
};

const cleanHtml = (html) => {
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
}

const wait2Frames = () =>
    new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

const editClause = async (sub, clause) => {
    if (!sub.open) toggleSubsection(sub)

    sub.editingClauseId = clause.id
    sub.draftClauseTitle = clause.title
    sub.draftClauseContent = clause.text || ""

    await nextTick()
    await wait2Frames()

    const target = editorWrapRefs[sub.id]
    if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const editorKey = sub.type === 'Lista' ? `clause-${sub.id}` : `text-${sub.id}`
    editorRefs[editorKey]?.focus?.()
}

const saveClause = (sub) => {
    if (!sub) return

    const title = (sub.draftClauseTitle || "").trim()
    const content = sub.draftClauseContent || ""

    let hasError = false

    if (!title) {
        setError("clauseTitle", sub.id, "El título es obligatorio.")
        hasError = true
    } else {
        clearError("clauseTitle", sub.id)
    }

    if (isHtmlEffectivelyEmpty(content)) {
        setError("clauseContent", sub.id, "El contenido es obligatorio.")
        hasError = true
    } else {
        clearError("clauseContent", sub.id)
    }

    if (hasError) return

    const editingClause = sub.clauses.find(c => c.id === sub.editingClauseId)

    if (editingClause) {
        editingClause.title = title
        editingClause.text = sanitizeHtml(content)
    } else {
        sub.clauses.push({
            id: sub.clauses.length + 1,
            title,
            text: sanitizeHtml(content)
        })
    }

    sub.editingClauseId = null
    sub.draftClauseTitle = ""
    sub.draftClauseContent = ""

    clearError("clauseTitle", sub.id)
    clearError("clauseContent", sub.id)
}

// ---------------- DRAG & DROP ----------------
const dragState = ref({ dragging: null, startIndex: null })

const onDragStart = (sub, clause, index, e) => {
    e.dataTransfer.effectAllowed = "move"
    dragState.value = { sub, startIndex: index, dragging: clause }
}

const onDragEnter = (sub, clause, index) => {
    const arr = sub.clauses
    const from = dragState.value.startIndex
    if (from === index) return

    const item = arr.splice(from, 1)[0]
    arr.splice(index, 0, item)

    arr.forEach((c, i) => (c.id = i + 1))
    dragState.value.startIndex = index
}

const onDragEnd = () => {
    dragState.value = { dragging: null, startIndex: null }
}

// ---------------- TIPOS ----------------
const tipoEntradaOptions = [
    { label: 'Texto', value: 'Texto' },
    { label: 'Lista', value: 'Lista' },
]

const tipoValorOptions = [
    { label: 'Texto', value: 'alphabetic' },
    { label: 'Numérico', value: 'numeric' },
]

// ---------------- ORDENES ----------------
const toSpanishOrdinal = (n) => {
    const unidades = ["", "primera", "segunda", "tercera", "cuarta", "quinta", "sexta", "séptima", "octava", "novena"]
    const decenas = ["", "décima", "vigésima", "trigésima", "cuadragésima", "quincuagésima", "sexagésima", "septuagésima", "octogésima", "nonagésima"]

    if (n < 10) return unidades[n]
    if (n < 100) {
        const d = Math.floor(n / 10)
        const u = n % 10
        return u === 0 ? decenas[d] : `${decenas[d]} ${unidades[u]}`
    }
    return n
}

// ---------------- TRANSICIONES ----------------
function accEnter(el) {
    el.style.height = "0px"
    el.style.opacity = "0"
    el.style.overflow = "hidden"
    const h = el.scrollHeight
    requestAnimationFrame(() => {
        el.style.transition = "height .24s, opacity .18s"
        el.style.height = h + "px"
        el.style.opacity = "1"
    })
}

function accAfterEnter(el) {
    el.style.height = ""
    el.style.transition = ""
    el.style.overflow = ""
}

function accLeave(el) {
    const h = el.scrollHeight
    el.style.height = h + "px"
    el.style.opacity = "1"
    el.style.overflow = "hidden"
    requestAnimationFrame(() => {
        el.style.transition = "height .24s, opacity .18s"
        el.style.height = "0px"
        el.style.opacity = "0"
    })
}

const clamp = (v) => {
    let n = Number(v)
    if (Number.isNaN(n)) n = 0
    return Math.min(5, Math.max(0, n))
}

const errors = reactive({
    sectionTitle: {},   // { [sectionId]: 'mensaje' }
    subsectionTitle: {},// { [subId]: 'mensaje' }
    clauseTitle: {},    // { [subId]: 'mensaje' }
    clauseContent: {},  // { [subId]: 'mensaje' }
    textContent: {},    // { [subId]: 'mensaje' }
})

const isHtmlEffectivelyEmpty = (html) => {
    const tmp = document.createElement("div")
    tmp.innerHTML = html || ""

    // quita chips/elementos vacíos si quieres conservar solo texto visible
    const text = (tmp.textContent || tmp.innerText || "")
        .replace(/\u00A0/g, " ")
        .trim()

    return !text
}

const validateSubsectionTitle = (sub) => {
    const value = (sub.title || "").trim()

    if (!value) {
        setError("subsectionTitle", sub.id, "El título de la subsección es obligatorio.")
        return false
    }

    clearError("subsectionTitle", sub.id)
    sub.title = value
    return true
}

const setError = (group, id, message) => {
    errors[group][id] = message
}

const clearError = (group, id) => {
    delete errors[group][id]
}

const validateAll = () => {
    let isValid = true

    sections.value.forEach(section => {
        const sectionTitle = (section.title || section.tempTitle || "").trim()
        if (!sectionTitle) {
            setError("sectionTitle", section.id, "El título de la sección es obligatorio.")
            isValid = false
        } else {
            clearError("sectionTitle", section.id)
        }

        section.subsections.forEach(sub => {
            const subTitle = (sub.title || "").trim()
            if (!subTitle) {
                setError("subsectionTitle", sub.id, "El título de la subsección es obligatorio.")
                isValid = false
            } else {
                clearError("subsectionTitle", sub.id)
            }

            if (sub.type === "Texto") {
                if (isHtmlEffectivelyEmpty(sub.content)) {
                    setError("textContent", sub.id, "El contenido es obligatorio.")
                    isValid = false
                } else {
                    clearError("textContent", sub.id)
                }
            }

            if (sub.type === "Lista") {
                if (!sub.clauses.length) {
                    setError("clauseContent", sub.id, "Debes agregar al menos una cláusula.")
                    isValid = false
                } else {
                    clearError("clauseContent", sub.id)
                }
            }
        })
    })

    return isValid
}
</script>

<template>
    <div class="breadcrumb">
        <button type="button" class="crumb-back" @click="emit('index')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0" viewBox="0 0 256 256">
                <path
                    d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z">
                </path>
            </svg>
            <p>Volver</p>
        </button>
        <span>|</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0" viewBox="0 0 256 256">
            <path
                d="M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z">
            </path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path
                d="M7.31754 7.44205L1.06754 13.692C1.00947 13.7501 0.940528 13.7962 0.864658 13.8276C0.788787 13.859 0.707469 13.8752 0.625347 13.8752C0.543226 13.8752 0.461908 13.859 0.386037 13.8276C0.310167 13.7962 0.241229 13.7501 0.18316 13.692C0.125091 13.634 0.0790281 13.565 0.0476015 13.4892C0.0161748 13.4133 0 13.332 0 13.2499C0 13.1677 0.0161748 13.0864 0.0476015 13.0105C0.0790281 12.9347 0.125091 12.8657 0.18316 12.8077L5.99175 6.99986L0.18316 1.19205C0.0658843 1.07477 -1.2357e-09 0.915712 0 0.749859C1.2357e-09 0.584007 0.0658843 0.424947 0.18316 0.307672C0.300435 0.190396 0.459495 0.124512 0.625347 0.124512C0.7912 0.124512 0.95026 0.190396 1.06754 0.307672L7.31754 6.55767C7.37565 6.61572 7.42175 6.68465 7.4532 6.76052C7.48465 6.8364 7.50084 6.91772 7.50084 6.99986C7.50084 7.08199 7.48465 7.16332 7.4532 7.2392C7.42175 7.31507 7.37565 7.384 7.31754 7.44205Z"
                fill="#5B4CD0" />
        </svg>
        <span>Configuración</span>
        <span>|</span>
        <span>Empresa</span>
        <span>|</span>
        <span>Entidad internacional</span>
        <span>|</span>
        <span>Plantillas</span>
        <span>|</span>
        <span class="active">Configuración de plantilla</span>
    </div>

    <div class="container-data">
        <div class="split with-panel">
            <div class="split-main">
                <div class="main-container">
                    <template v-if="props.getData">
                        <div class="skeleton-wrapper">

                            <!-- TÍTULO -->
                            <div class="skeleton skeleton-title"></div>


                            <!-- TOOLBAR -->
                            <div class="skeleton-toolbar">

                                <!-- MÁRGENES -->
                                <div class="skeleton-toolbar-block" style="width: 250px;">

                                    <div class="skeleton skeleton-label"></div>

                                    <div class="skeleton-margins-grid">
                                        <!-- Superior -->
                                        <div class="skeleton skeleton-input" style="width: 100%;"></div>

                                        <!-- Inferior -->
                                        <div class="skeleton skeleton-input" style="width: 100%;"></div>

                                        <!-- Izquierdo -->
                                        <div class="skeleton skeleton-input" style="width: 100%;"></div>

                                        <!-- Derecho -->
                                        <div class="skeleton skeleton-input" style="width: 100%;"></div>
                                    </div>

                                </div>

                                <!-- INDUCCIÓN -->
                                <div class="skeleton-toolbar-block">
                                    <div class="skeleton skeleton-label"></div>
                                    <div class="skeleton skeleton-icon-square"></div>
                                </div>

                                <!-- TAMAÑO -->
                                <div class="skeleton-toolbar-block">
                                    <div class="skeleton skeleton-label"></div>
                                    <div class="skeleton skeleton-icon-small"></div>
                                </div>

                                <!-- VISTA PREVIA -->
                                <div class="skeleton-toolbar-block">
                                    <div class="skeleton skeleton-label"></div>
                                    <div class="skeleton skeleton-icon-square"></div>
                                </div>

                            </div>

                            <!-- SECCIONES COLAPSABLES -->
                            <div class="skeleton-section">
                                <div class="skeleton skeleton-section-title"></div>
                                <div class="skeleton-section-actions">
                                    <div class="skeleton skeleton-circle"></div>
                                    <div class="skeleton skeleton-circle"></div>
                                </div>
                            </div>

                            <div class="skeleton-section">
                                <div class="skeleton skeleton-section-title"></div>
                                <div class="skeleton-section-actions">
                                    <div class="skeleton skeleton-circle"></div>
                                    <div class="skeleton skeleton-circle"></div>
                                </div>
                            </div>

                            <div class="skeleton-section">
                                <div class="skeleton skeleton-section-title"></div>
                                <div class="skeleton-section-actions">
                                    <div class="skeleton skeleton-circle"></div>
                                    <div class="skeleton skeleton-circle"></div>
                                </div>
                            </div>

                            <!-- FOOTER -->
                            <div class="skeleton-footer">
                                <div class="skeleton skeleton-button"></div>
                                <div class="skeleton skeleton-button"></div>
                            </div>

                        </div>
                    </template>
                    <template v-else>
                        <!-- TÍTULO -->
                        <h2 class="titulo">Configuración de plantilla</h2>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <div class="toolbar">
                                <!-- MÁRGENES -->
                                <div class="toolbar-section toolbar-margins">
                                    <div class="text">Márgenes</div>

                                    <div class="margins-grid">
                                        <div class="field">
                                            <label class="text">Superior</label>
                                            <input type="number" min="0" max="5" class="input-box field-input"
                                                placeholder="0 cm" v-model.number="margins.top.length"
                                                @input="margins.top.length = clamp(margins.top.length)" />
                                        </div>
                                        <div class="field">
                                            <label class="text">Inferior</label>
                                            <input type="number" min="0" max="5" class="input-box field-input"
                                                placeholder="0 cm" v-model="margins.bottom.length"
                                                @input="margins.bottom.length = clamp(margins.bottom.length)">
                                        </div>
                                        <div class="field">
                                            <label class="text">Izquierdo</label>
                                            <input type="number" min="0" max="5" class="input-box field-input"
                                                placeholder="0 cm" v-model="margins.left.length"
                                                @input="margins.left.length = clamp(margins.left.length)">
                                        </div>
                                        <div class="field">
                                            <label class="text">Derecho</label>
                                            <input type="number" min="0" max="5" class="input-box field-input"
                                                placeholder="0 cm" v-model="margins.right.length"
                                                @input="margins.right.length = clamp(margins.right.length)">
                                        </div>
                                    </div>
                                </div>

                                <div class="toolbar-divider"></div>

                                <!-- INDUCCIÓN -->
                                <div class="toolbar-section">
                                    <div class="text">Inducción</div>
                                    <div class="icon-group">
                                        <button class="icon-button tooltip" data-tooltip="Vertical"
                                            :class="{ 'is-active': orientation === 'portrait' }"
                                            @click="orientation = 'portrait'"><svg xmlns="http://www.w3.org/2000/svg"
                                                width="44" height="44" fill="currentColor" viewBox="0 0 256 256"
                                                class="icon-file">
                                                <path
                                                    d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z">
                                                </path>
                                            </svg></button>
                                        <button class="icon-button tooltip" data-tooltip="Horizontal"
                                            :class="{ 'is-active': orientation === 'landscape' }"
                                            @click="orientation = 'landscape'">
                                            <svg style="transform: rotate(90deg); transform-origin: center;"
                                                xmlns="http://www.w3.org/2000/svg" width="44" height="44"
                                                fill="currentColor" viewBox="0 0 256 256" class="icon-file">
                                                <path
                                                    d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z">
                                                </path>
                                            </svg>
                                        </button>

                                    </div>
                                </div>

                                <div class="toolbar-divider"></div>

                                <!-- TAMAÑO -->
                                <div class="toolbar-section size-section" ref="sizeSectionRef">
                                    <div class="text">Tamaño</div>
                                    <button class="icon-button tooltip" data-tooltip="Tamaño"
                                        @click.stop="toggleSizeMenu" style="display: flex; flex-direction: column;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"
                                            fill="currentColor" viewBox="0 0 256 256" class="icon-file">
                                            <path
                                                d="M216,48V96a8,8,0,0,1-16,0V67.31l-42.34,42.35a8,8,0,0,1-11.32-11.32L188.69,56H160a8,8,0,0,1,0-16h48A8,8,0,0,1,216,48ZM98.34,146.34,56,188.69V160a8,8,0,0,0-16,0v48a8,8,0,0,0,8,8H96a8,8,0,0,0,0-16H67.31l42.35-42.34a8,8,0,0,0-11.32-11.32ZM208,152a8,8,0,0,0-8,8v28.69l-42.34-42.35a8,8,0,0,0-11.32,11.32L188.69,200H160a8,8,0,0,0,0,16h48a8,8,0,0,0,8-8V160A8,8,0,0,0,208,152ZM67.31,56H96a8,8,0,0,0,0-16H48a8,8,0,0,0-8,8V96a8,8,0,0,0,16,0V67.31l42.34,42.35a8,8,0,0,0,11.32-11.32Z">
                                            </path>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#5b4cd0"
                                            viewBox="0 0 256 256" class="icon-file">
                                            <path
                                                d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z">
                                            </path>
                                        </svg>
                                    </button>
                                    <div v-if="isSizeOpen" class="size-dropdown">
                                        <button type="button" class="size-option" :class="{ active: size == 'letter' }"
                                            @click="size = 'letter'">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                fill="#5b4cd0" viewBox="0 0 256 256" class="size-option-icon">
                                                <path
                                                    d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z">
                                                </path>
                                            </svg>
                                            <div class="size-option-text">
                                                <span class="size-option-title">Carta</span>
                                                <span class="size-option-sub">21,59 cm x 27,94</span>
                                            </div>
                                        </button>

                                        <button type="button" class="size-option" :class="{ active: size == 'legal' }"
                                            @click="size = 'legal'">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                fill="#5b4cd0" viewBox="0 0 256 256" class="size-option-icon">
                                                <path
                                                    d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z">
                                                </path>
                                            </svg>
                                            <div class="size-option-text">
                                                <span class="size-option-title">Oficio</span>
                                                <span class="size-option-sub">21,59 cm x 27,94</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <div class="toolbar-divider"></div>

                                <!-- SEPARADOR FLEX -->
                                <div class="toolbar-flex-spacer"></div>

                                <!-- <div class="toolbar-divider"></div> -->

                                <!-- VISTA PREVIA -->
                                <!-- <div class="toolbar-section">
                                    <div class="text">Vista previa</div>
                                    <button class="icon-button tooltip" data-tooltip="Vista previa"><svg
                                            xmlns="http://www.w3.org/2000/svg" width="44" height="44"
                                            fill="currentColor" viewBox="0 0 256 256" class="icon-file">
                                            <path
                                                d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z">
                                            </path>
                                        </svg></button>
                                </div> -->
                            </div>
                            <div class="sections-wrapper" ref="wrapperRef">
                                <!-- ESTADO VACÍO -->
                                <div v-if="!sections.length" class="sections-empty" @click="addSection">
                                    <button class="sections-plus">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#5b4cd0"
                                            viewBox="0 0 256 256">
                                            <path
                                                d="M216,128a12,12,0,0,1-12,12H140v64a12,12,0,0,1-24,0V140H52a12,12,0,0,1,0-24h64V52a12,12,0,0,1,24,0v64h64A12,12,0,0,1,216,128Z">
                                            </path>
                                        </svg>
                                    </button>

                                    <p class="sections-title">No hay secciones agregadas</p>
                                    <p class="sections-subtitle">
                                        Comienza creando tu primera sección para organizar tu plantilla.
                                    </p>
                                </div>

                                <!-- LISTA DE SECCIONES (CADA UNA CON CABECERA TIPO "CONTRATO") -->
                                <div v-else class="sections-list">
                                    <div v-for="section in sections" :key="section.id" class="section-item">
                                        <div class="section-header">
                                            <div class="section-left">
                                                <!-- EDITANDO -->
                                                <template v-if="section.isEditing">
                                                    <div class="field-with-error">
                                                        <input v-model="section.tempTitle" class="input-box"
                                                            :class="{ 'input-error': errors.sectionTitle[section.id] }"
                                                            @keyup.enter="saveSectionTitle(section)"
                                                            @input="clearError('sectionTitle', section.id)" />
                                                        <small v-if="errors.sectionTitle[section.id]"
                                                            class="error-text">
                                                            {{ errors.sectionTitle[section.id] }}
                                                        </small>
                                                    </div>
                                                </template>

                                                <!-- NORMAL -->
                                                <template v-else>
                                                    <span class="section-title">{{
                                                        section.title }}</span>
                                                    <template v-if="section.settings.is_visible">
                                                        <Button title="Ocultar título" icon="preview"
                                                            variant="transparent"
                                                            @click.stop="toggleVisible(section)" />
                                                    </template>
                                                    <template v-else>
                                                        <Button title="Visualizar título" icon="hidden"
                                                            variant="transparent"
                                                            @click.stop="toggleVisible(section)" />
                                                    </template>
                                                </template>
                                            </div>

                                            <div class="section-right">
                                                <Button v-if="section.isEditing" title="Guardar" icon="save"
                                                    variant="transparent" @click="saveSectionTitle(section)" />
                                                <span class="section-pill">
                                                    {{ section.subsectionsCount }} subsecciones
                                                </span>

                                                <Button title="" icon="more" class="more-button" variant="transparent"
                                                    @click.stop="toggleSectionMenu(section.id)" />
                                                <div v-if="!section.isEditing && openMenuId === section.id"
                                                    class="section-dropdown">
                                                    <button type="button" class="size-option"
                                                        @click="editSection(section)">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                            fill="#5b4cd0" viewBox="0 0 256 256">
                                                            <path
                                                                d="M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM91,204H52V165l84-84,39,39ZM192,103,153,64l18.34-18.34,39,39Z">
                                                            </path>
                                                        </svg>
                                                        <div class="size-option-text">
                                                            <span class="size-option-title">Editar</span>
                                                        </div>
                                                    </button>

                                                    <button type="button" class="size-option"
                                                        @click="deleteSection(section.id)">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                            fill="#c40003" viewBox="0 0 256 256">
                                                            <path
                                                                d="M216,48H180V36A28,28,0,0,0,152,8H104A28,28,0,0,0,76,36V48H40a12,12,0,0,0,0,24h4V208a20,20,0,0,0,20,20H192a20,20,0,0,0,20-20V72h4a12,12,0,0,0,0-24ZM100,36a4,4,0,0,1,4-4h48a4,4,0,0,1,4,4V48H100Zm88,168H68V72H188ZM116,104v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Zm48,0v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Z">
                                                            </path>
                                                        </svg>
                                                        <div class="size-option-text">
                                                            <span class="size-option-title">Eliminar</span>
                                                        </div>
                                                    </button>
                                                </div>


                                                <!-- toggle colapsable -->
                                                <button class="section-toggle" :disabled="section.isEditing"
                                                    :class="{ 'is-disabled': section.isEditing }"
                                                    @click="toggleSection(section)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                        fill="#5b4cd0" viewBox="0 0 256 256" :style="{
                                                            transform: section.open ? 'rotate(90deg)' : 'rotate(0deg)',
                                                            transition: 'transform .18s'
                                                        }">
                                                        <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"
                                                            opacity="0.2"></path>
                                                        <path
                                                            d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm29.66-93.66a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32L140.69,128,106.34,93.66a8,8,0,0,1,11.32-11.32Z">
                                                        </path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- CONTENIDO COLAPSABLE -->
                                        <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                                            <div v-if="section.open" class="section-body-anim"
                                                style="padding: 0 10px 10px 10px;">
                                                <div class="section-body">
                                                    <!-- checkbox de la sección -->
                                                    <label class="checkbox-label">
                                                        <input type="checkbox" v-model="section.settings.is_editable"
                                                            class="checkbox-input" />
                                                        <div class="checkbox-box" style="width: 18px; height: 18px;">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon"
                                                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                                stroke-width="3">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                        <span class="text">Permitir edición</span>
                                                    </label>
                                                </div>

                                                <!-- LISTA DE SUBSECCIONES (PREÁMBULO, CLÁUSULAS, etc.) -->
                                                <div v-if="section.subsections && section.subsections.length"
                                                    class="subsections-list">
                                                    <div v-for="sub in section.subsections" :key="sub.id"
                                                        class="subsection-item unified">
                                                        <!-- fila compacta -->
                                                        <div class="subsection-header">
                                                            <div class="section-left">
                                                                <template v-if="sub.open">
                                                                    <div class="field-with-error">
                                                                        <input class="input-box" v-model="sub.title" 
                                                                        :class="{ 'input-error': errors.subsectionTitle[sub.id] }" />
                                                                        <small v-if="errors.subsectionTitle[sub.id]"
                                                                            class="error-text">
                                                                            {{ errors.subsectionTitle[sub.id] }}
                                                                        </small>
                                                                    </div>
                                                                </template>
                                                                <template v-else>
                                                                    <span class="subsection-title">{{ sub.title
                                                                    }}</span>
                                                                    <template v-if="sub.settings.is_visible">
                                                                        <Button title="Ocultar título" icon="preview"
                                                                            variant="transparent"
                                                                            @click.stop="toggleVisible(sub)" />
                                                                    </template>
                                                                    <template v-else>
                                                                        <Button title="Visualizar título" icon="hidden"
                                                                            variant="transparent"
                                                                            @click.stop="toggleVisible(sub)" />
                                                                    </template>
                                                                </template>
                                                            </div>

                                                            <div class="subsection-actions">
                                                                <Button v-if="sub.open" title="Guardar" icon="save"
                                                                    variant="transparent"
                                                                    @click="saveSubsectionTitle(sub)" />
                                                                <Button title="" icon="more" variant="transparent"
                                                                    @click.stop="toggleSubMenu(sub.id)" />
                                                                <div v-if="openSubMenuId === sub.id"
                                                                    class="section-dropdown subsection-dropdown">
                                                                    <button type="button" class="size-option"
                                                                        @click="deleteSubsection(section, sub)">
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                            width="18" height="18" fill="#c40003"
                                                                            viewBox="0 0 256 256">
                                                                            <path
                                                                                d="M216,48H180V36A28,28,0,0,0,152,8H104A28,28,0,0,0,76,36V48H40a12,12,0,0,0,0,24h4V208a20,20,0,0,0,20,20H192a20,20,0,0,0,20-20V72h4a12,12,0,0,0,0-24ZM100,36a4,4,0,0,1,4-4h48a4,4,0,0,1,4,4V48H100Zm88,168H68V72H188ZM116,104v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Zm48,0v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Z">
                                                                            </path>
                                                                        </svg>
                                                                        <div class="size-option-text">
                                                                            <span
                                                                                class="size-option-title">Eliminar</span>
                                                                        </div>
                                                                    </button>
                                                                </div>

                                                                <!-- botón para abrir el detalle -->
                                                                <button class="section-toggle"
                                                                    @click="toggleSubsection(sub)">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32"
                                                                        height="32" fill="#5b4cd0" viewBox="0 0 256 256"
                                                                        :style="{
                                                                            transform: sub.open ? 'rotate(90deg)' : 'rotate(0deg)',
                                                                            transition: 'transform .18s'
                                                                        }">
                                                                        <path
                                                                            d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"
                                                                            opacity="0.2">
                                                                        </path>
                                                                        <path
                                                                            d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm29.66-93.66a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32L140.69,128,106.34,93.66a8,8,0,0,1,11.32-11.32Z">
                                                                        </path>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <!-- DETALLE DE LA SUBSECCIÓN (segunda captura) -->
                                                        <transition @enter="accEnter" @after-enter="accAfterEnter"
                                                            @leave="accLeave">
                                                            <div v-show="sub.open" class="subsection-card"
                                                                :class="{ 'not-padding': !sub.open }">
                                                                <div class="subsection-card-toolbar">
                                                                    <div>
                                                                        <label class="text">Tipo de entrada</label>
                                                                        <SearchSelect v-model="sub.type"
                                                                            :options="tipoEntradaOptions"
                                                                            optionKey="label" valueKey="value"
                                                                            placeholder="Tipo" />
                                                                    </div>

                                                                    <label class="checkbox-label">
                                                                        <input type="checkbox"
                                                                            v-model="sub.settings.is_editable"
                                                                            class="checkbox-input" />
                                                                        <div class="checkbox-box"
                                                                            style="width: 18px; height: 18px;">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                class="check-icon" fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                stroke="currentColor" stroke-width="3">
                                                                                <path stroke-linecap="round"
                                                                                    stroke-linejoin="round"
                                                                                    d="M5 13l4 4L19 7" />
                                                                            </svg>
                                                                        </div>
                                                                        <span class="text">Permitir edición</span>
                                                                    </label>
                                                                </div>
                                                                <div v-if="sub.type === 'Lista'"
                                                                    :ref="el => (editorWrapRefs[sub.id] = el)"
                                                                    class="subsection-extra">
                                                                    <div>
                                                                        <label class="text">Título</label>
                                                                        <input v-model="sub.draftClauseTitle"
                                                                            type="text"
                                                                            :class="{ 'input-error': errors.clauseTitle[sub.id] }"
                                                                            class="input-box subsection-input"
                                                                            placeholder="Título" />
                                                                        <small v-if="errors.clauseTitle[sub.id]"
                                                                            class="error-text">
                                                                            {{ errors.clauseTitle[sub.id] }}
                                                                        </small>
                                                                    </div>

                                                                    <div>
                                                                        <label class="text">Tipo de dato</label>
                                                                        <SearchSelect v-model="sub.list_type"
                                                                            class="subsection-select"
                                                                            :options="tipoValorOptions"
                                                                            optionKey="label" valueKey="value"
                                                                            placeholder="Tipo" />
                                                                    </div>
                                                                </div>

                                                                <!-- aquí puedes meter tu editor rico; de momento un textarea -->
                                                                <div v-if="sub.type === 'Texto'">
                                                                    <AdvancedEditor :key="`text-${sub.id}`"
                                                                        v-model="sub.content"
                                                                        :ref="el => registerEditorRef(`text-${sub.id}`, el)"
                                                                        @focus="handleEditorFocus(`text-${sub.id}`)" />
                                                                    <small v-if="errors.textContent[sub.id]"
                                                                        class="error-text">
                                                                        {{ errors.textContent[sub.id] }}
                                                                    </small>
                                                                </div>

                                                                <div v-else-if="sub.type === 'Lista'">
                                                                    <AdvancedEditor :key="`clause-${sub.id}`"
                                                                        v-model="sub.draftClauseContent"
                                                                        :ref="el => registerEditorRef(`clause-${sub.id}`, el)"
                                                                        @focus="handleEditorFocus(`clause-${sub.id}`)" />
                                                                    <small v-if="errors.clauseContent[sub.id]"
                                                                        class="error-text">
                                                                        {{ errors.clauseContent[sub.id] }}
                                                                    </small>
                                                                </div>
                                                                <div v-if="sub.type === 'Lista'" class="form-buttons"
                                                                    ref="clauseEditorWrapRef">
                                                                    <button class="sections-add-btn"
                                                                        @click="saveClause(sub)">Añadir</button>
                                                                </div>
                                                                <template v-if="sub.type === 'Lista'">
                                                                    <div class="clauses-list">
                                                                        <div v-for="(clause, index) in sub.clauses"
                                                                            :key="clause.id" class="clause-item"
                                                                            draggable="true"
                                                                            @dragstart="onDragStart(sub, clause, index, $event)"
                                                                            @dragenter.prevent="onDragEnter(sub, clause, index)"
                                                                            @dragend="onDragEnd">
                                                                            <!-- ícono de “arrastrar” -->
                                                                            <div>
                                                                                <button class="clause-handle"
                                                                                    @mousedown.prevent type="button">
                                                                                    <svg width="16" height="16"
                                                                                        viewBox="0 0 16 16">
                                                                                        <path d="M3 4h10M3 8h10M3 12h10"
                                                                                            stroke="currentColor"
                                                                                            stroke-width="1.4"
                                                                                            stroke-linecap="round" />
                                                                                    </svg>
                                                                                </button>
                                                                            </div>

                                                                            <!-- número -->
                                                                            <div>
                                                                                <span class="clause-number">
                                                                                    {{
                                                                                        sub.list_type === 'numeric'
                                                                                            ? (index + 1)
                                                                                            : toSpanishOrdinal(index +
                                                                                                1).toUpperCase()
                                                                                    }}
                                                                                </span>
                                                                            </div>

                                                                            <!-- texto -->
                                                                            <div>
                                                                                <p class="clause-text">
                                                                                    <span class="clause-title">{{
                                                                                        clause.title
                                                                                    }}</span>
                                                                                    <span class="clause-separator"> —
                                                                                    </span>
                                                                                    <span> {{ cleanHtml(clause.text)
                                                                                        }}
                                                                                    </span>
                                                                                </p>
                                                                            </div>

                                                                            <!-- botón editar -->
                                                                            <div>
                                                                                <Button title="Editar" icon="pencil"
                                                                                    @click="editClause(sub, clause)"
                                                                                    variant="question" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </template>
                                                            </div>
                                                        </transition>
                                                    </div>
                                                </div>

                                                <!-- BLOQUE "AGREGAR SUBSECCIÓN" -->
                                                <div class="sections-empty" @click.stop="addSubsection(section)">
                                                    <button class="sections-plus">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                            fill="#5b4cd0" viewBox="0 0 256 256">
                                                            <path
                                                                d="M216,128a12,12,0,0,1-12,12H140v64a12,12,0,0,1-24,0V140H52a12,12,0,0,1,0-24h64V52a12,12,0,0,1,24,0v64h64A12,12,0,0,1,216,128Z">
                                                            </path>
                                                        </svg>
                                                    </button>

                                                    <p class="sections-title">Agregar subsección</p>
                                                </div>
                                            </div>
                                        </transition>
                                    </div>
                                </div>

                                <!-- BOTÓN "AGREGAR SECCIÓN" ABAJO -->
                                <div class="sections-footer">
                                    <button class="sections-add-btn" @click="addSection">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff"
                                            viewBox="0 0 256 256">
                                            <path
                                                d="M216,128a12,12,0,0,1-12,12H140v64a12,12,0,0,1-24,0V140H52a12,12,0,0,1,0-24h64V52a12,12,0,0,1,24,0v64h64A12,12,0,0,1,216,128Z">
                                            </path>
                                        </svg>
                                        <span>Agregar sección</span>
                                    </button>
                                    <button class="sections-add-btn" @click="buildJsonAndEmit">
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>

                </div>
            </div>
            <div class="slide-panel">
                <div class="split-panel">
                    <template v-if="props.getData">
                        <div>

                            <!-- Tabs -->
                            <div class="variables-tabs">
                                <div class="skeleton-block skeleton-tab"></div>
                                <div class="skeleton-block skeleton-tab"></div>
                                <div class="skeleton-block skeleton-tab"></div>
                            </div>

                            <!-- Grupo 1 -->
                            <div class="skeleton-group">
                                <div class="skeleton-group-title">
                                    <div class="skeleton-block skeleton-dot"></div>
                                    <div class="skeleton-block skeleton-title"></div>
                                </div>

                                <div class="skeleton-chips">
                                    <div class="skeleton-block skeleton-chip"></div>
                                    <div class="skeleton-block skeleton-chip"></div>
                                </div>
                            </div>

                            <!-- Grupo 2 -->
                            <div class="skeleton-group">
                                <div class="skeleton-group-title">
                                    <div class="skeleton-block skeleton-dot"></div>
                                    <div class="skeleton-block skeleton-title"></div>
                                </div>

                                <div class="skeleton-chips">
                                    <div class="skeleton-block skeleton-chip"></div>
                                    <div class="skeleton-block skeleton-chip"></div>
                                    <div class="skeleton-block skeleton-chip"></div>

                                    <div class="skeleton-block skeleton-chip"></div>
                                    <div class="skeleton-block skeleton-chip"></div>
                                </div>
                            </div>

                            <!-- Grupo 3 -->
                            <div class="skeleton-group">
                                <div class="skeleton-group-title">
                                    <div class="skeleton-block skeleton-dot"></div>
                                    <div class="skeleton-block skeleton-title"></div>
                                </div>

                                <div class="skeleton-chips">
                                    <div class="skeleton-block skeleton-chip"></div>
                                    <div class="skeleton-block skeleton-chip"></div>
                                    <div class="skeleton-block skeleton-chip"></div>

                                    <div class="skeleton-block skeleton-chip"></div>
                                    <div class="skeleton-block skeleton-chip"></div>
                                </div>
                            </div>

                        </div>

                    </template>
                    <template v-else>
                        <h2 class="sub-titulo">Variables</h2>
                        <template v-if="variables.length">
                            <!-- Tabs dinámicos -->
                            <div class="nav-tabs" :style="{ '--active': activeTab, '--count': variables.length }"
                                role="tablist">
                                <button v-for="(tab, i) in variables" :key="i" class="tab"
                                    :class="{ active: activeTab === i }" @click="activeTab = i" role="tab"
                                    :aria-selected="activeTab === i">
                                    {{ tab.label }}
                                </button>

                                <span class="underline"></span>
                            </div>

                            <div class="info-panel">

                                <!-- CONTENIDO DEL TAB ACTUAL -->
                                <template v-if="variables.length">

                                    <div class="info-group" v-for="(group, gi) in variables[activeTab].groups"
                                        :key="gi">
                                        <div class="info-header">
                                            <span class="info-dot"></span>
                                            <span class="info-title">{{ group.title }}</span>
                                        </div>

                                        <div class="info-tags">
                                            <button v-for="(field, fi) in group.fields" :key="fi" class="info-chip"
                                                @click="handleVariableClick(field)">
                                                {{ field.label }}
                                            </button>
                                        </div>
                                    </div>

                                </template>
                            </div>
                        </template>
                        <template v-else>
                            <div class="bg-yellow" style="font-size: 14px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                </svg>
                                <p class="variables-empty-title">No hay variables disponibles.</p>
                                <p class="variables-empty-sub">
                                    Esta plantilla no tiene variables asociadas al tipo de documento seleccionado.
                                </p>
                            </div>
                            <div class="variables-empty">

                            </div>
                        </template>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.sub-titulo {
    padding: 10px;
    font: 500 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    font-size: 22px;
    font-weight: bold;
}

.split {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: start;
    transition: grid-template-columns .22s ease;
}

.split.with-panel {
    grid-template-columns: 1fr 350px;
    /* contenido + ancho del panel */
}

.split-main {
    min-width: 0;
}

.split-panel {
    min-width: 0;
    background-color: white;
    border-radius: 10px;
    padding: 10px;
}

/* Responsive: apilar en pantallas pequeñas */
@media (max-width: 980px) {
    .split.with-panel {
        grid-template-columns: 1fr;
    }

    .split-panel {
        order: 2;
    }

    .split-main {
        order: 1;
    }
}

.slide-panel-enter-active,
.slide-panel-leave-active {
    transition: all 0.3s ease;
}

.slide-panel-enter-from,
.slide-panel-leave-to {
    transform: translateX(30px);
    /* mueve 30px a la derecha */
    opacity: 0;
}

.toolbar {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 0.25rem 1rem 0.5rem;
    background: #fbf9ff;
    border-radius: 10px;
    font-family: system-ui, sans-serif;
    font-size: 12px;
}

.toolbar-section {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.advanced-editor,
.advanced-editor * {
    margin-top: 0 !important;
}

.section-title {
    font-weight: 600;
    color: #444;
}

.toolbar-margins .margins-grid {
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 0.4rem 1rem;
}

.field {
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

.field label {
    min-width: 65px;
}

.field-input {
    max-width: 70px;
    background: #fff;
    text-align: center;
    padding: 0.15rem 0.4rem;
    text-align: center;
}

.icon-group {
    display: flex;
    gap: 0.5rem;
}

.icon-button {
    min-width: 32px;
    min-height: 32px;
    padding: 0.3rem 0.5rem;
    border-radius: 10px;
    border: 1px solid transparent;
    background: #fbf9ff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background .2s ease;
}

.icon-button:hover {
    background: #e4dbff;
    border-color: #b39dff;
    box-shadow: 0 0 4px rgba(91, 76, 208, 0.6);
}

.icon-button.is-active {
    background: #e4dbff;
    border-color: #b39dff;
}

.icon-dropdown {
    margin-left: 0.25rem;
    font-size: 10px;
}

.toolbar-divider {
    width: 0.5px;
    align-self: stretch;
    background: #e8e2fd;
}

.toolbar-flex-spacer {
    flex: 1;
}

.icon-btn {
    border: none;
    border-radius: 6px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background .2s ease;
    padding: 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .2);
}

/* === TOOLTIP REUTILIZABLE === */
.tooltip {
    position: relative;
}

/* El globito del tooltip */
.tooltip::after {
    content: attr(data-tooltip);
    /* texto desde data-tooltip */
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #3e32bf;
    color: #fff;
    font-weight: 600;
    font-size: 12px;
    line-height: 1.25;
    padding: 6px 10px;
    border-radius: 10px;
    white-space: nowrap;
    /* una sola línea */
    opacity: 0;
    pointer-events: none;
    transition: opacity .15s ease, transform .15s ease;
    z-index: 9999;
    box-shadow: 0 2px 6px rgba(0, 0, 0, .2);
}

/* Mostrar tooltip al pasar el mouse */
.tooltip:hover::after {
    opacity: 1;
    transform: translate(-50%, -6px);
    /* sube un poquito al aparecer */
}

.icon-file {
    color: #5b4cd0 !important;
}

/* sección de Tamaño para que el dropdown se posicione respecto a ella */
.size-section {
    position: relative;
}

/* contenedor del menú desplegable */
.size-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 8px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, .08);
    padding: 6px 0;
    z-index: 10000;
    min-width: 190px;
}

/* cada opción */
.size-option {
    width: 100%;
    padding: 8px 12px;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.size-option.active {
    background-color: #f5f2ff;
}

.size-option:hover {
    background: #f5f2ff;
}

.size-option-icon {
    flex-shrink: 0;
}

.size-option-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.size-option-title {
    font-size: 13px;
    font-weight: 600;
    color: #2b2c34;
}

.size-option-sub {
    font-size: 11px;
    color: #999;
}

.nav-tabs {
    position: relative;
    display: grid;
    grid-template-columns: repeat(var(--count), 1fr);
    gap: 0;
    margin-top: 6px;
    padding-top: 6px;
    border-bottom: 1px solid rgba(91, 76, 208, 0.25);
}

.tab {
    background: transparent;
    border: 0;
    padding: 10px 0 8px;
    font-weight: 600;
    cursor: pointer;
    color: #9a86ff;
    transition: color 0.15s;
}

.tab:nth-child(calc(var(--active) + 1)) {
    color: #5b4cd0;
    background: #f7f5ff;
}

.underline {
    position: absolute;
    left: 0;
    bottom: -1px;
    width: calc(100% / var(--count));
    height: 2px;
    background: #5b4cd0;
    transform: translateX(calc(var(--active) * 100%));
    transition: transform 0.2s ease;
    pointer-events: none;
}

/* Info panel */

.info-panel {
    background: #ffffff;
    padding: 16px 20px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #3c2f91;
}

/* Cada bloque (Empresa, Entidad, etc.) */
.info-group {
    margin-bottom: 18px;
}

.info-group:last-child {
    margin-bottom: 0;
}

/* Título con punto morado */
.info-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.info-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #5b4cd0;
    box-shadow: 0 0 0 4px rgba(91, 76, 208, 0.15);
}

.info-title {
    font-size: 14px;
    font-weight: 700;
}

/* Contenedor de los "chips" */
.info-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-left: 18px;
    /* sangría respecto al punto/título */
}

/* Chip / pill */
.info-chip {
    border-radius: 4px;
    padding: 4px 12px;
    font-size: 12px;
    border: 1px solid #5b4cd0;
    background: #f4eeff;
    color: #5b4cd0;
    cursor: pointer;
    line-height: 1.2;
    white-space: nowrap;
}

.info-chip:hover {
    background: #f5f2ff;
}

.sections-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Caja grande con borde punteado */
.sections-empty {
    border-radius: 10px;
    border: 2px dashed #d4d0f3;
    background: transparent;
    padding: 32px 16px;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
}

/* Botón redondo con + */
.sections-plus {
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: #EBDEFF;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
}

/* Textos */
.sections-title {
    font-weight: 600;
    font-size: 14px;
    color: #222;
    margin: 0 0 4px;
}

.sections-subtitle {
    font-size: 12px;
    color: #a0a0b5;
    margin: 0;
}

/* Pie con botón a la derecha */
.sections-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.sections-add-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 5px;
    border: none;
    background: #5b4cd0;
    color: #ffffff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
}

.sections-add-btn:hover {
    filter: brightness(0.95);
}


.section-body-placeholder {
    font-size: 12px;
    color: #777;
    margin: 0;
}

.sections-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.section-item {
    border-radius: 8px;
    background: #f7f4ff;
}

/* CABECERA TIPO "CONTRATO" */
.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
}

.section-left {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    min-width: 0;
}

.section-title {
    font-size: 13px;
    font-weight: 700;
    color: #5b4cd0;
}

.section-eye {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 2px;
}

.section-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.section-pill {
    font-size: 11px;
    border-radius: 5px;
    border: 1px solid #5b4cd0;
    padding: 2px 10px;
    color: #5b4cd0;
    background: #fdfbff;
}

.section-more {
    border-radius: 999px;
    border: none;
    background: transparent;
    color: #5b4cd0;
    font-size: 16px;
    cursor: pointer;
    padding: 0 6px;
}

.section-toggle {
    border-radius: 999px;
    border: transparent;
    background: transparent;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

/* el que se anima (SIN padding) */
.section-body-anim {
    /* overflow: hidden; */
    /* por si acaso */
}

/* el que lleva el padding real */
.section-body {
    padding: 10px;
}

.section-dropdown {
    position: absolute;
    top: 28px;
    right: 10px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, .08);
    padding: 6px 0;
    z-index: 10000;
    min-width: 130px;
}

.dropdown-item {
    width: 100%;
    padding: 8px 12px;
    background: transparent;
    border: none;
    text-align: left;
    font-size: 13px;
    cursor: pointer;
    color: #4c3acb;
}

.dropdown-item:hover {
    background: #f5f2ff;
}

.dropdown-item.delete {
    color: #d9534f;
}

.dropdown-item.delete:hover {
    background: #ffeaea;
}

.section-header {
    position: relative;
}

/* subsecciones */
.subsections-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 10px 10px;
}

.subsection-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.subsection-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    border-radius: 12px 12px 0 0;
    padding: 8px 12px;
    cursor: pointer;
}

.subsection-title {
    font-size: 13px;
    font-weight: 700;
    color: #5b4cd0;
}

.subsection-actions {
    display: flex;
    align-items: center;
    gap: 6px;
}

/* tarjeta grande del detalle */
.subsection-card {
    background: #ffffff;
    border-radius: 0 0 12px 12px;
    margin-top: 0;
    /* quita separación */
    padding-top: 0;
    padding: 10px 12px 14px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, .03);
}

.not-padding {
    padding: 0 10px !important;
}

.subsection-card-header {
    margin-bottom: 8px;
}

.subsection-card-toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
}

.subsection-select {
    min-width: 140px;
}

.subsection-editor {
    border-radius: 10px;
    border: 1px solid #e1ddff;
    background: #faf9ff;
    padding: 8px;
}

.editor-textarea {
    width: 100%;
    min-height: 140px;
    border: none;
    outline: none;
    resize: vertical;
    font-family: inherit;
    font-size: 13px;
    background: transparent;
}

.var-chip {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 999px;
    border: 1px solid #5b4cd0;
    background: #f4eeff;
    color: #5b4cd0;
    font-size: 12px;
}

.subsection-extra {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px 16px;
    margin: 8px 0 4px;
    margin-bottom: 20px;
}

.subsection-extra .field {
    align-items: flex-start;
    flex-direction: column;
}

.subsection-input,
.subsection-select {
    width: 100%;
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.clauses-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.clause-item {
    display: grid;
    grid-template-columns: auto auto 1fr auto;
    align-items: flex-start;
    column-gap: 8px;
    padding: 10px 12px;
    border-radius: 6px;
    background: #ffffff;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}

.clause-item:hover {
    background: #faf7ff;
}

.clause-handle {
    border: none;
    background: transparent;
    cursor: grab;
    padding: 4px 0;
    color: #4b5563;
}

.clause-number {
    font-size: 13px;
    font-weight: 600;
    color: #4b5563;
    text-align: right;
    padding-right: 8px;

    flex: 0 0 auto;
    /* ⭐ Se adapta al tamaño del texto */
    white-space: nowrap;
}


.clause-text {
    margin: 0;
    font-size: 13px;
    line-height: 1.4;
    color: #111827;
    overflow: hidden;
    overflow-wrap: anywhere;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.clause-title {
    font-weight: 700;
    text-transform: uppercase;
}

.clause-edit {
    border: none;
    background: transparent;
    cursor: pointer;
    color: #5b4cd0;
    padding: 4px;
    border-radius: 999px;
}

.clause-edit:hover {
    background: #efe9ff;
}

.subsection-item.unified {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, .06);
    /* overflow: hidden; */
    /* 🔥 CLAVE para que no se vean cortes */
    display: flex;
    flex-direction: column;
}

/* header */
.subsection-header {
    position: relative;
    padding: 10px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

/* contenido */
.subsection-content {
    padding: 12px;
    border-top: 1px solid #eee;
    /* opcional */
}

.drag-over {
    background: #f3ebff !important;
    transform: scale(1.01);
    transition: .15s ease;
}

.clause-item[draggable="true"] {
    cursor: grab;
}

.clause-item:active {
    cursor: grabbing;
}

.clause-separator {
    margin: 0 2px;
    color: #4b5563;
}

.subsection-dropdown {
    position: absolute;
    right: 0;
    top: 32px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 50;
}

/* --- EFECTO SHIMMER PRO --- */
@keyframes shimmer {
    0% {
        background-position: -400px 0;
    }

    100% {
        background-position: 400px 0;
    }
}

.skeleton {
    background: linear-gradient(90deg,
            #eeeeee 25%,
            #f5f5f9 50%,
            #eeeeee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 10px;
}

/* TÍTULO */
.skeleton-title {
    width: 320px;
    height: 28px;
}

/* TOOLBAR PRINCIPAL */
.skeleton-toolbar {
    background: #faf7ff;
    border-radius: 14px;
    padding: 24px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
}

/* Bloques de toolbar */
.skeleton-toolbar-block {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.skeleton-label {
    width: 110px;
    height: 16px;
}

.skeleton-input {
    width: 85px;
    height: 34px;
    border-radius: 8px;
}

/* Íconos cuadrado/redondo */
.skeleton-icon-square {
    width: 52px;
    height: 52px;
    border-radius: 12px;
}

.skeleton-icon-small {
    width: 26px;
    height: 26px;
    border-radius: 8px;
}

/* --- SECCIÓN COLLAPSABLE --- */
.skeleton-section {
    background: #f8f4ff;
    border-radius: 14px;
    padding: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
}

.skeleton-section-title {
    width: 220px;
    height: 20px;
}

.skeleton-section-actions {
    display: flex;
    gap: 14px;
}

.skeleton-circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
}

/* --- BOTONES INFERIORES --- */
.skeleton-footer {
    display: flex;
    justify-content: flex-end;
    gap: 14px;
    margin-top: 30px;
}

.skeleton-button {
    width: 170px;
    height: 38px;
    border-radius: 10px;
}

/* GRID de 2 columnas para márgenes */
.skeleton-margins-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px 24px;
    margin-top: 8px;
}

/* SKELETON VARIABLES */
/* === Shimmer Effect === */
@keyframes shimmer {
    0% {
        background-position: -400px 0;
    }

    100% {
        background-position: 400px 0;
    }
}

.skeleton-block {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 8px;
}

/* === CONTENEDOR VARIABLES === */
.variables-skeleton {
    padding: 20px;
}

/* Tabs */
.variables-tabs {
    display: flex;
    gap: 26px;
    padding-bottom: 14px;
    border-bottom: 2px solid #eee;
    margin-bottom: 20px;
}

.skeleton-tab {
    width: 90px;
    height: 20px;
    border-radius: 6px;
}

/* GRUPOS */
.skeleton-group {
    margin-bottom: 26px;
}

.skeleton-group-title {
    display: flex;
    align-items: center;
    gap: 10px;
}

.skeleton-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

/* Título del grupo */
.skeleton-title {
    width: 140px;
    height: 18px;
    border-radius: 4px;
}

/* CHIPS */
.skeleton-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 14px;
}

.skeleton-chip {
    width: 120px;
    height: 26px;
    border-radius: 8px;
}

@media (max-width: 1200px) {
    .split.with-panel {
        grid-template-columns: minmax(0, 1fr) 320px;
        gap: 16px;
    }

    .toolbar {
        display: grid;
        grid-template-columns: minmax(280px, 2fr) minmax(160px, 1fr) minmax(160px, 1fr) minmax(140px, 1fr);
        gap: 12px;
        padding: 12px 16px;
        background: #fbf9ff;
        border-radius: 12px;
        align-items: stretch;
    }

    .toolbar-divider,
    .toolbar-flex-spacer {
        display: none;
    }

    .toolbar-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: #fff;
        border: 1px solid #ece7ff;
        border-radius: 10px;
        padding: 12px;
        min-width: 0;
    }

    .subsection-card-toolbar {
        display: grid;
        grid-template-columns: minmax(180px, 220px) 1fr;
        gap: 12px;
        align-items: end;
        margin-bottom: 12px;
    }

    .subsection-extra {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin: 12px 0 16px;
    }

    .section-header,
    .subsection-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }

    .section-right,
    .subsection-actions,
    .sections-footer {
        flex-wrap: wrap;
    }

    @media (max-width: 1200px) {
        .toolbar {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 1100px) {
        .split.with-panel {
            grid-template-columns: 1fr;
        }

        .slide-panel {
            order: 2;
        }
    }

    @media (max-width: 768px) {

        .toolbar,
        .subsection-card-toolbar,
        .subsection-extra {
            grid-template-columns: 1fr;
        }

        .sections-footer {
            flex-direction: column;
        }

        .sections-add-btn {
            width: 100%;
            justify-content: center;
        }

        .nav-tabs {
            display: flex;
            overflow-x: auto;
            gap: 4px;
        }

        .tab {
            flex: 0 0 auto;
            min-width: 120px;
        }

        .underline {
            display: none;
        }
    }
}

.field-with-error {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
}
</style>