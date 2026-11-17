<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineAsyncComponent, computed } from 'vue'
import AdvancedEditor from '@/components/UI/templates/AdvancedEditor.vue'
import DateInput from '@/components/UI/templates/DateInput.vue'

// ---------------- PROPS ----------------
const props = defineProps({
    modelApplication: Object,
    modelContract: Object,
    modelPerson: Object,
    modelHeadquarter: Object,
    modelLegalRepresentative: Object,
    paymentPeriods: Array,
    positions: Array,
    countries: Array,
    departaments: { type: Object, default: () => ({}) },
    cities: { type: Object, default: () => ({}) },
    contractTypes: Array,
    documentTypes: { type: Object, default: () => ({}) },
    maritalStatuses: Array,
    sexes: Array,
    enterprises: Array,
    entities: Array,
    headquarters: Array,
    configuration: Object,
    addAnnexesVariables: Boolean,
    hasContractTemplates: Boolean,
    loadingData: Boolean,
    errors: {
        type: Object,
        default: () => ({})
    }
})
const emit = defineEmits(['index', 'submitContractStore', 'addAnnexes'])

const variables = ref([])

// ---------------- UI ----------------
const isSizeOpen = ref(false)
const sizeSectionRef = ref(null)
const activeTab = ref(0)
const openMenuId = ref(null)
const openSubMenuId = ref(null)
const isOPS = computed(() => {
    return props.modelContract?.file_subtypes_id?.includes(113) || false
})

// ---------------- EDITOR ----------------
const activeEditorId = ref(null)
const editorRefs = {}

const registerEditorRef = (id, el) => { if (el) editorRefs[id] = el }
const handleEditorFocus = id => { activeEditorId.value = id }

// inserción de variable
const handleVariableClick = (field) => {
    const editor = editorRefs[activeEditorId.value]
    editor.insertVariable(
        `<span class="var-chip" id="${field.key}">[${field.label}]</span>`
    )
}

// ---------------- LISTAS / CLÁUSULAS ----------------
const activeSubsection = ref(null)
const editingClause = ref(null)

const clauseTitle = ref("")
const clauseContent = ref("")
const uuid = () => {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()

    const c = globalThis.crypto
    if (c?.getRandomValues) {
        const a = new Uint8Array(16)
        c.getRandomValues(a)
        a[6] = (a[6] & 0x0f) | 0x40
        a[8] = (a[8] & 0x3f) | 0x80
        const h = [...a].map(b => b.toString(16).padStart(2, "0")).join("")
        return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
    }

    return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
const contractMonths = ref(0)

watch(
    () => [
        props.modelContract?.start_date,
        props.modelContract?.end_date
    ],
    ([startDate, endDate]) => {
        if (!startDate || !endDate) {
            contractMonths.value = 0
            return
        }

        const start = new Date(startDate)
        const end = new Date(endDate)

        let months =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth())

        // Ajuste si el día final es menor al día inicial
        if (end.getDate() < start.getDate()) {
            months--
        }

        contractMonths.value = Math.max(months, 0)
    },
    { immediate: true }
)

watch(
    () => props.modelContract?.settings?.documents,
    (documents) => {
        if (!Array.isArray(documents)) return

        documents.forEach((document) => {
            if (document.__normalized) return

            const settings = document?.template?.settings
            if (!settings) return

            document.template.settings.sections = normalizeSections(settings)
            document.__normalized = true // 👈 CLAVE
        })
    },
    { immediate: true }
)


const normalizeSections = (settings) => {
    const sections = settings?.sections
        ? JSON.parse(JSON.stringify(settings.sections))
        : []

    sections.forEach(section => {
        if (!section.id) section.id = uuid()

        section.open = false
        section.isEditing = false
        section.tempTitle = section.title
        section.isLocked = true

        section.settings = section.settings ?? {}
        section.settings.is_visible ??= true
        section.settings.is_editable ??= false

        section.subsections = section.subsections ?? []

        section.subsections.forEach(sub => {

            if (!sub.id) sub.id = uuid()

            sub.open = false
            sub.isLocked = true

            sub.settings = sub.settings ?? {}
            sub.settings.is_visible ??= true
            sub.settings.is_editable ??= false

            sub.allowEdit = sub.settings.is_editable
            sub.type = sub.entry_type === 'list' ? 'Lista' : 'Texto'
            sub.list_type ??= 'alphabetic'

            if (sub.entry_type === 'list') {
                sub.clauses = (sub.items ?? []).map((item, i) => ({
                    id: i + 1,
                    title: item.title,
                    text: item.content
                }))
            } else {
                sub.content ??= ''
                sub.clauses = []
            }
        })

        section.subsectionsCount = section.subsections.length
    })

    return sections
}

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

const addSection = (sections) => {
    sections.push({
        id: uuid(),
        title: "Define el título de la sección",
        tempTitle: "Define el título de la sección",
        isEditing: true,
        open: false,
        visible: true,
        allowEdit: false,
        isLocked: false,

        settings: {
            is_visible: true,
            is_editable: false
        },

        subsectionsCount: 0,
        subsections: []
    })
}

