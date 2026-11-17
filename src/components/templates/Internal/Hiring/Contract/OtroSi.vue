<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineAsyncComponent } from 'vue'
import AdvancedEditor from '@/components/UI/templates/AdvancedEditor.vue'

// ---------------- PROPS ----------------
const props = defineProps({ configuration: Object })
const emit = defineEmits(['management', 'store'])

const sections = ref([])

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

// ---------------- LISTAS / CLÁUSULAS ----------------
const activeSubsection = ref(null)
const editingClause = ref(null)

const clauseTitle = ref("")
const clauseContent = ref("")
const uuid = () => crypto.randomUUID()

watch(
    () => props.configuration,
    (conf) => {
        if (!conf || !conf.settings) return
        const settings = conf.settings


        sections.value = settings.sections
            ? JSON.parse(JSON.stringify(settings.sections))
            : []

        sections.value.forEach(section => {
            if (!section.id) section.id = crypto.randomUUID()

            section.open = false
            section.isEditing = false
            section.tempTitle = section.title

            // asegurar settings
            section.settings = section.settings ?? {}
            section.settings.is_visible = section.settings.is_visible ?? true
            section.settings.is_editable = section.settings.is_editable ?? false

            // asegurar subsections
            section.subsections = section.subsections ?? []

            section.subsections.forEach(sub => {
                if (!sub.id) sub.id = crypto.randomUUID()

                sub.open = false

                sub.settings = sub.settings ?? {}
                sub.settings.is_visible = sub.settings.is_visible ?? true
                sub.settings.is_editable = sub.settings.is_editable ?? false

                sub.allowEdit = sub.settings.is_editable
                sub.type = sub.entry_type === "list" ? "Lista" : "Texto"
                sub.list_type = sub.list_type ?? "alphabetic"

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

const addSection = () => {

    sections.value.push({
        id: uuid(),
        title: "Define el título de la sección",
        tempTitle: "Define el título de la sección",
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
    if (section.tempTitle.trim()) section.title = section.tempTitle.trim()
    section.isEditing = false
}


const toggleSubsection = (sub) => {
    sub.open = !sub.open

    if (sub.open) {
        activeSubsection.value = sub
        editingClause.value = null
        clauseTitle.value = ""
        clauseContent.value = ""
    }
}

const deleteSubsection = (section, sub) => {
    section.subsections = section.subsections.filter(s => s.id !== sub.id)
    section.subsectionsCount = section.subsections.length
    openSubMenuId.value = null
}

// ---------------- CLÁUSULAS ----------------
const cleanHtml = (html) => {
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
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

// ---------------- INFORMACIÓN GENERAL DEL OTROSÍ ----------------
const generalOpen = ref(false)

const toggleGeneral = () => {
    generalOpen.value = !generalOpen.value
}

const editGeneral = ref(false)

const toggleEditGeneral = () => {
    editGeneral.value = !editGeneral.value
}

const generalInfo = ref({
    tipoOtrosi: '',
    codigo: '',
    cargo: '',
    valorContrato: '',
    periodoPago: '',
    auxilioTransporte: '',
    fechaInicio: '',
    fechaFin: '',
    duracion: 0,
    observacion: ''
})

const editWorker = ref(false)

const toggleEditWorker = () => {
    editWorker.value = !editWorker.value
}

const workerInfo = ref({
    // Datos personales
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    estadoCivil: '',     // id / value del SearchSelect
    genero: '',          // id / value del SearchSelect

    // Datos del documento
    tipoDocumento: '',   // id / value del SearchSelect
    numeroDocumento: '',
    fechaExpedicion: '',
    paisDocumento: '',   // id / value del SearchSelect
    deptoDocumento: '',  // id / value del SearchSelect
    ciudadDocumento: '', // id / value del SearchSelect

    // Lugar y fecha de nacimiento
    paisNacimiento: '',
    deptoNacimiento: '',
    ciudadNacimiento: '',
    fechaNacimiento: '',

    // Datos contacto
    prefijoTelefono: '', // ej: "+57"
    telefono: '',
    email: '',

    // Residencia actual
    paisResidencia: '',
    deptoResidencia: '',
    ciudadResidencia: '',
    direccion: '',
    barrio: '',
})

const editEmployer = ref(false)

const toggleEditEmployer = () => {
    editEmployer.value = !editEmployer.value
}

const employerInfo = ref({
    // ===== Datos de la empresa =====
    paisEmpresa: '',
    deptoEmpresa: '',
    ciudadEmpresa: '',
    empresa: '',
    entidad: '',
    nit: '',
    sede: '',
    direccionEmpresa: '',
    prefijoTelefonoEmpresa: '',
    telefonoEmpresa: '',
    emailEmpresa: '',

    // ===== Representante legal =====
    repPrimerNombre: '',
    repSegundoNombre: '',
    repPrimerApellido: '',
    repSegundoApellido: '',
    repCiudad: '',
    repTipoDocumento: '',
    repNumeroDocumento: '',
    repPrefijoTelefono: '',
    repTelefono: '',
    repEmail: '',
})

const preview = ref({ url: '', name: '' })
const showPreview = ref(false)

function openPreview(doc) {
    const url = 'http://transformacion_digital-recursos_humanos-backend.test/storage/Person/7rxCG1a6NosbJySMCf1FVfKs4DTSs5RRbfL6Yn86.pdf'
    const name = 'Exámenes_médicos.pdf'
    preview.value = { url: url || '', name: name || 'Documento.pdf' }

    // Se comentarea temporalmente, para cuando se haga conexión con el backend
    // preview.value = { url: doc?.url || '', name: doc?.name || 'Documento.pdf' }
    showPreview.value = true
}

const PdfPreview = defineAsyncComponent(() => import('../../../../UI/templates/PDFPreview.vue'))

watch(showPreview, (visible) => {
    document.body.style.overflow = visible ? 'hidden' : ''
})

</script>

<template>
    <div class="breadcrumb">
        <button type="button" class="crumb-back" @click="emit('management')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0" viewBox="0 0 256 256">
                <path
                    d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z">
                </path>
            </svg>
            <span>Volver</span>
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
        <span>Contratación</span>
        <span>|</span>
        <span>Gestión contrato</span>
        <span>|</span>
        <span class="active">Crear otrosí</span>
    </div>

    <div class="container-data">
        <div class="split">
            <div class="split-main">
                <div class="main-container">

                    <!-- TÍTULO -->
                    <div style="display: flex; justify-content: space-between;">
                        <h2 class="titulo">Crear otrosí</h2>
                        <button class="sections-add-btn" @click="openPreview(null)">
                            Vista previa
                        </button>
                    </div>
                    <template v-if="false">
                        <div class="otrosi-skeleton">

                            <!-- ====== ENCABEZADO PRINCIPAL ====== -->
                            <div class="sk-card">
                                <div style="display: flex; justify-content: space-between;">
                                    <div class="sk-line sk-title"></div>
                                    <div class="sk-circle"></div>
                                </div>


                                <!-- ====== CARD 1 ====== -->
                                <div class="sk-card">

                                    <!-- Título del card -->
                                    <div class="sk-section-header">
                                        <div class="sk-line sk-subtitle"></div>
                                        <div class="sk-circle"></div>
                                    </div>

                                    <div class="sk-divider"></div>

                                    <!-- GRID 4 columnas -->
                                    <div class="sk-grid">
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>

                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>

                                        <div class="sk-input sk-full"></div>
                                    </div>

                                    <!-- Textarea -->
                                    <div class="sk-textarea"></div>
                                </div>

                                <!-- ====== CARD 2 ====== -->
                                <div class="sk-card">

                                    <div class="sk-section-header">
                                        <div class="sk-line sk-subtitle"></div>
                                        <div class="sk-circle"></div>
                                    </div>

                                    <div class="sk-divider"></div>

                                    <div class="sk-grid">
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                    </div>

                                </div>
                            </div>

                            <!-- ====== FOOTER ====== -->
                            <div class="sk-footer">
                                <div class="sk-button"></div>
                                <div class="sk-button"></div>
                            </div>

                        </div>
                    </template>
                    <template v-else>
                        <!-- COLAPSABLE: INFORMACIÓN GENERAL DEL OTROSÍ -->
                        <div class="general-card">
                            <div class="general-header">
                                <div class="general-title-group">
                                    <h3 class="section-title">Información general del otrosí</h3>
                                </div>

                                <button type="button" class="section-toggle" @click="toggleGeneral">
                                    <!-- aquí puedes poner tu ícono de chevron/editar -->
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#5b4cd0"
                                        viewBox="0 0 256 256" :style="{
                                            transform: generalOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                            transition: 'transform .18s'
                                        }">
                                        <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path>
                                        <path
                                            d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm29.66-93.66a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32L140.69,128,106.34,93.66a8,8,0,0,1,11.32-11.32Z">
                                        </path>
                                    </svg>
                                </button>
                            </div>

                            <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                                <div v-show="generalOpen" class="general-body">
                                    <div class="card">
                                        <div class="header">
                                            <p class="section-subtitle">Información relevante</p>
                                            <Button :title="editGeneral ? 'Bloquear' : 'Editar'" icon="pencil"
                                                variant="question" @click="toggleEditGeneral" />
                                        </div>

                                        <hr class="card-separator" />

                                        <!-- GRID PRINCIPAL -->
                                        <div class="general-grid">

                                            <!-- Tipo de otrosí -->
                                            <div>
                                                <label class="label-bold">Tipo de otrosí</label>
                                                <SearchSelect :options="[]" optionKey="settings.abreviature"
                                                    valueKey="id" name="entity_type_id" id="entity_type_id"
                                                    placeholder="Tipo de otrosí" v-model="generalInfo.tipoOtrosi"
                                                    :disabled="!editGeneral" />
                                            </div>

                                            <!-- Código -->
                                            <div>
                                                <label class="label-bold">Código</label>
                                                <input v-model="generalInfo.codigo" type="text" class="input-box"
                                                    :class="{ 'disabled': !editGeneral }" placeholder="00.000.0000"
                                                    :disabled="!editGeneral" />
                                            </div>

                                            <!-- Cargo -->
                                            <div>
                                                <label class="label-bold">Cargo</label>
                                                <SearchSelect :options="[]" optionKey="settings.abreviature"
                                                    valueKey="id" name="entity_type_id" id="entity_type_id"
                                                    placeholder="Cargo" v-model="generalInfo.cargo"
                                                    :disabled="!editGeneral" />
                                            </div>

                                            <!-- Valor del contrato -->
                                            <div>
                                                <label class="label-bold">Valor del contrato</label>
                                                <input v-model="generalInfo.valorContrato" type="text" class="input-box"
                                                    :class="{ 'disabled': !editGeneral }" placeholder="00.000.0000"
                                                    :disabled="!editGeneral" />
                                            </div>

                                            <!-- Periodo de pago -->
                                            <div>
                                                <label class="label-bold">Periodo de pago</label>
                                                <SearchSelect :options="[]" optionKey="settings.abreviature"
                                                    valueKey="id" name="entity_type_id" id="entity_type_id"
                                                    placeholder="Periodo de pago" v-model="generalInfo.periodoPago"
                                                    :disabled="!editGeneral" />
                                            </div>

                                            <!-- Auxilio de transporte -->
                                            <div>
                                                <label class="label-bold">Auxilio de transporte</label>
                                                <input v-model="generalInfo.auxilioTransporte" type="text"
                                                    class="input-box" :class="{ 'disabled': !editGeneral }"
                                                    placeholder="Auxilio de transporte" :disabled="!editGeneral" />
                                            </div>

                                            <!-- Fecha inicio -->
                                            <div>
                                                <label class="label-bold">Fecha inicio</label>
                                                <input v-model="generalInfo.fechaInicio" type="date" class="input-box"
                                                    :class="{ 'disabled': !editGeneral }" :disabled="!editGeneral" />
                                            </div>

                                            <!-- Fecha fin -->
                                            <div>
                                                <label class="label-bold">Fecha fin</label>
                                                <input v-model="generalInfo.fechaFin" type="date" class="input-box"
                                                    :class="{ 'disabled': !editGeneral }" :disabled="!editGeneral" />
                                            </div>

                                            <!-- Duración del otrosí -->
                                            <div style="grid-column: span 2;">
                                                <label class="label-bold">Duración del otrosí</label>
                                                <input v-model.number="generalInfo.duracion" type="number" min="0"
                                                    class="input-box" :class="{ 'disabled': !editGeneral }"
                                                    placeholder="0" :disabled="!editGeneral" />
                                            </div>

                                        </div>

                                        <!-- Observación (fila completa) -->
                                        <div class="">
                                            <label class="label-bold" for="description">Descripción</label>

                                            <div class="textarea-wrapper">
                                                <textarea v-model="generalInfo.observacion" name="description"
                                                    id="description" placeholder="Descripción" maxlength="500"
                                                    class="text-area" :class="{ 'disabled': !editGeneral }"
                                                    :disabled="!editGeneral"></textarea>

                                                <div class="char-limit-text">
                                                    ({{ (generalInfo.observacion || '').length }}/500)
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="editGeneral" class="form-actions">
                                            <button class="sections-add-btn">
                                                <span>Guardar</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="header">
                                            <p class="section-subtitle">Información del trabajador</p>

                                            <Button :title="editWorker ? 'Bloquear' : 'Editar'" icon="pencil"
                                                variant="question" @click="toggleEditWorker" />
                                        </div>

                                        <hr class="card-separator" />

                                        <!-- ========== DATOS PERSONALES ========== -->
                                        <p class="section-subtitle" style="margin-top: 10px;">Datos personales</p>
                                        <div class="general-grid general-grid--4cols">

                                            <!-- Primer nombre -->
                                            <div>
                                                <label class="label-bold">Primer nombre</label>
                                                <input v-model="workerInfo.primerNombre" type="text" class="input-box"
                                                    :class="{ 'disabled': !editWorker }" placeholder="Primer nombre"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <!-- Segundo nombre -->
                                            <div>
                                                <label class="label-bold">Segundo nombre (Opcional)</label>
                                                <input v-model="workerInfo.segundoNombre" type="text" class="input-box"
                                                    :class="{ 'disabled': !editWorker }" placeholder="Segundo nombre"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <!-- Primer apellido -->
                                            <div>
                                                <label class="label-bold">Primer apellido</label>
                                                <input v-model="workerInfo.primerApellido" type="text" class="input-box"
                                                    :class="{ 'disabled': !editWorker }" placeholder="Primer apellido"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <!-- Segundo apellido -->
                                            <div>
                                                <label class="label-bold">Segundo apellido</label>
                                                <input v-model="workerInfo.segundoApellido" type="text"
                                                    class="input-box" :class="{ 'disabled': !editWorker }"
                                                    placeholder="Segundo apellido" :disabled="!editWorker" />
                                            </div>

                                            <!-- Estado civil -->
                                            <div>
                                                <label class="label-bold">Estado civil</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    v-model="workerInfo.estadoCivil" placeholder="Estado civil"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <!-- Género -->
                                            <div>
                                                <label class="label-bold">Género</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    v-model="workerInfo.genero" placeholder="Género"
                                                    :disabled="!editWorker" />
                                            </div>
                                        </div>


                                        <div class="card-separator"></div>

                                        <!-- ========== DATOS DEL DOCUMENTO ========== -->
                                        <p class="section-subtitle">Datos del documento</p>
                                        <div class="general-grid general-grid--4cols">

                                            <div class="form-group">
                                                <label class="label-bold">Documento</label>
                                                <div class="row-2">
                                                    <SearchSelect :options="[]" class="select-duo" placeholder="Tipo"
                                                        v-model="workerInfo.tipoDocumento" :disabled="!editWorker" />
                                                    <input v-model="workerInfo.numeroDocumento" type="text"
                                                        class="input-box input-duo" :class="{ 'disabled': !editWorker }"
                                                        :disabled="!editWorker" placeholder="Documento" />
                                                </div>
                                            </div>

                                            <!-- Fecha expedicion -->
                                            <div>
                                                <label class="label-bold">Fecha de expedición</label>
                                                <input v-model="workerInfo.fechaExpedicion" type="date"
                                                    class="input-box" :class="{ 'disabled': !editWorker }"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <!-- Pais -->
                                            <div>
                                                <label class="label-bold">País</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    v-model="workerInfo.paisDocumento" placeholder="País"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <!-- Dept -->
                                            <div>
                                                <label class="label-bold">Departamento</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    v-model="workerInfo.deptoDocumento" placeholder="Departamento"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <!-- Ciudad -->
                                            <div>
                                                <label class="label-bold">Ciudad</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    v-model="workerInfo.ciudadDocumento" placeholder="Ciudad"
                                                    :disabled="!editWorker" />
                                            </div>
                                        </div>

                                        <div class="card-separator"></div>

                                        <!-- ========== LUGAR Y FECHA NACIMIENTO ========== -->
                                        <p class="section-subtitle">Lugar y fecha de nacimiento</p>

                                        <div class="general-grid general-grid--4cols">

                                            <div>
                                                <label class="label-bold">País</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    v-model="workerInfo.paisNacimiento" placeholder="País"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <div>
                                                <label class="label-bold">Departamento</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    v-model="workerInfo.deptoNacimiento" placeholder="Departamento"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <div>
                                                <label class="label-bold">Ciudad</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    v-model="workerInfo.ciudadNacimiento" placeholder="Ciudad"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <div>
                                                <label class="label-bold">Fecha</label>
                                                <input v-model="workerInfo.fechaNacimiento" type="date"
                                                    class="input-box" :class="{ 'disabled': !editWorker }"
                                                    :disabled="!editWorker" />
                                            </div>
                                        </div>


                                        <div class="card-separator"></div>

                                        <!-- ========== DATOS CONTACTO ========== -->
                                        <p class="section-subtitle">Datos contacto</p>

                                        <div class="general-grid general-grid--4cols">

                                            <div>
                                                <label class="label-bold">Teléfono</label>
                                                <div class="row-2">
                                                    <SearchSelect class="select-duo" :options="[]" optionKey="label"
                                                        valueKey="value" placeholder="Prefijo"
                                                        v-model="workerInfo.prefijoTelefono" :disabled="!editWorker" />

                                                    <input v-model="workerInfo.telefono" type="text"
                                                        class="input-box input-duo" :class="{ 'disabled': !editWorker }"
                                                        placeholder="Teléfono" :disabled="!editWorker" />
                                                </div>
                                            </div>

                                            <div style="grid-column: span 3;">
                                                <label class="label-bold">Correo electrónico</label>
                                                <input v-model="workerInfo.email" type="email" class="input-box"
                                                    :class="{ 'disabled': !editWorker }"
                                                    placeholder="correo@ejemplo.com" :disabled="!editWorker" />
                                            </div>
                                        </div>

                                        <div class="card-separator"></div>

                                        <!-- ========== RESIDENCIA ACTUAL ========== -->
                                        <p class="section-subtitle">Residencia actual</p>

                                        <div class="general-grid general-grid--4cols">

                                            <div>
                                                <label class="label-bold">País</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    placeholder="País" v-model="workerInfo.paisResidencia"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <div>
                                                <label class="label-bold">Departamento</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    placeholder="Departamento" v-model="workerInfo.deptoResidencia"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <div>
                                                <label class="label-bold">Ciudad</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    placeholder="Ciudad" v-model="workerInfo.ciudadResidencia"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <div>
                                                <label class="label-bold">Dirección</label>
                                                <input v-model="workerInfo.direccion" type="text" class="input-box"
                                                    :class="{ 'disabled': !editWorker }" placeholder="Calle 0 carrera 0"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <div>
                                                <label class="label-bold">Barrio</label>
                                                <input v-model="workerInfo.barrio" type="text" class="input-box"
                                                    :class="{ 'disabled': !editWorker }" placeholder="Barrio"
                                                    :disabled="!editWorker" />
                                            </div>
                                        </div>
                                        <div v-if="editWorker" class="form-actions">
                                            <button class="sections-add-btn">
                                                <span>Guardar</span>
                                            </button>
                                        </div>

                                    </div>
                                    <div class="card">
                                        <div class="header">
                                            <p class="section-subtitle">Información del empleador</p>

                                            <Button :title="editEmployer ? 'Bloquear' : 'Editar'" icon="pencil"
                                                variant="question" @click="toggleEditEmployer" />
                                        </div>

                                        <hr class="card-separator" />

                                        <!-- ========== DATOS DE LA EMPRESA ========== -->
                                        <p class="section-subtitle">Datos de la empresa</p>
                                        <div class="general-grid general-grid--4cols">

                                            <!-- País -->
                                            <div>
                                                <label class="label-bold">País</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    placeholder="País" v-model="employerInfo.paisEmpresa"
                                                    :disabled="!editEmployer" />
                                            </div>

                                            <!-- Departamento -->
                                            <div>
                                                <label class="label-bold">Departamento</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    placeholder="Departamento" v-model="employerInfo.deptoEmpresa"
                                                    :disabled="!editEmployer" />
                                            </div>

                                            <!-- Ciudad -->
                                            <div>
                                                <label class="label-bold">Ciudad</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    placeholder="Ciudad" v-model="employerInfo.ciudadEmpresa"
                                                    :disabled="!editEmployer" />
                                            </div>

                                            <!-- Empresa -->
                                            <div>
                                                <label class="label-bold">Empresa</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    placeholder="Empresa" v-model="employerInfo.empresa"
                                                    :disabled="!editEmployer" />
                                            </div>

                                            <!-- Entidad -->
                                            <div>
                                                <label class="label-bold">Entidad</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    placeholder="Entidad" v-model="employerInfo.entidad"
                                                    :disabled="!editEmployer" />
                                            </div>

                                            <!-- NIT -->
                                            <div>
                                                <label class="label-bold">NIT</label>
                                                <input v-model="employerInfo.nit" type="text" class="input-box"
                                                    placeholder="900.000.000-0" :disabled="!editEmployer"
                                                    :class="{ disabled: !editEmployer }" />
                                            </div>

                                            <!-- Sede -->
                                            <div>
                                                <label class="label-bold">Sede</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    placeholder="Nombre de sede" v-model="employerInfo.sede"
                                                    :disabled="!editEmployer" />
                                            </div>

                                            <!-- Dirección -->
                                            <div>
                                                <label class="label-bold">Dirección</label>
                                                <input v-model="employerInfo.direccionEmpresa" type="text"
                                                    class="input-box" placeholder="Calle 0 carrera 0"
                                                    :disabled="!editEmployer" :class="{ disabled: !editEmployer }" />
                                            </div>

                                            <!-- Teléfono -->
                                            <div>
                                                <label class="label-bold">Teléfono</label>
                                                <div class="row-2">
                                                    <SearchSelect class="select-duo" :options="[]" optionKey="label"
                                                        valueKey="value" placeholder="+57"
                                                        v-model="employerInfo.prefijoTelefonoEmpresa"
                                                        :disabled="!editEmployer" />

                                                    <input v-model="employerInfo.telefonoEmpresa" type="text"
                                                        class="input-box input-duo" placeholder="Número de teléfono"
                                                        :disabled="!editEmployer"
                                                        :class="{ disabled: !editEmployer }" />
                                                </div>
                                            </div>

                                            <!-- Correo electrónico -->
                                            <div style="grid-column: span 3;">
                                                <label class="label-bold">Correo electrónico</label>
                                                <input v-model="employerInfo.emailEmpresa" type="email"
                                                    class="input-box" placeholder="empresa@correo.com"
                                                    :disabled="!editEmployer" :class="{ disabled: !editEmployer }" />
                                            </div>
                                        </div>

                                        <hr class="card-separator" />

                                        <!-- ========== REPRESENTANTE LEGAL ========== -->
                                        <p class="section-subtitle">Representante legal</p>

                                        <div class="general-grid general-grid--4cols">

                                            <!-- Primer nombre -->
                                            <div>
                                                <label class="label-bold">Primer nombre</label>
                                                <input type="text" class="input-box" placeholder="Primer nombre"
                                                    v-model="employerInfo.repPrimerNombre" :disabled="!editEmployer"
                                                    :class="{ disabled: !editEmployer }" />
                                            </div>

                                            <!-- Segundo nombre -->
                                            <div>
                                                <label class="label-bold">Segundo nombre (opcional)</label>
                                                <input type="text" class="input-box" placeholder="Segundo nombre"
                                                    v-model="employerInfo.repSegundoNombre" :disabled="!editEmployer"
                                                    :class="{ disabled: !editEmployer }" />
                                            </div>

                                            <!-- Primer apellido -->
                                            <div>
                                                <label class="label-bold">Primer apellido</label>
                                                <input type="text" class="input-box" placeholder="Primer apellido"
                                                    v-model="employerInfo.repPrimerApellido" :disabled="!editEmployer"
                                                    :class="{ disabled: !editEmployer }" />
                                            </div>

                                            <!-- Segundo apellido -->
                                            <div>
                                                <label class="label-bold">Segundo apellido (opcional)</label>
                                                <input type="text" class="input-box" placeholder="Segundo apellido"
                                                    v-model="employerInfo.repSegundoApellido" :disabled="!editEmployer"
                                                    :class="{ disabled: !editEmployer }" />
                                            </div>

                                            <!-- Ciudad -->
                                            <div>
                                                <label class="label-bold">Ciudad</label>
                                                <SearchSelect :options="[]" optionKey="label" valueKey="value"
                                                    placeholder="Ciudad" v-model="employerInfo.repCiudad"
                                                    :disabled="!editEmployer" />
                                            </div>

                                            <!-- Documento -->
                                            <div>
                                                <label class="label-bold">Documento</label>
                                                <div class="row-2">
                                                    <SearchSelect class="select-duo" :options="[]" optionKey="label"
                                                        valueKey="value" placeholder="Tipo"
                                                        v-model="employerInfo.repTipoDocumento"
                                                        :disabled="!editEmployer" />

                                                    <input v-model="employerInfo.repNumeroDocumento" type="text"
                                                        class="input-box input-duo" placeholder="Número"
                                                        :disabled="!editEmployer"
                                                        :class="{ disabled: !editEmployer }" />
                                                </div>
                                            </div>

                                            <!-- Teléfono -->
                                            <div>
                                                <label class="label-bold">Teléfono</label>
                                                <div class="row-2">
                                                    <SearchSelect class="select-duo" :options="[]" optionKey="label"
                                                        valueKey="value" placeholder="+57"
                                                        v-model="employerInfo.repPrefijoTelefono"
                                                        :disabled="!editEmployer" />

                                                    <input v-model="employerInfo.repTelefono" type="text"
                                                        class="input-box input-duo" placeholder="Número de teléfono"
                                                        :disabled="!editEmployer"
                                                        :class="{ disabled: !editEmployer }" />
                                                </div>
                                            </div>

                                            <!-- Correo -->
                                            <div>
                                                <label class="label-bold">Correo electrónico</label>
                                                <input v-model="employerInfo.repEmail" type="email" class="input-box"
                                                    placeholder="correo@ejemplo.com" :disabled="!editEmployer"
                                                    :class="{ disabled: !editEmployer }" />
                                            </div>

                                        </div>
                                        <div v-if="editEmployer" class="form-actions">
                                            <button class="sections-add-btn">
                                                <span>Guardar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </transition>

                        </div>

                        <div style="display: flex; flex-direction: column; gap: 10px;">
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
                                                    <input v-model="section.tempTitle" class="input-box"
                                                        @keyup.enter="saveSectionTitle(section)" />
                                                </template>

                                                <!-- NORMAL -->
                                                <template v-else>
                                                    <span class="section-title">{{
                                                        section.title }}</span>
                                                </template>
                                            </div>

                                            <div class="section-right">
                                                <span class="section-pill">
                                                    {{ section.subsectionsCount }} subsecciones
                                                </span>

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


                                                <!-- LISTA DE SUBSECCIONES (PREÁMBULO, CLÁUSULAS, etc.) -->
                                                <div v-if="section.subsections && section.subsections.length"
                                                    class="subsections-list">
                                                    <div v-for="sub in section.subsections" :key="sub.id"
                                                        class="subsection-item unified">
                                                        <!-- fila compacta -->
                                                        <div class="subsection-header">
                                                            <div class="section-left">
                                                                <span class="subsection-title">{{ sub.title
                                                                    }}</span>
                                                            </div>

                                                            <div class="subsection-actions">
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
                                                                <!-- aquí puedes meter tu editor rico; de momento un textarea -->
                                                                <div>
                                                                    <AdvancedEditor v-if="sub.type === 'Texto'"
                                                                        v-model="sub.content"
                                                                        :ref="el => registerEditorRef(`text-${sub.id}`, el)"
                                                                        @focus="handleEditorFocus(`text-${sub.id}`)" />
                                                                </div>
                                                                <template v-if="sub.type === 'Lista'">
                                                                    <div class="clauses-list">
                                                                        <div v-for="(clause, index) in sub.clauses"
                                                                            class="clause-item" draggable="true"
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
                                                                                    <span> {{ cleanHtml(clause.text) }}
                                                                                    </span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </template>
                                                            </div>
                                                        </transition>
                                                    </div>
                                                </div>
                                            </div>
                                        </transition>
                                    </div>
                                </div>

                                <!-- BOTÓN "AGREGAR SECCIÓN" ABAJO -->
                                <div class="sections-footer">
                                    <button class="sections-cancel-btn" @click="emit('management')">
                                        <span>Cancelar</span>
                                    </button>
                                    <button class="sections-add-btn" @click="emit('store')">
                                        Crear otrosí
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>

                </div>
            </div>
        </div>
    </div>
    <pdfPreview v-if="showPreview && preview.url" :key="preview.url" :show="showPreview" :pdfUrl="preview.url"
        :pdfName="preview.name" @close="showPreview = false" />
</template>

<style scoped>
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
    height: auto !important;
    width: auto !important;
    align-self: flex-start;
}

.sections-add-btn:hover {
    filter: brightness(0.95);
}

.sections-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 5px;
    border: 1px solid #5b4cd0;
    background: #ffffff;
    color: #5b4cd0;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
}

.sections-cancel-btn:hover {
    filter: brightness(0.95);
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
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

.section-title {
    font: 500 18px Poppins, sans-serif;
    color: #5B4CD0;
    font-weight: bold;
}

.section-subtitle {
    font: 500 14px Poppins, sans-serif;
    color: #5B4CD0;
    font-weight: bold;
}

.general-card {
    background: #fff;
    border-radius: 10px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 5px 10px 5px 10px;
    margin-bottom: 15px;
}

.card {
    background: #fff;
    border-radius: 10px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 5px 10px 5px 10px;
    margin-bottom: 5px;
    padding: 20px;
}

.general-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.general-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

.row-2 {
    display: grid;
    grid-template-columns: 120px 1fr;
}

:deep(.select-duo) {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}

.input-duo {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
}

.card-separator {
    width: 100% !important;
    display: block !important;
    border: 0;
    border-top: 1px solid #efe7ff;
    margin: 16px 0;
}

.separadores {
    margin: 0;
    margin-top: 20px;
    background-color: #E3DFFF;
    width: 100%;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* === EFECTO SHIMMER REAL === */
.sk-line,
.sk-input,
.sk-circle,
.sk-button,
.sk-textarea,
.sk-badge {
    background: linear-gradient(90deg, #ececec 25%, #f4f4f4 50%, #ececec 75%);
    background-size: 400% 100%;
    animation: loadingShimmer 1.3s infinite;
}

@keyframes loadingShimmer {
    0% {
        background-position: -400px 0;
    }

    100% {
        background-position: 400px 0;
    }
}

/* ===== WRAPPER ===== */
.otrosi-skeleton {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

/* ===== CARDS ===== */
.sk-card {
    background: white;
    padding: 26px;
    border-radius: 16px;
    border: 1px solid #efe7ff;
    display: flex;
    flex-direction: column;
    gap: 22px;
}

/* ENCABEZADOS */
.sk-header,
.sk-subheader {
    display: flex;
    align-items: center;
    padding: 22px;
    border-radius: 16px;
    border: 1px solid #efe7ff;
}

/* Títulos */
.sk-title {
    width: 320px;
    height: 20px;
    border-radius: 10px;
}

.sk-subtitle {
    width: 180px;
    height: 18px;
    border-radius: 8px;
}

/* Badge */
.sk-badge {
    width: 100px;
    height: 28px;
    border-radius: 12px;
    margin-left: auto;
    margin-right: 16px;
}

/* Circulitos (iconos) */
.sk-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
}

/* Divider */
.sk-divider {
    width: 100%;
    height: 1px;
    background: #efe7ff;
}

/* GRID DE INPUTS */
.sk-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.sk-input {
    height: 48px;
    border-radius: 12px;
}

.sk-input.sk-full {
    grid-column: span 2;
}

/* Textarea */
.sk-textarea {
    height: 140px;
    border-radius: 14px;
}

/* Sección Header Card */
.sk-section-header {
    display: flex;
    align-items: center;
    gap: 14px;
}

.sk-section-header .sk-circle {
    margin-left: auto;
}

/* Footer */
.sk-footer {
    display: flex;
    justify-content: flex-end;
    gap: 14px;
}

.sk-button {
    width: 160px;
    height: 42px;
    border-radius: 12px;
}
</style>