const deleteSection = (sections, id) => {
    const index = sections.findIndex(section => section.id === id)
    if (index !== -1) {
        sections.splice(index, 1)
    }
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

const toggleSectionMenu = (id) => {
    openMenuId.value = openMenuId.value === id ? null : id
}

const addSubsection = (section) => {
    section.subsections.push({
        id: uuid(),
        title: "CLÁUSULA " + (section.subsections.length + 1),
        open: false,
        isLocked: false,
        type: "Texto",
        allowEdit: false,
        list_type: "alphabetic",
        content: "",
        clauses: []
    })

    section.subsectionsCount = section.subsections.length
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

const toggleSubMenu = (id) => {
    openSubMenuId.value = openSubMenuId.value === id ? null : id
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

const saveClause = () => {
    const sub = activeSubsection.value
    if (!sub) return

    if (!clauseTitle.value.trim() || !clauseContent.value.trim()) {
        return
    }

    if (editingClause.value) {
        editingClause.value.title = clauseTitle.value
        editingClause.value.text = sub.type === "Lista"
            ? cleanHtml(clauseContent.value)
            : clauseContent.value
    } else {
        sub.clauses.push({
            id: sub.clauses.length + 1,
            title: clauseTitle.value,
            text: sub.type === "Lista"
                ? cleanHtml(clauseContent.value)
                : clauseContent.value
        })
    }

    editingClause.value = null
    clauseTitle.value = ""
    clauseContent.value = ""
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

// ---------------- INFORMACIÓN GENERAL ----------------
const generalOpen = ref(false)

const toggleGeneral = () => {
    generalOpen.value = !generalOpen.value
}

const documentsOpen = ref([])

const toggleDocument = (index) => {
    const wasOpen = documentsOpen.value[index];

    documentsOpen.value = documentsOpen.value.map(() => false);

    if (!wasOpen) {
        documentsOpen.value[index] = true;
        variables.value = props.modelContract?.settings?.documents?.[index]?.variables ?? [];
    } else {
        variables.value = [];
    }
};

const editGeneral = ref(false)

const toggleEditGeneral = () => {
    editGeneral.value = !editGeneral.value
}

const editWorker = ref(false)

const toggleEditWorker = () => {
    editWorker.value = !editWorker.value
}

const editEmployer = ref(false)

const toggleEditEmployer = () => {
    editEmployer.value = !editEmployer.value
}

const preview = ref({ url: '', name: '' })
const showPreview = ref(false)

const PdfPreview = defineAsyncComponent(() => import('../../../../UI/templates/PDFPreview.vue'))

const selectedContractType = computed(() => {
    return props.contractTypes?.find(
        item => item.id === props.modelContract.contract_type_id
    ) || null
})

const selectedContractTypeName = computed(() => {
    return selectedContractType.value?.name || ''
})

watch(showPreview, (visible) => {
    document.body.style.overflow = visible ? 'hidden' : ''
})

const useThousandsFormat = (getModel, field, maxDigits = 11) => {
    return computed({
        get() {
            const model = getModel();
            const value = model?.[field];

            if (value === null || value === undefined || value === '') return '';

            return Number(value).toLocaleString('es-CO');
        },
        set(value) {
            const model = getModel();
            if (!model) return;

            const onlyNumbers = String(value)
                .replace(/\D/g, '')
                .slice(0, maxDigits);

            model[field] = onlyNumbers
                ? Number(onlyNumbers)
                : null;
        }
    });
};

const salaryFormatted = useThousandsFormat(() => props.modelContract, 'salary');
const transportAllowanceFormatted = useThousandsFormat(() => props.modelContract, 'transport_allowance');

const documentationErrors = computed(() => {
    return props.errors?.contract_health_entity_affiliation
        || props.errors?.health_entity_affiliation
        || [];
});
</script>

<template>
    <div class="breadcrumb">
        <button type="button" class="crumb-back" @click="emit('index')">
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
        <span class="active">Crear contrato</span>
    </div>

    <div class="container-data">
        <div class="split" :class="{ 'with-panel': props.addAnnexesVariables }">
            <div class="split-main">
                <div class="main-container">

                    <!-- TÍTULO -->
                    <div style="display: flex; justify-content: start; flex-direction: column;">
                        <h2 class="titulo">Crear contrato</h2>
                        <div v-if="documentationErrors.length" class="bg-red"
                            style="display:flex; gap:10px; margin-bottom:10px; align-items:flex-start;align-items: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                                viewBox="0 0 256 256" style="flex-shrink:0; margin-top:3px;">
                                <path
                                    d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z" />
                            </svg>

                            <div style="display:flex; flex-direction:column; gap:4px;">
                                <p v-for="(message, index) in documentationErrors" :key="index"
                                    style="font-size:13px; margin:0; line-height:1.4;">
                                    {{ message }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <template v-if="props.loadingData">
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
                        <!-- Los comentarios se aplican para los contratos en estado "Actualizar" o "Devuelto" -->
                        <!-- Cuando el estado sea "Pendiente" no se deberan visualizar dichos comentarios -->
                        <template v-if="props.modelContract.person_status == 'Actualizar'">
                            <div class="comment-card">
                                <div class="comment-left">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#5B4CD0"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M172,108a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,108Zm-12,28H96a12,12,0,0,0,0,24h64a12,12,0,0,0,0-24Zm76-8A108,108,0,0,1,78.77,224.15L46.34,235A20,20,0,0,1,21,209.66l10.81-32.43A108,108,0,1,1,236,128Zm-24,0A84,84,0,1,0,55.27,170.06a12,12,0,0,1,1,9.81l-9.93,29.79,29.79-9.93a12.1,12.1,0,0,1,3.8-.62,12,12,0,0,1,6,1.62A84,84,0,0,0,212,128Z">
                                        </path>
                                    </svg>

                                    <div class="comment-info">
                                        <span class="comment-title">COMENTARIO</span>
                                        <!-- Tipos de comentarios por el estado -->
                                        <p class="comment-text">{{ props.modelContract.person_observation }}</p>
                                    </div>
                                </div>

                                <span class="comment-date">20/09/2025</span>
                            </div>
                        </template>
                        <!-- <div style="display: flex; justify-content: end; margin-bottom: 10px;">
                            <button class="sections-add-btn" @click="openPreview(null)">
                                Vista previa
                            </button>
                        </div> -->
                        <div class="general-card">
                            <div class="general-header">
                                <div class="general-title-group" style="padding:10px">
                                    <h3 class="section-title">Información general del contrato</h3>
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
                                        <div class="contract-grid">

                                            <!-- Tipo de otrosí -->
                                            <div>
                                                <label class="label-bold">Tipo de contrato</label>
                                                <SearchSelect :options="props.contractTypes" optionKey="name"
                                                    valueKey="id" name="contract_type_id" id="contract_type_id"
                                                    placeholder="Tipo de contrato"
                                                    v-model="props.modelContract.contract_type_id" :disabled="true"
                                                    :error="props.errors?.contract_contract_type_id" />
                                                <p v-if="props.errors?.contract_contract_type_id" class="error-text">
                                                    {{ props.errors.contract_contract_type_id[0] }}
                                                </p>
                                            </div>

                                            <!-- Cargo -->
                                            <div>
                                                <label class="label-bold">Cargo</label>
                                                <SearchSelect :options="props.positions" optionKey="name" valueKey="id"
                                                    name="position_id" id="position_id" placeholder="Cargo"
                                                    v-model="props.modelContract.position_id" :disabled="true"
                                                    :error="props.errors?.contract_position_id" />
                                                <p v-if="props.errors?.contract_position_id" class="error-text">
                                                    {{ props.errors.contract_position_id[0] }}
                                                </p>
                                            </div>

                                            <!-- Valor del contrato -->
                                            <div>
                                                <label class="label-bold">Salario</label>
                                                <input v-model="salaryFormatted" type="text" class="input-box"
                                                    :class="{ 'disabled': !editGeneral, 'input-error': props.errors?.contract_salary }"
                                                    placeholder="Salario" :disabled="!editGeneral" maxlength="11" />
                                                <p v-if="props.errors?.contract_salary" class="error-text">
                                                    {{ props.errors.contract_salary[0] }}
                                                </p>
                                            </div>

                                            <!-- Periodo de pago -->
                                            <div>
                                                <label class="label-bold">Periodo de pago</label>
                                                <SearchSelect :options="props.paymentPeriods" optionKey="name"
                                                    valueKey="id" name="payment_period_id" id="payment_period_id"
                                                    placeholder="Periodo de pago"
                                                    v-model="props.modelContract.payment_period_id"
                                                    :disabled="!editGeneral"
                                                    :error="props.errors?.contract_payment_period_id" />
                                                <p v-if="props.errors?.contract_payment_period_id" class="error-text">
                                                    {{ props.errors.contract_payment_period_id[0] }}
                                                </p>
                                            </div>

                                            <!-- Auxilio de transporte -->
                                            <div>
                                                <label class="label-bold">Auxilio de transporte</label>
                                                <input type="text" class="input-box" maxlength="7"
                                                    v-model="transportAllowanceFormatted"
                                                    :class="{ 'disabled': !editGeneral, 'input-error': props.errors?.contract_transport_allowance }"
                                                    placeholder="Auxilio de transporte" :disabled="!editGeneral" />
                                                <p v-if="props.errors?.contract_transport_allowance" class="error-text">
                                                    {{ props.errors.contract_transport_allowance[0] }}
                                                </p>
                                            </div>

                                            <!-- Fecha inicio -->
                                            <div>
                                                <label class="label-bold">Fecha inicio de labores</label>
                                                <DateInput v-model="props.modelContract.start_date"
                                                    :class="{ 'disabled': !editGeneral }" :disabled="!editGeneral"
                                                    :error="props.errors?.contract_start_date" />
                                                <p v-if="props.errors?.contract_start_date" class="error-text">
                                                    {{ props.errors.contract_start_date[0] }}
                                                </p>
                                            </div>

                                            <!-- Fecha fin -->
                                            <div>
                                                <label class="label-bold">Fecha fin de labores</label>
                                                <DateInput v-model="props.modelContract.end_date"
                                                    :class="{ 'disabled': !editGeneral }" :disabled="!editGeneral"
                                                    :error="props.errors?.contract_end_date" />
                                                <p v-if="props.errors?.contract_end_date" class="error-text">
                                                    {{ props.errors.contract_end_date[0] }}
                                                </p>
                                            </div>

                                            <div>
                                                <label class="label-bold">Duración del contrato (meses)</label>
                                                <input :value="contractMonths" disabled type="number" min="0"
                                                    class="input-box disabled" placeholder="0"
                                                    :disabled="!editGeneral" />
                                            </div>

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
                                        <div class="contract-grid">

                                            <!-- Primer nombre -->
                                            <div>
                                                <label class="label-bold">Primer nombre</label>
                                                <input v-model="props.modelPerson.first_name" type="text" maxlength="25"
                                                    class="input-box" :class="{ 'disabled': !editWorker }"
                                                    placeholder="Primer nombre" :disabled="!editWorker" />
                                            </div>

                                            <!-- Segundo nombre -->
                                            <div>
                                                <label class="label-bold">Segundo nombre (Opcional)</label>
                                                <input v-model="props.modelPerson.second_name" type="text"
                                                    maxlength="25" class="input-box"
                                                    :class="{ 'disabled': !editWorker }" placeholder="Segundo nombre"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <!-- Primer apellido -->
                                            <div>
                                                <label class="label-bold">Primer apellido</label>
                                                <input v-model="props.modelPerson.first_last_name" type="text"
                                                    maxlength="25" class="input-box"
                                                    :class="{ 'disabled': !editWorker }" placeholder="Primer apellido"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <!-- Segundo apellido -->
                                            <div>
                                                <label class="label-bold">Segundo apellido (Opcional)</label>
                                                <input v-model="props.modelPerson.second_last_name" type="text"
                                                    maxlength="25" class="input-box"
                                                    :class="{ 'disabled': !editWorker }" placeholder="Segundo apellido"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <!-- Estado civil -->
                                            <div>
                                                <label class="label-bold">Estado civil</label>
                                                <SearchSelect :options="props.maritalStatuses" optionKey="name"
                                                    valueKey="id" v-model="props.modelPerson.marital_status_id"
                                                    placeholder="Estado civil" :disabled="!editWorker" />
                                            </div>

                                            <!-- Género -->
                                            <div>
                                                <label class="label-bold">Sexo</label>
                                                <SearchSelect :options="props.sexes" optionKey="name" valueKey="id"
                                                    v-model="props.modelPerson.sex_id" placeholder="Sexo"
                                                    :disabled="!editWorker" />
                                            </div>
                                        </div>


                                        <div class="card-separator"></div>

                                        <!-- ========== DATOS DEL DOCUMENTO ========== -->
                                        <p class="section-subtitle">Datos del documento</p>
                                        <div class="contract-grid">

                                            <div class="form-group">
                                                <label class="label-bold">Documento</label>
                                                <div class="row-2">
                                                    <SearchSelect
                                                        :options="props.documentTypes.person_document_issue || []"
                                                        optionKey="settings.abreviature" valueKey="id"
                                                        class="select-duo" placeholder="Tipo"
                                                        v-model="props.modelPerson.document_type_id"
                                                        :disabled="!editWorker" />
                                                    <input v-model="props.modelPerson.document_number" type="text"
                                                        class="input-box input-duo" :class="{ 'disabled': !editWorker }"
                                                        :disabled="!editWorker" placeholder="Documento"
                                                        maxlength="20" />
                                                </div>
                                            </div>

                                            <!-- Fecha expedicion -->
                                            <div>
                                                <label class="label-bold">Fecha de expedición</label>
                                                <DateInput v-model="props.modelPerson.document_issue_date"
                                                    :class="{ 'disabled': !editWorker }" :disabled="!editWorker" />
                                            </div>

                                            <!-- Pais -->
                                            <div>
                                                <label class="label-bold">País</label>
                                                <SearchSelect :options="props.countries" optionKey="name" valueKey="id"
                                                    v-model="props.modelPerson.document_issue_country_id"
                                                    placeholder="País"
                                                    :displayFormatter="opt => `${opt.emoji} ${opt.name}`"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <!-- Dept -->
                                            <div>
                                                <label class="label-bold">Departamento</label>
                                                <SearchSelect :options="props.departaments.person_document_issue || []"
                                                    optionKey="name" valueKey="id"
                                                    v-model="props.modelPerson.document_issue_departament_id"
                                                    placeholder="Departamento" :disabled="!editWorker" />
                                            </div>

                                            <!-- Ciudad -->
                                            <div>
                                                <label class="label-bold">Ciudad</label>
                                                <SearchSelect :options="props.cities.person_document_issue || []"
                                                    optionKey="name" valueKey="id"
                                                    v-model="props.modelPerson.document_issue_city_id"
                                                    placeholder="Ciudad" :disabled="!editWorker" />
                                            </div>
                                        </div>

                                        <div class="card-separator"></div>

                                        <!-- ========== LUGAR Y FECHA NACIMIENTO ========== -->
                                        <p class="section-subtitle">Lugar y fecha de nacimiento</p>

                                        <div class="contract-grid">

                                            <div>
                                                <label class="label-bold">País</label>
                                                <SearchSelect :options="props.countries" optionKey="name" valueKey="id"
                                                    v-model="props.modelPerson.birth_country_id" placeholder="País"
                                                    :displayFormatter="opt => `${opt.emoji} ${opt.name}`"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <div>
                                                <label class="label-bold">Departamento</label>
                                                <SearchSelect :options="props.departaments.person_birth || []"
                                                    optionKey="name" valueKey="id"
                                                    v-model="props.modelPerson.birth_departament_id"
                                                    placeholder="Departamento" :disabled="!editWorker" />
                                            </div>

                                            <div>
                                                <label class="label-bold">Ciudad</label>
                                                <SearchSelect :options="props.cities.person_birth || []"
                                                    optionKey="name" valueKey="id"
                                                    v-model="props.modelPerson.birth_city_id" placeholder="Ciudad"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <div>
                                                <label class="label-bold">Fecha</label>
                                                <DateInput v-model="props.modelPerson.birth_date"
                                                    :class="{ 'disabled': !editWorker }" :disabled="!editWorker" />
                                            </div>
                                        </div>


                                        <div class="card-separator"></div>

                                        <!-- ========== DATOS CONTACTO ========== -->
                                        <p class="section-subtitle">Datos contacto</p>

                                        <div class="contract-grid">

                                            <div>
                                                <label class="label-bold">Teléfono</label>
                                                <div class="row-2">
                                                    <SearchSelect class="select-duo" :options="props.countries"
                                                        optionKey="name" valueKey="id"
                                                        v-model="props.modelPerson.dialing_country_id"
                                                        placeholder="Prefijo"
                                                        :displayFormatter="opt => `${opt.emoji} +${opt.phone_code}`"
                                                        :disabled="!editWorker" />

                                                    <input v-model="props.modelPerson.phone_number" type="text"
                                                        class="input-box input-duo" :class="{ 'disabled': !editWorker }"
                                                        placeholder="Teléfono" :disabled="!editWorker" maxlength="20" />
                                                </div>
                                            </div>

                                            <div>
                                                <label class="label-bold">Correo electrónico</label>
                                                <input v-model="props.modelPerson.email" type="email" class="input-box"
                                                    :class="{ 'disabled': !editWorker }" maxlength="75"
                                                    placeholder="correo@ejemplo.com" :disabled="!editWorker" />
                                            </div>
                                        </div>

                                        <div class="card-separator"></div>

                                        <!-- ========== RESIDENCIA ACTUAL ========== -->
                                        <p class="section-subtitle">Residencia actual</p>

                                        <div class="contract-grid">

                                            <div>
                                                <label class="label-bold">País</label>
                                                <SearchSelect :options="props.countries" optionKey="name" valueKey="id"
                                                    v-model="props.modelPerson.country_id" placeholder="País"
                                                    :displayFormatter="opt => `${opt.emoji} ${opt.name}`"
                                                    :disabled="!editWorker" />
                                            </div>

                                            <div>
                                                <label class="label-bold">Departamento</label>
                                                <SearchSelect :options="props.departaments.person_residence || []"
                                                    optionKey="name" valueKey="id"
                                                    v-model="props.modelPerson.departament_id"
                                                    placeholder="Departamento" :disabled="!editWorker" />
                                            </div>

                                            <div>
                                                <label class="label-bold">Ciudad</label>
                                                <SearchSelect :options="props.cities.person_residence || []"
                                                    optionKey="name" valueKey="id" v-model="props.modelPerson.city_id"
                                                    placeholder="Ciudad" :disabled="!editWorker" />
                                            </div>

                                            <div>
                                                <label class="label-bold">Dirección</label>
                                                <input v-model="props.modelPerson.address" type="text" class="input-box"
                                                    :class="{ 'disabled': !editWorker }" placeholder="Dirección"
                                                    maxlength="75" :disabled="!editWorker" />
                                            </div>

                                            <div>
                                                <label class="label-bold">Barrio</label>
                                                <input v-model="props.modelPerson.neighborhood" type="text"
                                                    maxlength="50" class="input-box"
                                                    :class="{ 'disabled': !editWorker }" placeholder="Barrio"
                                                    :disabled="!editWorker" />
                                            </div>
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
                                        <div class="contract-grid">

                                            <div>
                                                <div>
                                                    <label class="label-bold">País</label>
                                                    <input
                                                        :value="`${props.entities.find(e => e.id === props.modelHeadquarter.entity_id)?.country?.emoji} ${props.entities.find(e => e.id === props.modelHeadquarter.entity_id)?.country?.name}`"
                                                        type="text" class="input-box disabled" placeholder="País"
                                                        disabled />
                                                </div>
                                            </div>

                                            <div>
                                                <div>
                                                    <label class="label-bold">Departamento</label>
                                                    <input
                                                        :value="props.headquarters.find(e => e.id === props.modelHeadquarter.id)?.city?.departament?.name"
                                                        type="text" class="input-box disabled"
                                                        placeholder="Departamento" disabled />
                                                </div>
                                            </div>

                                            <div>
                                                <div>
                                                    <label class="label-bold">Ciudad</label>
                                                    <input
                                                        :value="props.headquarters.find(e => e.id === props.modelHeadquarter.id)?.city?.name"
                                                        type="text" class="input-box disabled" placeholder="Ciudad"
                                                        disabled />
                                                </div>
                                            </div>

                                            <!-- Empresa -->
                                            <div>
                                                <label class="label-bold">Empresa</label>
                                                <SearchSelect :options="props.enterprises" optionKey="name"
                                                    valueKey="id" placeholder="Empresa"
                                                    v-model="props.modelHeadquarter.enterprise_id"
                                                    :disabled="!editEmployer" />
                                            </div>

                                            <!-- Entidad -->
                                            <div>
                                                <label class="label-bold">Entidad</label>
                                                <SearchSelect :options="props.entities" optionKey="name" valueKey="id"
                                                    placeholder="Entidad" v-model="props.modelHeadquarter.entity_id"
                                                    :disabled="!editEmployer" />
                                            </div>

                                            <!-- NIT -->
                                            <div>
                                                <label class="label-bold">Documento</label>
                                                <input maxlength="20"
                                                    :value="props.entities.find(e => e.id === props.modelHeadquarter.entity_id)?.document_number"
                                                    type="text" class="input-box" placeholder="Documento"
                                                    :disabled="!editEmployer" :class="{ disabled: !editEmployer }" />
                                            </div>

                                            <!-- Sede -->
                                            <div>
                                                <label class="label-bold">Sede</label>
                                                <SearchSelect :options="props.headquarters" optionKey="name"
                                                    valueKey="id" placeholder="Nombre de sede"
                                                    v-model="props.modelHeadquarter.id" :disabled="!editEmployer" />
                                            </div>

                                            <!-- Dirección -->
                                            <div>
                                                <label class="label-bold">Dirección</label>
                                                <input v-model="props.modelHeadquarter.address" type="text"
                                                    class="input-box" placeholder="Dirección" :disabled="!editEmployer"
                                                    :class="{ disabled: !editEmployer }" maxlength="75" />
                                            </div>

                                            <!-- Teléfono -->
                                            <div v-if="false">
                                                <label class="label-bold">Teléfono</label>
                                                <div class="row-2">
                                                    <SearchSelect class="select-duo" :options="[]" optionKey="name"
                                                        valueKey="id" placeholder="Prefijo"
                                                        v-model="employerInfo.prefijoTelefonoEmpresa"
                                                        :disabled="!editEmployer" />

                                                    <input v-model="employerInfo.telefonoEmpresa" type="text"
                                                        class="input-box input-duo" placeholder="Número de teléfono"
                                                        :disabled="!editEmployer"
                                                        :class="{ disabled: !editEmployer }" />
                                                </div>
                                            </div>

                                            <!-- Correo electrónico -->
                                            <div v-if="false">
                                                <label class="label-bold">Correo electrónico</label>
                                                <input v-model="employerInfo.emailEmpresa" type="email"
                                                    class="input-box" placeholder="empresa@correo.com"
                                                    :disabled="!editEmployer" :class="{ disabled: !editEmployer }" />
                                            </div>
                                        </div>

                                        <hr class="card-separator" />

                                        <!-- ========== REPRESENTANTE LEGAL ========== -->
                                        <p class="section-subtitle">Representante legal</p>

                                        <div class="contract-grid">

                                            <!-- Primer nombre -->
                                            <div>
                                                <label class="label-bold">Primer nombre</label>
                                                <input v-model="props.modelLegalRepresentative.first_name" type="text"
                                                    class="input-box" :class="{ 'disabled': !editEmployer }"
                                                    placeholder="Primer nombre" :disabled="!editEmployer"
                                                    maxlength="25" />
                                            </div>

                                            <!-- Segundo nombre -->
                                            <div>
                                                <label class="label-bold">Segundo nombre (Opcional)</label>
                                                <input v-model="props.modelLegalRepresentative.second_name" type="text"
                                                    class="input-box" :class="{ 'disabled': !editEmployer }"
                                                    placeholder="Segundo nombre" :disabled="!editEmployer"
                                                    maxlength="25" />
                                            </div>

                                            <!-- Primer apellido -->
                                            <div>
                                                <label class="label-bold">Primer apellido</label>
                                                <input v-model="props.modelLegalRepresentative.first_last_name"
                                                    type="text" class="input-box" :class="{ 'disabled': !editEmployer }"
                                                    placeholder="Primer apellido" :disabled="!editEmployer"
                                                    maxlength="25" />
                                            </div>

                                            <!-- Segundo apellido -->
                                            <div>
                                                <label class="label-bold">Segundo apellido (Opcional)</label>
                                                <input v-model="props.modelLegalRepresentative.second_last_name"
                                                    type="text" class="input-box" :class="{ 'disabled': !editEmployer }"
                                                    placeholder="Segundo apellido" :disabled="!editEmployer"
                                                    maxlength="25" />
                                            </div>

                                            <div>
                                                <label class="label-bold">País</label>
                                                <SearchSelect :options="props.countries" optionKey="name" valueKey="id"
                                                    v-model="props.modelLegalRepresentative.document_issue_country_id"
                                                    placeholder="País"
                                                    :displayFormatter="opt => `${opt.emoji} ${opt.name}`"
                                                    :disabled="!editEmployer" />
                                            </div>

                                            <div>
                                                <label class="label-bold">Departamento</label>
                                                <SearchSelect
                                                    :options="props.departaments.legal_representative_document_issue || []"
                                                    optionKey="name" valueKey="id"
                                                    v-model="props.modelLegalRepresentative.document_issue_departament_id"
                                                    placeholder="Departamento" :disabled="!editEmployer" />
                                            </div>

                                            <div>
                                                <label class="label-bold">Ciudad</label>
                                                <SearchSelect
                                                    :options="props.cities.legal_representative_document_issue || []"
                                                    optionKey="name" valueKey="id"
                                                    v-model="props.modelLegalRepresentative.document_issue_city_id"
                                                    placeholder="Ciudad" :disabled="!editEmployer" />
                                            </div>

                                            <!-- Documento -->

                                            <div class="form-group">
                                                <label class="label-bold">Documento</label>
                                                <div class="row-2">
                                                    <SearchSelect
                                                        :options="props.documentTypes.legal_representative_document_issue || []"
                                                        optionKey="settings.abreviature" valueKey="id"
                                                        class="select-duo" placeholder="Tipo"
                                                        v-model="props.modelLegalRepresentative.document_type_id"
                                                        :disabled="!editEmployer" />
                                                    <input v-model="props.modelLegalRepresentative.document_number"
                                                        type="text" class="input-box input-duo"
                                                        :class="{ 'disabled': !editEmployer }" :disabled="!editEmployer"
                                                        placeholder="Documento" maxlength="20" />
                                                </div>
                                            </div>

                                            <!-- Teléfono -->

                                            <div>
                                                <label class="label-bold">Teléfono</label>
                                                <div class="row-2">
                                                    <SearchSelect class="select-duo" :options="props.countries"
                                                        optionKey="name" valueKey="id"
                                                        v-model="props.modelLegalRepresentative.dialing_country_id"
                                                        placeholder="Prefijo"
                                                        :displayFormatter="opt => `${opt.emoji} +${opt.phone_code}`"
                                                        :disabled="!editEmployer" />

                                                    <input v-model="props.modelLegalRepresentative.phone_number"
                                                        type="text" class="input-box input-duo"
                                                        :class="{ 'disabled': !editEmployer }" placeholder="Teléfono"
                                                        :disabled="!editEmployer" maxlength="20" />
                                                </div>
                                            </div>

                                            <div>
                                                <label class="label-bold">Correo electrónico</label>
                                                <input v-model="props.modelLegalRepresentative.email" type="email"
                                                    class="input-box" :class="{ 'disabled': !editEmployer }" maxlength="75"
                                                    placeholder="correo@ejemplo.com" :disabled="!editEmployer" />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </transition>

                        </div>
                        <template v-if="!props.hasContractTemplates">
                            <div class="pending-wrap">
                                <div class="pending-badge">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#f9a825"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                        </path>
                                    </svg>
                                </div>

                                <h3 class="title-data">Plantilla de contrato no disponible.</h3>
                                <p class="subtitle-data">
                                    No existe una plantilla configurada para el tipo de contrato {{
                                        selectedContractTypeName }}.
                                </p>
                            </div>
                        </template>
                        <template v-else>
                            <div class="general-card"
                                v-for="(document, index) in props.modelContract?.settings?.documents || []"
                                :key="index">
                                <div class="general-header">
                                    <div class="general-title-group">
                                        <h3 class="section-title">{{ document.template.relationships.file_subtype.name
                                            }}
                                        </h3>
                                    </div>

                                    <button type="button" class="section-toggle" @click="toggleDocument(index)">
                                        <!-- aquí puedes poner tu ícono de chevron/editar -->
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#5b4cd0"
                                            viewBox="0 0 256 256" :style="{
                                                transform: documentsOpen[index] ? 'rotate(90deg)' : 'rotate(0deg)',
                                                transition: 'transform .18s'
                                            }">
                                            <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2">
                                            </path>
                                            <path
                                                d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm29.66-93.66a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32L140.69,128,106.34,93.66a8,8,0,0,1,11.32-11.32Z">
                                            </path>
                                        </svg>
                                    </button>
                                </div>

                                <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                                    <div v-show="documentsOpen[index]" class="general-body">
                                        <div style="display: flex; flex-direction: column; gap: 10px;">
                                            <div class="sections-wrapper" ref="wrapperRef">

                                                <!-- LISTA DE SECCIONES (CADA UNA CON CABECERA TIPO "CONTRATO") -->
                                                <div class="sections-list">
                                                    <div v-for="section in document.template.settings.sections"
                                                        :key="section.id" class="section-item" style="margin: 10px;">
                                                        <div class="section-header">
                                                            <div class="section-left">
                                                                <!-- EDITANDO -->
                                                                <template v-if="section.isEditing">
                                                                    <input v-model="section.tempTitle" class="input-box"
                                                                        @keyup.enter="saveSectionTitle(section)" />
                                                                </template>

                                                                <!-- NORMAL -->
                                                                <template v-else>
                                                                    <span class="section-title">{{ section.title
                                                                        }}</span>
                                                                </template>
                                                            </div>

                                                            <div class="section-right">
                                                                <Button v-if="section.isEditing" title="Guardar"
                                                                    icon="save" variant="transparent"
                                                                    @click="saveSectionTitle(section)" />
                                                                <span class="section-pill"> {{ section.subsectionsCount
                                                                    }}
                                                                    subsecciones </span>

                                                                <Button v-if="!section.isLocked" title="" icon="more"
                                                                    class="more-button" variant="transparent"
                                                                    @click.stop="toggleSectionMenu(section.id)" />
                                                                <div v-if="!section.isEditing && openMenuId === section.id"
                                                                    class="section-dropdown">
                                                                    <button type="button" class="size-option"
                                                                        @click="editSection(section)">
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                            width="18" height="18" fill="#5b4cd0"
                                                                            viewBox="0 0 256 256">
                                                                            <path
                                                                                d="M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM91,204H52V165l84-84,39,39ZM192,103,153,64l18.34-18.34,39,39Z">
                                                                            </path>
                                                                        </svg>
                                                                        <div class="size-option-text">
                                                                            <span
                                                                                class="size-option-title">Editar</span>
                                                                        </div>
                                                                    </button>

                                                                    <button type="button" class="size-option"
                                                                        @click="deleteSection(document.template.settings.sections, section.id)">
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


                                                                <!-- toggle colapsable -->
                                                                <button class="section-toggle"
                                                                    :disabled="section.isEditing"
                                                                    :class="{ 'is-disabled': section.isEditing }"
                                                                    @click="toggleSection(section)">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32"
                                                                        height="32" fill="#5b4cd0" viewBox="0 0 256 256"
                                                                        :style="{
                                                                            transform: section.open ? 'rotate(90deg)' : 'rotate(0deg)',
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

                                                        <!-- CONTENIDO COLAPSABLE -->
                                                        <transition @enter="accEnter" @after-enter="accAfterEnter"
                                                            @leave="accLeave">
                                                            <div v-if="section.open" class="section-body-anim"
                                                                style="padding: 0 10px 10px 10px;">
                                                                <!-- LISTA DE SUBSECCIONES (PREÁMBULO, CLÁUSULAS, etc.) -->
                                                                <div v-if="section.subsections && section.subsections.length"
                                                                    class="subsections-list">
                                                                    <div v-for="sub in section.subsections"
                                                                        :key="sub.id" class="subsection-item unified">
                                                                        <!-- fila compacta -->
                                                                        <div class="subsection-header">
                                                                            <div class="section-left">
                                                                                <template v-if="sub.open">
                                                                                    <input class="input-box"
                                                                                        :disabled="!isOPS"
                                                                                        :class="{ 'disabled': !isOPS }"
                                                                                        v-model="sub.title" />
                                                                                </template>
                                                                                <template v-else>
                                                                                    <span class="subsection-title">{{
                                                                                        sub.title
                                                                                    }}</span>
                                                                                </template>
                                                                            </div>

                                                                            <div class="subsection-actions">
                                                                                <Button v-if="sub.open && isOPS"
                                                                                    title="Guardar" icon="save"
                                                                                    variant="transparent"
                                                                                    @click="saveSectionTitle(section)" />
                                                                                <Button v-if="!sub.isLocked" title=""
                                                                                    icon="more" variant="transparent"
                                                                                    @click.stop="toggleSubMenu(sub.id)" />
                                                                                <div v-if="openSubMenuId === sub.id"
                                                                                    class="section-dropdown subsection-dropdown">
                                                                                    <button type="button"
                                                                                        class="size-option"
                                                                                        @click="deleteSubsection(section, sub)">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                                            width="18" height="18"
                                                                                            fill="#c40003"
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
                                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                                        width="32" height="32"
                                                                                        fill="#5b4cd0"
                                                                                        viewBox="0 0 256 256" :style="{
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
                                                                        <transition @enter="accEnter"
                                                                            @after-enter="accAfterEnter"
                                                                            @leave="accLeave">
                                                                            <div v-show="sub.open"
                                                                                class="subsection-card"
                                                                                :class="{ 'not-padding': !sub.open }">
                                                                                <div v-if="isOPS"
                                                                                    class="subsection-card-toolbar">
                                                                                    <div>
                                                                                        <label class="text">Tipo de
                                                                                            entrada</label>
                                                                                        <SearchSelect v-model="sub.type"
                                                                                            :options="tipoEntradaOptions"
                                                                                            optionKey="label"
                                                                                            valueKey="value"
                                                                                            placeholder="Tipo" />
                                                                                    </div>
                                                                                </div>
                                                                                <div v-if="sub.type === 'Lista' && isOPS"
                                                                                    class="subsection-extra">
                                                                                    <div>
                                                                                        <label
                                                                                            class="text">Título</label>
                                                                                        <input v-model="clauseTitle"
                                                                                            type="text"
                                                                                            class="input-box subsection-input"
                                                                                            placeholder="Título" />
                                                                                    </div>

                                                                                    <div>
                                                                                        <label class="text">Tipo de
                                                                                            dato</label>
                                                                                        <SearchSelect
                                                                                            v-model="sub.list_type"
                                                                                            class="subsection-select"
                                                                                            :options="tipoValorOptions"
                                                                                            optionKey="label"
                                                                                            valueKey="value"
                                                                                            placeholder="Tipo" />
                                                                                    </div>
                                                                                </div>

                                                                                <!-- aquí puedes meter tu editor rico; de momento un textarea -->
                                                                                <div>
                                                                                    <AdvancedEditor
                                                                                        v-if="sub.type === 'Texto'"
                                                                                        v-model="sub.content"
                                                                                        :ref="el => registerEditorRef(`text-${sub.id}`, el)"
                                                                                        @focus="handleEditorFocus(`text-${sub.id}`)"
                                                                                        :disabled="!isOPS" />
                                                                                    <AdvancedEditor
                                                                                        v-else-if="sub.type === 'Lista' && isOPS"
                                                                                        v-model="clauseContent"
                                                                                        :ref="el => registerEditorRef(`clause-${sub.id}`, el)"
                                                                                        @focus="handleEditorFocus(`clause-${sub.id}`)"
                                                                                        :disabled="!isOPS" />


                                                                                </div>
                                                                                <div v-if="sub.type === 'Lista' && isOPS"
                                                                                    class="form-buttons">
                                                                                    <button class="sections-add-btn"
                                                                                        @click="saveClause">Añadir</button>
                                                                                </div>
                                                                                <template v-if="sub.type === 'Lista'">
                                                                                    <div class="clauses-list">
                                                                                        <div v-for="(clause, index) in sub.clauses"
                                                                                            class="clause-item"
                                                                                            draggable="true"
                                                                                            @dragstart="onDragStart(sub, clause, index, $event)"
                                                                                            @dragenter.prevent="onDragEnter(sub, clause, index)"
                                                                                            @dragend="onDragEnd">
                                                                                            <!-- ícono de “arrastrar” -->
                                                                                            <div>
                                                                                                <button
                                                                                                    class="clause-handle"
                                                                                                    @mousedown.prevent
                                                                                                    type="button">
                                                                                                    <svg width="16"
                                                                                                        height="16"
                                                                                                        viewBox="0 0 16 16">
                                                                                                        <path
                                                                                                            d="M3 4h10M3 8h10M3 12h10"
                                                                                                            stroke="currentColor"
                                                                                                            stroke-width="1.4"
                                                                                                            stroke-linecap="round" />
                                                                                                    </svg>
                                                                                                </button>
                                                                                            </div>

                                                                                            <!-- número -->
                                                                                            <div>
                                                                                                <span
                                                                                                    class="clause-number">
                                                                                                    {{
                                                                                                        sub.list_type ===
                                                                                                            'numeric'
                                                                                                            ? (index + 1)
                                                                                                            :
                                                                                                            toSpanishOrdinal(index
                                                                                                                +
                                                                                                                1).toUpperCase()
                                                                                                    }}
                                                                                                </span>
                                                                                            </div>

                                                                                            <!-- texto -->
                                                                                            <div>
                                                                                                <p class="clause-text">
                                                                                                    <span
                                                                                                        class="clause-title">{{
                                                                                                            clause.title
                                                                                                        }}</span>
                                                                                                    <span
                                                                                                        class="clause-separator">
                                                                                                        —
                                                                                                    </span>
                                                                                                    <span> {{
                                                                                                        cleanHtml(clause.text)
                                                                                                    }}
                                                                                                    </span>
                                                                                                </p>
                                                                                            </div>

                                                                                            <!-- botón editar -->
                                                                                            <!-- <div>
                                                                                                <Button title="Editar"
                                                                                                    icon="pencil"
                                                                                                    @click="editClause(sub, clause)"
                                                                                                    variant="question" />
                                                                                            </div> -->
                                                                                        </div>
                                                                                    </div>
                                                                                </template>
                                                                            </div>
                                                                        </transition>
                                                                    </div>
                                                                </div>

                                                                <!-- BLOQUE "AGREGAR SUBSECCIÓN" -->
                                                                <div v-if="isOPS" class="sections-empty"
                                                                    @click.stop="addSubsection(section)">
                                                                    <button class="sections-plus">
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                            width="18" height="18" fill="#5b4cd0"
                                                                            viewBox="0 0 256 256">
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
                                                <!-- Agregar anexos solo para cuando la persona sea por OPS -->
                                                <!-- El agregar anexos aplica solo para los estados "PENDIENTE" "ACTUALIZAR" "DEVUELTO" -->
                                                <div v-if="isOPS" class="sections-footer" @click="emit('addAnnexes')"
                                                    style="padding: 10px;">
                                                    <button type="button" class="add-link"
                                                        @click="addSection(document.template.settings.sections)">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                            fill="currentColor" viewBox="0 0 256 256">
                                                            <path
                                                                d="M128,24A104,104,0,1,0,232,128,104.13,104.13,0,0,0,128,24Zm40,112H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32a8,8,0,0,1,0,16Z">
                                                            </path>
                                                        </svg>
                                                        Agregar anexos
                                                    </button>
                                                </div>
                                                <!-- BOTÓN "AGREGAR SECCIÓN" ABAJO -->
                                            </div>
                                        </div>
                                    </div>
                                </transition>
                            </div>
                            <div class="sections-footer">
                                <button class="sections-cancel-btn" @click="emit('index')">
                                    <span>Cancelar</span>
                                </button>
                                <button class="sections-add-btn" @click="emit('submitContractStore')">
                                    Crear contrato
                                </button>
                            </div>
                        </template>


                    </template>

                </div>
            </div>
            <div class="slide-panel">
                <div class="split-panel" v-if="props.addAnnexesVariables">
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
    <pdfPreview v-if="showPreview && preview.url" :key="preview.url" :show="showPreview" :pdfUrl="preview.url"
        :pdfName="preview.name" @close="showPreview = false" />
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
    margin-bottom: 10px;
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

.general-title-group {
    padding: 10px;
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

.comment-card {
    border: 2px solid #5B4CD0;
    border-radius: 10px;
    padding: 14px 18px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background: #fff;
    font-family: Poppins, sans-serif;
    margin: 10px 0;
}

.comment-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.comment-title {
    font-size: 14px;
    font-weight: 700;
    color: #5B4CD0;
}

.comment-text {
    margin: 4px 0 0;
    font-size: 12px;
    color: #444;
    font-weight: 500;
}

.comment-date {
    font-size: 12px;
    color: #9CA3AF;
    white-space: nowrap;
    margin-left: 10px;
}

.add-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
    color: #5b4cd0;
    font-weight: 600;
}

.pending-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 32px 16px 24px;
    background: linear-gradient(180deg, #ffe08a 0%, #ffffff 50%);
    border-radius: 16px;
    width: 100%;
    height: 100%;
    gap: 10px;
}

/* círculo del check con degradado suave */
.pending-badge {
    width: 74px;
    height: 74px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: radial-gradient(closest-side, #fadf88 60%, #fff3cd 100%);
    border: 1px solid #d3f1dc;
    box-shadow: 0 4px 18px rgba(30, 142, 62, .12), inset 0 0 0 6px #f2fbf6;
    margin-bottom: 14px;
}

.contract-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
}

.contract-grid>* {
    min-width: 0;
}

.contract-grid .full-width {
    grid-column: 1 / -1;
}

@media (max-width: 1600px) {
    .split.with-panel .contract-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (max-width: 1280px) {
    .contract-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 768px) {
    .contract-grid {
        grid-template-columns: 1fr;
    }
}
</style>